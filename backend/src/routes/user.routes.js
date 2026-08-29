import bcrypt from "bcryptjs";
import crypto from "crypto";
import { Router } from "express";
import { requireAuth, signAuthToken } from "../middleware/auth.js";
import { rateLimit } from "../middleware/rateLimit.js";
import { prisma } from "../lib/prisma.js";

const router = Router();
const authLimiter = rateLimit({
  name: "auth",
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: "Too many account attempts. Please try again later."
});
const passwordLimiter = rateLimit({
  name: "password",
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many password attempts. Please try again later."
});

function publicUser(user) {
  return {
    id: user.id,
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    role: user.role || "MEMBER",
    emailVerified: Boolean(user.emailVerified),
    bio: user.bio || "Learning and sharing in the GharDaari community.",
    profileImage: user.profileImage || ""
  };
}

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validPassword(password) {
  return typeof password === "string" && password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
}

function tokenHash(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function newAccountToken() {
  return crypto.randomBytes(32).toString("hex");
}

function normalizeSecurityAnswer(value) {
  return String(value || "").trim().toLowerCase().replace(/\s+/g, " ");
}

async function hashSecurityAnswer(value) {
  return bcrypt.hash(normalizeSecurityAnswer(value), 10);
}

async function securityAnswerMatches(value, hash) {
  if (!hash) return false;
  return bcrypt.compare(normalizeSecurityAnswer(value), hash);
}

function adminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

async function roleForEmail(email) {
  const normalized = String(email || "").toLowerCase();
  if (adminEmails().includes(normalized)) return "ADMIN";

  if (process.env.NODE_ENV !== "production") {
    const userCount = await prisma.user.count();
    if (userCount === 0) return "ADMIN";
  }

  return "MEMBER";
}

async function syncAdminRole(user) {
  const normalized = String(user.email || "").toLowerCase();
  const shouldPromoteFromEnv = adminEmails().includes(normalized);

  if (shouldPromoteFromEnv && user.role !== "ADMIN") {
    return prisma.user.update({
      where: { id: user.id },
      data: { role: "ADMIN" }
    });
  }

  if (process.env.NODE_ENV !== "production" && user.role !== "ADMIN") {
    const firstUser = await prisma.user.findFirst({ orderBy: { id: "asc" } });
    if (firstUser?.id === user.id) {
      return prisma.user.update({
        where: { id: user.id },
        data: { role: "ADMIN" }
      });
    }
  }

  return user;
}

function authPayload(user) {
  return {
    user: publicUser(user),
    token: signAuthToken(user)
  };
}

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const blocks = await prisma.blockedUser.findMany({
      where: {
        OR: [{ blockerId: req.user.id }, { blockedId: req.user.id }]
      }
    });
    const blockedIds = blocks.map((block) => block.blockerId === req.user.id ? block.blockedId : block.blockerId);
    const users = await prisma.user.findMany({
      where: {
        id: {
          notIn: [req.user.id].concat(blockedIds)
        }
      },
      orderBy: { createdAt: "desc" }
    });

    res.json(users.map(publicUser));
  } catch (error) {
    next(error);
  }
});

router.post("/signup", authLimiter, async (req, res, next) => {
  try {
    const { fullName, username, password } = req.body;
    const email = String(req.body.email || "").trim().toLowerCase();
    const motherName = normalizeSecurityAnswer(req.body.motherName);
    const birthMonth = normalizeSecurityAnswer(req.body.birthMonth);

    if (!fullName || !username || !email || !password || !motherName || !birthMonth) {
      return res.status(400).json({ message: "Please complete all signup fields." });
    }

    if (!validEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email." });
    }

    if (!validPassword(password)) {
      return res.status(400).json({ message: "Password must be at least 8 characters and include a letter and a number." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        fullName,
        username,
        email,
        passwordHash,
        role: await roleForEmail(email),
        emailVerified: true,
        bio: "New member of the GharDaari community.",
        securityMotherNameHash: await hashSecurityAnswer(motherName),
        securityBirthMonthHash: await hashSecurityAnswer(birthMonth)
      }
    });

    res.status(201).json({
      ...authPayload(user),
      message: "Signup successful. Security questions are saved for password reset."
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ message: "Email or username already exists." });
    }

    next(error);
  }
});

