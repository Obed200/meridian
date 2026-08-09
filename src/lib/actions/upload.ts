import "server-only";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "posts");
const MAX_WIDTH = 1920;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function saveHeroImage(
  file: File
): Promise<{ url: string } | { error: string }> {
  if (!ALLOWED_TYPES.has(file.type)) {
    return { error: "Image must be a JPEG, PNG, WebP, or GIF file." };
  }
  if (file.size > 10 * 1024 * 1024) {
    return { error: "Image must be smaller than 10MB." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.mkdir(UPLOAD_DIR, { recursive: true });

  const filename = `${randomUUID()}.webp`;
  const filePath = path.join(UPLOAD_DIR, filename);

  await sharp(buffer)
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(filePath);

  return { url: `/uploads/posts/${filename}` };
}
