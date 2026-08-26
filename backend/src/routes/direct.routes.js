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

  return new Set(blocks.map((block) => block.blockerId === userId ? block.blockedId : block.blockerId));
}

function publicConversation(conversation, currentUserId) {
  const other = conversation.members.map((member) => member.user).find((user) => user.id !== currentUserId);
  return {
    id: `dm-${conversation.id}`,
    dbId: conversation.id,
    userId: other ? other.id : 0,
    name: other ? other.fullName : "Direct Message",
    about: other ? `@${other.username}` : "",
    messages: conversation.messages.map((message) => ({
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
    const conversations = await prisma.directConversation.findMany({
      where: {
        members: { some: { userId: req.user.id } }
      },
      orderBy: { createdAt: "desc" },
      include: {
        members: { include: { user: true } },
        messages: {
          orderBy: { createdAt: "asc" },
          include: { sender: true }
        }
      }
    });

    res.json(conversations
      .filter((conversation) => conversation.members.every((member) => member.userId === req.user.id || !blocked.has(member.userId)))
      .map((conversation) => publicConversation(conversation, req.user.id)));
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const otherUserId = Number(req.body.userId);

    if (!Number.isInteger(otherUserId) || otherUserId <= 0 || otherUserId === req.user.id) {
      return res.status(400).json({ message: "Choose a valid user to message." });
    }

    const blocked = await prisma.blockedUser.findFirst({
      where: {
        OR: [
          { blockerId: req.user.id, blockedId: otherUserId },
          { blockerId: otherUserId, blockedId: req.user.id }
        ]
      }
    });

    if (blocked) {
      return res.status(403).json({ message: "Direct messages are unavailable for this user." });
    }

    const existing = await prisma.directConversation.findFirst({
      where: {
        AND: [
          { members: { some: { userId: req.user.id } } },
          { members: { some: { userId: otherUserId } } }
        ]
      },
      include: {
        members: { include: { user: true } },
        messages: {
          orderBy: { createdAt: "asc" },
          include: { sender: true }
        }
      }
    });

    if (existing) {
      return res.json(publicConversation(existing, req.user.id));
    }

    const conversation = await prisma.directConversation.create({
      data: {
        members: {
          create: [
            { userId: req.user.id },
            { userId: otherUserId }
          ]
        }
      },
      include: {
        members: { include: { user: true } },
        messages: {
          orderBy: { createdAt: "asc" },
          include: { sender: true }
        }
      }
    });

    res.status(201).json(publicConversation(conversation, req.user.id));
  } catch (error) {
    next(error);
  }
});

router.post("/:id/messages", async (req, res, next) => {
  try {
    const conversationId = Number(req.params.id);
    const messageText = String(req.body.messageText || "").trim();

    if (!Number.isInteger(conversationId) || !messageText) {
      return res.status(400).json({ message: "Valid conversation and message are required." });
    }

    const conversation = await prisma.directConversation.findFirst({
      where: {
        id: conversationId,
        members: { some: { userId: req.user.id } }
      },
      include: { members: true }
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found." });
    }

    const other = conversation.members.find((member) => member.userId !== req.user.id);
    const blocked = other ? await prisma.blockedUser.findFirst({
      where: {
        OR: [
          { blockerId: req.user.id, blockedId: other.userId },
          { blockerId: other.userId, blockedId: req.user.id }
        ]
      }
    }) : null;

    if (blocked) {
      return res.status(403).json({ message: "Direct messages are unavailable for this user." });
    }

    const message = await prisma.directMessage.create({
      data: { conversationId, senderId: req.user.id, messageText },
      include: { sender: true }
    });

    res.status(201).json({
      id: message.id,
      sender: "You",
      senderId: message.senderId,
      text: message.messageText,
      time: message.createdAt
    });
  } catch (error) {
    next(error);
  }
});

export default router;