router.post("/login", authLimiter, async (req, res, next) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const { password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please enter email and password." });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ message: "No account found with this email." });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    res.json(authPayload(await syncAdminRole(user)));
  } catch (error) {
    next(error);
  }
});

router.post("/forgot-password", passwordLimiter, async (req, res, next) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const motherName = normalizeSecurityAnswer(req.body.motherName);
    const birthMonth = normalizeSecurityAnswer(req.body.birthMonth);

    if (!validEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email." });
    }

    if (!motherName || !birthMonth) {
      return res.status(400).json({ message: "Please answer both security questions." });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "These security answers do not match this account." });
    }

    const motherMatches = await securityAnswerMatches(motherName, user.securityMotherNameHash);
    const monthMatches = await securityAnswerMatches(birthMonth, user.securityBirthMonthHash);
    if (!motherMatches || !monthMatches) {
      return res.status(400).json({ message: "These security answers do not match this account." });
    }

    const resetToken = newAccountToken();
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetTokenHash: tokenHash(resetToken),
        passwordResetExpiresAt: new Date(Date.now() + 60 * 60 * 1000)
      }
    });

    res.json({
      message: "Security answers matched. You can now reset your password.",
      resetToken
    });
  } catch (error) {
    next(error);
  }
});

router.post("/reset-password", passwordLimiter, async (req, res, next) => {
  try {
    const token = String(req.body.token || "").trim();
    const password = String(req.body.password || "");

    if (!token || !validPassword(password)) {
      return res.status(400).json({ message: "A valid reset token and stronger new password are required." });
    }

    const user = await prisma.user.findFirst({
      where: {
        passwordResetTokenHash: tokenHash(token),
        passwordResetExpiresAt: { gt: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({ message: "This reset link is invalid or expired." });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: await bcrypt.hash(password, 10),
        passwordResetTokenHash: null,
        passwordResetExpiresAt: null
      }
    });

    res.json({ message: "Password reset successful. You can login now." });
  } catch (error) {
    next(error);
  }
});

router.post("/change-password", requireAuth, passwordLimiter, async (req, res, next) => {
  try {
    const currentPassword = String(req.body.currentPassword || "");
    const newPassword = String(req.body.newPassword || "");

    if (!currentPassword || !validPassword(newPassword)) {
      return res.status(400).json({ message: "Current password and a stronger new password are required." });
    }

    const passwordMatches = await bcrypt.compare(currentPassword, req.user.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({ message: "Current password is incorrect." });
    }

    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        passwordHash: await bcrypt.hash(newPassword, 10),
        passwordResetTokenHash: null,
        passwordResetExpiresAt: null
      }
    });

    res.json({ message: "Password changed successfully." });
  } catch (error) {
    next(error);
  }
});

router.get("/me", requireAuth, async (req, res) => {
  res.json(publicUser(req.user));
});

router.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Invalid user id." });
    }

    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json(publicUser(user));
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", requireAuth, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { fullName, username, email, bio, profileImage } = req.body;

    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Invalid user id." });
    }

    if (id !== req.user.id) {
      return res.status(403).json({ message: "You can only update your own profile." });
    }

    if (!fullName || !username || !email || !bio) {
      return res.status(400).json({ message: "Please complete all profile fields." });
    }

    if (!validEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email." });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { fullName, username, email, bio, profileImage: profileImage || null }
    });

    res.json(publicUser(user));
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ message: "Email or username already exists." });
    }

    if (error.code === "P2025") {
      return res.status(404).json({ message: "User not found." });
    }

    next(error);
  }
});

export default router;
