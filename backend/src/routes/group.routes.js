import { GroupRole } from "@prisma/client";
import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { prisma } from "../lib/prisma.js";

const router = Router();

router.use(requireAuth);

async function blockedUserIds(userId) {
  const blocks = await prisma.blockedUser.findMany({
    where: {
      OR: [{ blockerId: userId }, { blockedId: userId }]
    }
  });

  return blocks.map((block) => block.blockerId === userId ? block.blockedId : block.blockerId);
}

function publicGroup(group, currentUserId, blocked) {
  return {
    id: `group-${group.id}`,
    dbId: group.id,
    name: group.name,
    about: group.description || "",
    messages: group.messages.filter((message) => !blocked.includes(message.senderId)).map((message) => ({
      id: message.id,
      sender: message.senderId === currentUserId ? "You" : message.sender.fullName,
      senderId: message.senderId,
      text: message.messageText,
      time: message.createdAt
    }))
  };
}

router.get("/", async (req, res, next) => {
  try {
    const blocked = await blockedUserIds(req.user.id);
    const groups = await prisma.group.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          include: { sender: true }
        }
      }
    });

    res.json(groups.map((group) => publicGroup(group, req.user.id, blocked)));
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const name = String(req.body.name || "").trim();
    const description = String(req.body.description || "").trim();

    if (!name || !description) {
      return res.status(400).json({ message: "Group name and description are required." });
    }

    const group = await prisma.group.create({
      data: {
        createdById: req.user.id,
        name,
        description,
        members: {
          create: {
            userId: req.user.id,
            role: GroupRole.ADMIN
          }
        },
        messages: {
          create: {
            senderId: req.user.id,
            messageText: "Created this group."
          }
        }
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          include: { sender: true }
        }
      }
    });

    res.status(201).json(publicGroup(group, req.user.id, []));
  } catch (error) {
    next(error);
  }
});

router.post("/:id/messages", async (req, res, next) => {
  try {
    const groupId = Number(req.params.id);
    const messageText = String(req.body.messageText || "").trim();

    if (!Number.isInteger(groupId) || !messageText) {
      return res.status(400).json({ message: "Valid group and message are required." });
    }

    const message = await prisma.groupMessage.create({
      data: { groupId, senderId: req.user.id, messageText },
      include: { sender: true }
    });

    res.status(201).json({
      id: message.id,
      sender: message.sender.fullName,
      senderId: message.senderId,
      text: message.messageText,
      time: message.createdAt
    });
  } catch (error) {
    next(error);
  }
});

export default router;
