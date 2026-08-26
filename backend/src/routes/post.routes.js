import { PostType } from "@prisma/client";
import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { prisma } from "../lib/prisma.js";

const router = Router();

router.use(requireAuth);

const postInclude = {
  user: true,
  category: true,
  likes: true,
  savedBy: true,
  comments: {
    orderBy: { createdAt: "asc" },
    include: { user: true }
  }
};

function publicPost(post, currentUserId) {
  return {
    id: String(post.id),
    author: post.isAnonymous ? "Anonymous" : post.user.fullName,
    username: post.isAnonymous ? "anonymous" : post.user.username,
    profileImage: post.isAnonymous ? "" : post.user.profileImage || "",
    userId: post.userId,
    category: post.category.name,
    categoryId: post.categoryId,
    text: post.text,
    image: post.imageUrl || "",
    type: post.type,
    date: post.createdAt,
    likes: post.likes.length,
    saved: post.savedBy.some((savedPost) => savedPost.userId === currentUserId),
    comments: post.comments.map((comment) => ({
      id: comment.id,
      author: comment.user.fullName,
      username: comment.user.username,
      profileImage: comment.user.profileImage || "",
      userId: comment.userId,
      text: comment.commentText,
      date: comment.createdAt
    }))
  };
}

async function findCategoryId(categoryName) {
  const category = await prisma.category.findUnique({
    where: { name: categoryName }
  });

  return category?.id;
}

async function blockedUserIds(userId) {
  const blocks = await prisma.blockedUser.findMany({
    where: {
      OR: [{ blockerId: userId }, { blockedId: userId }]
    }
  });

  return blocks.map((block) => block.blockerId === userId ? block.blockedId : block.blockerId);
}

async function findOwnedPost(postId, userId) {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) return null;
  if (post.userId !== userId) return false;
  return post;
}

router.get("/", async (req, res, next) => {
  try {
    const blocked = await blockedUserIds(req.user.id);
    const posts = await prisma.post.findMany({
      where: {
        userId: { notIn: blocked }
      },
      orderBy: { createdAt: "desc" },
      include: postInclude
    });

    res.json(posts.map((post) => ({
      ...publicPost({
        ...post,
        comments: post.comments.filter((comment) => !blocked.includes(comment.userId))
      }, req.user.id),
      canEdit: post.userId === req.user.id
    })));
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { categoryName, text, imageUrl, type, isAnonymous } = req.body;

    if (!categoryName || (!text && !imageUrl)) {
      return res.status(400).json({ message: "Category and post text or image are required." });
    }

    const categoryId = await findCategoryId(categoryName);
    if (!categoryId) {
      return res.status(404).json({ message: "Category not found." });
    }

    const post = await prisma.post.create({
      data: {
        userId: req.user.id,
        categoryId,
        text: text || "",
        imageUrl: imageUrl || null,
        type: PostType[type] ? type : PostType.THOUGHT,
        isAnonymous: Boolean(isAnonymous)
      },
      include: postInclude
    });

    res.status(201).json({ ...publicPost(post, req.user.id), canEdit: true });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const postId = Number(req.params.id);
    const { categoryName, text, imageUrl, type } = req.body;
    const nextText = String(text || "").trim();

    if (!Number.isInteger(postId)) {
      return res.status(400).json({ message: "Valid post is required." });
    }

    const owned = await findOwnedPost(postId, req.user.id);
    if (owned === null) return res.status(404).json({ message: "Post not found." });
    if (owned === false) return res.status(403).json({ message: "You can only edit your own posts." });

    const data = {
      text: nextText,
      imageUrl: imageUrl || null,
      type: PostType[type] ? type : owned.type
    };

    if (!data.text && !data.imageUrl) {
      return res.status(400).json({ message: "Post text or image is required." });
    }

    if (categoryName) {
      const categoryId = await findCategoryId(categoryName);
      if (!categoryId) return res.status(404).json({ message: "Category not found." });
      data.categoryId = categoryId;
    }

    const post = await prisma.post.update({
      where: { id: postId },
      data,
      include: postInclude
    });

    res.json({ ...publicPost(post, req.user.id), canEdit: true });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const postId = Number(req.params.id);

    if (!Number.isInteger(postId)) {
      return res.status(400).json({ message: "Valid post is required." });
    }

    const owned = await findOwnedPost(postId, req.user.id);
    if (owned === null) return res.status(404).json({ message: "Post not found." });
    if (owned === false) return res.status(403).json({ message: "You can only delete your own posts." });

    await prisma.post.delete({ where: { id: postId } });
    res.json({ message: "Post deleted." });
  } catch (error) {
    next(error);
  }
});

