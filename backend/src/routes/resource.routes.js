import { ResourceType } from "@prisma/client";
import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { prisma } from "../lib/prisma.js";

const router = Router();

function publicResource(resource) {
  return {
    id: resource.id,
    type: resource.type.replace("_", " "),
    title: resource.title,
    source: resource.sourceName,
    author: resource.user?.fullName || "Community member",
    username: resource.user?.username || "community",
    profileImage: resource.user?.profileImage || "",
    userId: resource.userId || 0,
    category: resource.category.name,
    description: resource.description,
    url: resource.url,
    thumbnailUrl: resource.thumbnailUrl || "",
    date: resource.createdAt
  };
}

router.get("/", async (req, res, next) => {
  try {
    const resources = await prisma.resource.findMany({
      orderBy: { createdAt: "desc" },
      include: { category: true, user: true }
    });

    res.json(resources.map(publicResource));
  } catch (error) {
    next(error);
  }
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const categoryName = String(req.body.categoryName || "").trim();
    const title = String(req.body.title || "").trim();
    const description = String(req.body.description || "").trim();
    const url = String(req.body.url || "").trim();
    const type = ResourceType[req.body.type] ? req.body.type : ResourceType.ARTICLE;
    const sourceName = type === ResourceType.YOUTUBE_VIDEO ? "Community Video" : "Community Article";

    if (!categoryName || !title || !description || !url) {
      return res.status(400).json({ message: "Category, title, description, and link are required." });
    }

    const category = await prisma.category.findUnique({
      where: { name: categoryName }
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    const resource = await prisma.resource.create({
      data: {
        categoryId: category.id,
        userId: req.user.id,
        title,
        type,
        sourceName,
        description,
        url
      },
      include: { category: true, user: true }
    });

    res.status(201).json(publicResource(resource));
  } catch (error) {
    next(error);
  }
});

export default router;
