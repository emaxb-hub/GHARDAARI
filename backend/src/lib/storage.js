import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadRoot = path.resolve(__dirname, "../../uploads");

function storageDriver() {
  return String(process.env.STORAGE_DRIVER || "local").trim().toLowerCase();
}

function publicBaseUrl(req) {
  return (process.env.PUBLIC_BACKEND_URL || `${req.protocol}://${req.get("host")}`).replace(/\/+$/, "");
}

function encodedObjectPath(objectPath) {
  return objectPath.split("/").map((part) => encodeURIComponent(part)).join("/");
}

function supabaseBaseUrl() {
  return String(process.env.SUPABASE_URL || "").replace(/\/+$/, "");
}

function supabaseConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_STORAGE_BUCKET);
}

async function uploadToSupabase({ objectPath, buffer, mimeType }) {
  if (!supabaseConfigured()) {
    throw new Error("Supabase Storage is not configured. Set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and SUPABASE_STORAGE_BUCKET.");
  }

  const bucket = process.env.SUPABASE_STORAGE_BUCKET;
  const url = `${supabaseBaseUrl()}/storage/v1/object/${encodeURIComponent(bucket)}/${encodedObjectPath(objectPath)}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": mimeType,
      "x-upsert": "false"
    },
    body: buffer
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`Supabase upload failed with ${response.status}: ${errorText || response.statusText}`);
  }

  const publicUrlBase = (process.env.SUPABASE_STORAGE_PUBLIC_URL || `${supabaseBaseUrl()}/storage/v1/object/public/${bucket}`).replace(/\/+$/, "");
  return `${publicUrlBase}/${encodedObjectPath(objectPath)}`;
}

async function uploadToLocal({ kind, objectPath, buffer, req }) {
  const folder = path.join(uploadRoot, kind);
  await fs.mkdir(folder, { recursive: true });
  const fileName = path.basename(objectPath);
  await fs.writeFile(path.join(folder, fileName), buffer);
  return `${publicBaseUrl(req)}/uploads/${kind}/${fileName}`;
}

export async function saveImageUpload({ kind, userId, extension, mimeType, buffer, req }) {
  const fileName = `${Date.now()}-${userId}-${Math.random().toString(16).slice(2)}.${extension}`;
  const objectPath = `${kind}/${fileName}`;

  if (storageDriver() === "supabase") {
    return uploadToSupabase({ objectPath, buffer, mimeType });
  }

  return uploadToLocal({ kind, objectPath, buffer, req });
}
