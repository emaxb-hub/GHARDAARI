import { Router } from "express";
import { saveImageUpload } from "../lib/storage.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
const allowedKinds = new Set(["posts", "profiles"]);
const mimeExtensions = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif"
};
const maxImageBytes = 8 * 1024 * 1024;

function bytesMatchMime(buffer, mimeType) {
  if (mimeType === "image/jpeg") {
    return buffer.length > 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }

  if (mimeType === "image/png") {
    return buffer.length > 8
      && buffer[0] === 0x89
      && buffer[1] === 0x50
      && buffer[2] === 0x4e
      && buffer[3] === 0x47
      && buffer[4] === 0x0d
      && buffer[5] === 0x0a
      && buffer[6] === 0x1a
      && buffer[7] === 0x0a;
  }

  if (mimeType === "image/webp") {
    return buffer.length > 12
      && buffer.subarray(0, 4).toString("ascii") === "RIFF"
      && buffer.subarray(8, 12).toString("ascii") === "WEBP";
  }

  if (mimeType === "image/gif") {
    const header = buffer.subarray(0, 6).toString("ascii");
    return header === "GIF87a" || header === "GIF89a";
  }

  return false;
}

router.use(requireAuth);

router.post("/image", async (req, res, next) => {
  try {
    const kind = allowedKinds.has(req.body.kind) ? req.body.kind : "posts";
    const dataUrl = String(req.body.dataUrl || "");
    const match = dataUrl.match(/^data:(image\/(?:jpeg|png|webp|gif));base64,([A-Za-z0-9+/=]+)$/);

    if (!match) {
      return res.status(400).json({ message: "Please upload a valid image file." });
    }

    const mimeType = match[1];
    const extension = mimeExtensions[mimeType];
    const buffer = Buffer.from(match[2], "base64");
    if (!buffer.length || buffer.length > maxImageBytes) {
      return res.status(400).json({ message: "Image must be smaller than 8MB." });
    }

    if (!bytesMatchMime(buffer, mimeType)) {
      return res.status(400).json({ message: "Image type does not match the uploaded file." });
    }

    const url = await saveImageUpload({
      kind,
      userId: req.user.id,
      extension,
      mimeType,
      buffer,
      req
    });

    res.status(201).json({
      url
    });
  } catch (error) {
    next(error);
  }
});

export default router;
