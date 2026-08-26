import { ReportStatus, ReportTargetType } from "@prisma/client";
import { Router } from "express";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import { prisma } from "../lib/prisma.js";

const router = Router();

router.use(requireAuth);

router.post("/reports", async (req, res, next) => {
  try {
    const targetType = String(req.body.targetType || "").toUpperCase();
    const targetId = Number(req.body.targetId);
    const reason = String(req.body.reason || "").trim();

    if (!ReportTargetType[targetType] || !Number.isInteger(targetId) || targetId <= 0 || !reason) {
      return res.status(400).json({ message: "Target and reason are required." });
    }

    const report = await prisma.report.create({
      data: {
        reporterId: req.user.id,
        targetType,
        targetId,
        reason
      }
    });

    res.status(201).json({ id: report.id, message: "Report submitted." });
  } catch (error) {
    next(error);
  }
});

function publicReport(report, target) {
  return {
    id: report.id,
    targetType: report.targetType,
    targetId: report.targetId,
    reason: report.reason,
    status: report.status,
    moderatorNote: report.moderatorNote || "",
    reviewedAt: report.reviewedAt,
    createdAt: report.createdAt,
    reporter: {
      id: report.reporter.id,
      fullName: report.reporter.fullName,
      username: report.reporter.username,
      email: report.reporter.email
    },
    moderator: report.moderator ? {
      id: report.moderator.id,
      fullName: report.moderator.fullName,
      username: report.moderator.username
    } : null,
    target
  };
}

async function targetPreview(report) {
  if (report.targetType === "POST") {
    const post = await prisma.post.findUnique({
      where: { id: report.targetId },
      include: { user: true, category: true }
    });
    return post ? {
      exists: true,
      userId: post.userId,
      title: `Post in ${post.category.name}`,
      text: post.text || post.imageUrl || "Image post",
      author: post.isAnonymous ? "Anonymous" : post.user.fullName
    } : { exists: false };
  }

  if (report.targetType === "COMMENT") {
    const comment = await prisma.comment.findUnique({
      where: { id: report.targetId },
      include: { user: true }
    });
    return comment ? {
      exists: true,
      userId: comment.userId,
      title: "Comment",
      text: comment.commentText,
      author: comment.user.fullName
    } : { exists: false };
  }

  if (report.targetType === "USER") {
    const user = await prisma.user.findUnique({ where: { id: report.targetId } });
    return user ? {
      exists: true,
      userId: user.id,
      title: "User profile",
      text: user.bio || "",
      author: user.fullName
    } : { exists: false };
  }

  if (report.targetType === "GROUP_MESSAGE") {
    const message = await prisma.groupMessage.findUnique({
      where: { id: report.targetId },
      include: { sender: true, group: true }
    });
    return message ? {
      exists: true,
      userId: message.senderId,
      title: `Group message in ${message.group.name}`,
      text: message.messageText,
      author: message.sender.fullName
    } : { exists: false };
  }

  const message = await prisma.directMessage.findUnique({
    where: { id: report.targetId },
    include: { sender: true }
  });
  return message ? {
    exists: true,
    userId: message.senderId,
    title: "Direct message",
    text: message.messageText,
    author: message.sender.fullName
  } : { exists: false };
}

async function updateReport(reportId, moderatorId, data) {
  return prisma.report.update({
    where: { id: reportId },
    data: {
      ...data,
      moderatorId,
      reviewedAt: new Date()
    },
    include: {
      reporter: true,
      moderator: true
    }
  });
}

async function deleteTarget(report) {
  if (report.targetType === "POST") {
    await prisma.post.deleteMany({ where: { id: report.targetId } });
    return;
  }

  if (report.targetType === "COMMENT") {
    await prisma.comment.deleteMany({ where: { id: report.targetId } });
    return;
  }

  if (report.targetType === "GROUP_MESSAGE") {
    await prisma.groupMessage.deleteMany({ where: { id: report.targetId } });
    return;
  }

  if (report.targetType === "DIRECT_MESSAGE") {
    await prisma.directMessage.deleteMany({ where: { id: report.targetId } });
  }
}