router.post("/:id/like", async (req, res, next) => {
  try {
    const postId = Number(req.params.id);

    if (!Number.isInteger(postId)) {
      return res.status(400).json({ message: "Valid post is required." });
    }

    const existing = await prisma.postLike.findUnique({
      where: { postId_userId: { postId, userId: req.user.id } }
    });

    if (existing) {
      await prisma.postLike.delete({ where: { id: existing.id } });
    } else {
      await prisma.postLike.create({ data: { postId, userId: req.user.id } });
    }

    res.json({ message: existing ? "Like removed." : "Post liked." });
  } catch (error) {
    next(error);
  }
});

router.post("/:id/save", async (req, res, next) => {
  try {
    const postId = Number(req.params.id);

    if (!Number.isInteger(postId)) {
      return res.status(400).json({ message: "Valid post is required." });
    }

    const existing = await prisma.savedPost.findUnique({
      where: { postId_userId: { postId, userId: req.user.id } }
    });

    if (existing) {
      await prisma.savedPost.delete({ where: { id: existing.id } });
    } else {
      await prisma.savedPost.create({ data: { postId, userId: req.user.id } });
    }

    res.json({ message: existing ? "Post unsaved." : "Post saved." });
  } catch (error) {
    next(error);
  }
});

router.post("/:id/comments", async (req, res, next) => {
  try {
    const postId = Number(req.params.id);
    const commentText = String(req.body.commentText || "").trim();

    if (!Number.isInteger(postId) || !commentText) {
      return res.status(400).json({ message: "Valid post and comment are required." });
    }

    const comment = await prisma.comment.create({
      data: { postId, userId: req.user.id, commentText },
      include: { user: true }
    });

    res.status(201).json({
      id: comment.id,
      author: comment.user.fullName,
      username: comment.user.username,
      profileImage: comment.user.profileImage || "",
      userId: comment.userId,
      text: comment.commentText,
      date: comment.createdAt
    });
  } catch (error) {
    next(error);
  }
});

router.put("/:postId/comments/:commentId", async (req, res, next) => {
  try {
    const commentId = Number(req.params.commentId);
    const commentText = String(req.body.commentText || "").trim();

    if (!Number.isInteger(commentId) || !commentText) {
      return res.status(400).json({ message: "Valid comment text is required." });
    }

    const existing = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!existing) return res.status(404).json({ message: "Comment not found." });
    if (existing.userId !== req.user.id) return res.status(403).json({ message: "You can only edit your own comments." });

    const comment = await prisma.comment.update({
      where: { id: commentId },
      data: { commentText },
      include: { user: true }
    });

    res.json({
      id: comment.id,
      author: comment.user.fullName,
      username: comment.user.username,
      profileImage: comment.user.profileImage || "",
      userId: comment.userId,
      text: comment.commentText,
      date: comment.createdAt
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:postId/comments/:commentId", async (req, res, next) => {
  try {
    const commentId = Number(req.params.commentId);

    if (!Number.isInteger(commentId)) {
      return res.status(400).json({ message: "Valid comment is required." });
    }

    const existing = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!existing) return res.status(404).json({ message: "Comment not found." });
    if (existing.userId !== req.user.id) return res.status(403).json({ message: "You can only delete your own comments." });

    await prisma.comment.delete({ where: { id: commentId } });
    res.json({ message: "Comment deleted." });
  } catch (error) {
    next(error);
  }
});

export default router;
