import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

const JWT_SECRET = process.env.JWT_SECRET || "ghardaari-dev-secret-change-me";

export function signAuthToken(user) {
  return jwt.sign(
    {
      sub: String(user.id),
      id: user.id,
      username: user.username
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export async function requireAuth(req, res, next) {
  try {
    const header = req.get("authorization") || "";
    const match = header.match(/^Bearer\s+(.+)$/i);

    if (!match) {
      return res.status(401).json({ message: "Please login again." });
    }

    const payload = jwt.verify(match[1], JWT_SECRET);
    const userId = Number(payload.sub || payload.id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(401).json({ message: "Please login again." });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(401).json({ message: "Please login again." });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Please login again." });
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Admin access is required." });
  }

  next();
}
