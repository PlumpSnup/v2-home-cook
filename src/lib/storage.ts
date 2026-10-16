import "server-only";
import { put } from "@vercel/blob";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const BLOB_HOST = ".public.blob.vercel-storage.com";
export const LOCAL_UPLOAD_DIR = path.join(process.cwd(), ".uploads");

export const photoStorageReady = Boolean(process.env.BLOB_READ_WRITE_TOKEN) || !process.env.VERCEL;

/**
 * Stores a dish photo and returns its public URL. Uses Vercel Blob when connected; when running
 * locally without a Blob store, files go to .uploads/ and are served by /api/uploads.
 */
export async function savePhoto(userId: string, file: Blob): Promise<string> {
  const name = `dish-photos/${userId}/${crypto.randomUUID()}.jpg`;
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(name, file, { access: "public", contentType: "image/jpeg" });
    return blob.url;
  }
  if (process.env.VERCEL) throw new Error("Connect a Vercel Blob store to upload photos");
  const target = path.join(LOCAL_UPLOAD_DIR, name);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, Buffer.from(await file.arrayBuffer()));
  return `/api/uploads/${name}`;
}

/** True when the URL is a photo this user uploaded through savePhoto. */
export function isOwnPhoto(url: string, userId: string) {
  const folder = `/dish-photos/${userId}/`;
  if (url.startsWith(`/api/uploads${folder}`)) return true;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && parsed.hostname.endsWith(BLOB_HOST) && parsed.pathname.startsWith(folder);
  } catch {
    return false;
  }
}