router.get("/reports", requireAdmin, async (req, res, next) => {
  try {
    const status = String(req.query.status || "").toUpperCase();
    const where = ReportStatus[status] ? { status } : {};
    const reports = await prisma.report.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        reporter: true,
        moderator: true
      }
    });
    const data = await Promise.all(reports.map(async (report) => publicReport(report, await targetPreview(report))));

    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.patch("/reports/:id", requireAdmin, async (req, res, next) => {
  try {
    const reportId = Number(req.params.id);
    const status = String(req.body.status || "").toUpperCase();
    const moderatorNote = String(req.body.moderatorNote || "").trim();

    if (!Number.isInteger(reportId) || !ReportStatus[status]) {
      return res.status(400).json({ message: "Valid report and status are required." });
    }

    const report = await updateReport(reportId, req.user.id, { status, moderatorNote });
    res.json(publicReport(report, await targetPreview(report)));
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Report not found." });
    }

    next(error);
  }
});

router.post("/reports/:id/dismiss", requireAdmin, async (req, res, next) => {
  try {
    const reportId = Number(req.params.id);
    const moderatorNote = String(req.body.moderatorNote || "Dismissed by moderator.").trim();

    if (!Number.isInteger(reportId)) {
      return res.status(400).json({ message: "Valid report is required." });
    }

    const report = await updateReport(reportId, req.user.id, {
      status: "DISMISSED",
      moderatorNote
    });
    res.json(publicReport(report, await targetPreview(report)));
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Report not found." });
    }

    next(error);
  }
});

router.post("/reports/:id/warn", requireAdmin, async (req, res, next) => {
  try {
    const reportId = Number(req.params.id);
    const message = String(req.body.message || "").trim();
    const moderatorNote = String(req.body.moderatorNote || "Warning sent to user.").trim();

    if (!Number.isInteger(reportId) || !message) {
      return res.status(400).json({ message: "Valid report and warning message are required." });
    }

    const report = await prisma.report.findUnique({
      where: { id: reportId },
      include: { reporter: true, moderator: true }
    });
    if (!report) return res.status(404).json({ message: "Report not found." });

    const target = await targetPreview(report);
    if (!target.exists || !target.userId) {
      return res.status(404).json({ message: "Reported target no longer exists." });
    }

    const warning = await prisma.userWarning.create({
      data: {
        userId: target.userId,
        moderatorId: req.user.id,
        message
      }
    });
    const updated = await updateReport(reportId, req.user.id, {
      status: "ACTION_TAKEN",
      moderatorNote
    });

    res.status(201).json({
      report: publicReport(updated, await targetPreview(updated)),
      warning
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/reports/:id/target", requireAdmin, async (req, res, next) => {
  try {
    const reportId = Number(req.params.id);
    const moderatorNote = String(req.body.moderatorNote || "Reported content removed.").trim();

    if (!Number.isInteger(reportId)) {
      return res.status(400).json({ message: "Valid report is required." });
    }

    const report = await prisma.report.findUnique({
      where: { id: reportId },
      include: { reporter: true, moderator: true }
    });
    if (!report) return res.status(404).json({ message: "Report not found." });
    if (report.targetType === "USER") {
      return res.status(400).json({ message: "User accounts cannot be deleted from this moderation action." });
    }

    await deleteTarget(report);
    const updated = await updateReport(reportId, req.user.id, {
      status: "ACTION_TAKEN",
      moderatorNote
    });

    res.json(publicReport(updated, { exists: false }));
  } catch (error) {
    next(error);
  }
});

router.post("/blocks", async (req, res, next) => {
  try {
    const blockedId = Number(req.body.userId);

    if (!Number.isInteger(blockedId) || blockedId <= 0 || blockedId === req.user.id) {
      return res.status(400).json({ message: "Choose a valid user to block." });
    }

    await prisma.blockedUser.upsert({
      where: {
        blockerId_blockedId: {
          blockerId: req.user.id,
          blockedId
        }
      },
      update: {},
      create: {
        blockerId: req.user.id,
        blockedId
      }
    });

    res.status(201).json({ message: "User blocked." });
  } catch (error) {
    next(error);
  }
});

router.delete("/blocks/:userId", async (req, res, next) => {
  try {
    const blockedId = Number(req.params.userId);

    if (!Number.isInteger(blockedId)) {
      return res.status(400).json({ message: "Valid user is required." });
    }

    await prisma.blockedUser.deleteMany({
      where: {
        blockerId: req.user.id,
        blockedId
      }
    });

    res.json({ message: "User unblocked." });
  } catch (error) {
    next(error);
  }
});

export default router;
