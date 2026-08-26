import cors from "cors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import healthRoutes from "./routes/health.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import directRoutes from "./routes/direct.routes.js";
import groupRoutes from "./routes/group.routes.js";
import moderationRoutes from "./routes/moderation.routes.js";
import postRoutes from "./routes/post.routes.js";
import resourceRoutes from "./routes/resource.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import userRoutes from "./routes/user.routes.js";
import { errorLogger, requestLogger } from "./middleware/logging.js";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadRoot = path.resolve(__dirname, "../uploads");
const defaultAllowedOrigins = [
  "http://127.0.0.1:5500",
  "http://localhost:5500",
  "http://127.0.0.1:5173",
  "http://localhost:5173"
];
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.set("trust proxy", 1);
app.use(requestLogger);

app.use((req, res, next) => {
  res.set("X-Content-Type-Options", "nosniff");
  res.set("X-Frame-Options", "DENY");
  res.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  if (process.env.NODE_ENV === "production") {
    res.set("Strict-Transport-Security", "max-age=15552000; includeSubDomains");
  }
  next();
});

app.use((req, res, next) => {
  if (process.env.NODE_ENV === "production" && req.get("x-forwarded-proto") && req.get("x-forwarded-proto") !== "https") {
    return res.redirect(308, `https://${req.get("host")}${req.originalUrl}`);
  }
  next();
});

app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    const list = allowedOrigins.length ? allowedOrigins : (process.env.NODE_ENV === "production" ? [] : defaultAllowedOrigins);
    if (list.includes(origin)) return callback(null, true);
    return callback(new Error(process.env.NODE_ENV === "production" && !allowedOrigins.length ? "ALLOWED_ORIGINS must be set in production." : "Origin is not allowed by CORS."));
  },
  credentials: true
}));
app.use(express.json({ limit: "12mb" }));
app.use("/uploads", express.static(uploadRoot));

app.use("/api/health", healthRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/direct-conversations", directRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/moderation", moderationRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/users", userRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorLogger);

app.use((error, req, res, next) => {
  res.status(500).json({
    message: "Something went wrong on the server",
    detail: process.env.NODE_ENV === "production" ? undefined : error.message
  });
});

export default app;
