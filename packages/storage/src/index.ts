import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Readable } from "stream";

// ─── Storage Client ───────────────────────────────────────────────────────────
// Compatible with Cloudflare R2, AWS S3, and Supabase Storage
// RECOMMENDED: Cloudflare R2 — cheapest, no egress fees
// Set these env vars:
//   STORAGE_ENDPOINT=https://<accountid>.r2.cloudflarestorage.com
//   STORAGE_ACCESS_KEY_ID=...
//   STORAGE_SECRET_ACCESS_KEY=...
//   STORAGE_BUCKET_NAME=toolverse-files
//   STORAGE_REGION=auto
// ─────────────────────────────────────────────────────────────────────────────

const s3Client = new S3Client({
  region: process.env.STORAGE_REGION || "auto",
  endpoint: process.env.STORAGE_ENDPOINT,
  credentials: {
    accessKeyId: process.env.STORAGE_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = process.env.STORAGE_BUCKET_NAME || "toolverse-files";
const ONE_HOUR_MS = 60 * 60 * 1000;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UploadResult {
  url: string;
  path: string;
  size: number;
  contentType: string;
}

export interface StorageFile {
  path: string;
  size: number;
  lastModified: Date;
}

// ─── Upload ───────────────────────────────────────────────────────────────────

/**
 * Upload a file buffer to storage → returns signed URL
 * Temporary storage: files auto-deleted after 1 hour (via lifecycle rules)
 */
export async function upload(
  file: Buffer | Readable,
  path: string,
  contentType: string = "application/octet-stream"
): Promise<UploadResult> {
  const body = Buffer.isBuffer(file) ? file : await streamToBuffer(file);

  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: path,
      Body: body,
      ContentType: contentType,
      Metadata: {
        uploadedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + ONE_HOUR_MS).toISOString(),
      },
    })
  );

  const url = await generateSignedUrl(path, 3600);

  return { url, path, size: body.length, contentType };
}

// ─── Download ─────────────────────────────────────────────────────────────────

/** Download a file as a readable stream */
export async function download(path: string): Promise<Readable> {
  const response = await s3Client.send(
    new GetObjectCommand({ Bucket: BUCKET_NAME, Key: path })
  );
  if (!response.Body) throw new Error(`File not found at path: ${path}`);
  return response.Body as Readable;
}

/** Download a file as a buffer */
export async function downloadBuffer(path: string): Promise<Buffer> {
  const stream = await download(path);
  return streamToBuffer(stream);
}

// ─── Delete ───────────────────────────────────────────────────────────────────

/** Delete a file from storage */
export async function deleteFile(path: string): Promise<void> {
  await s3Client.send(
    new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: path })
  );
}

// ─── Signed URL ───────────────────────────────────────────────────────────────

/**
 * Generate a pre-signed URL for temporary access
 * @param expiresIn - seconds until expiry (default: 3600 = 1 hour)
 */
export async function generateSignedUrl(
  path: string,
  expiresIn: number = 3600
): Promise<string> {
  const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: path });
  return getSignedUrl(s3Client, command, { expiresIn });
}

// ─── List ─────────────────────────────────────────────────────────────────────

/** List files under a path prefix */
export async function listFiles(prefix: string): Promise<StorageFile[]> {
  const response = await s3Client.send(
    new ListObjectsV2Command({ Bucket: BUCKET_NAME, Prefix: prefix })
  );
  return (response.Contents || []).map((item) => ({
    path: item.Key || "",
    size: item.Size || 0,
    lastModified: item.LastModified || new Date(),
  }));
}

// ─── Path Generators ─────────────────────────────────────────────────────────

/** Unique upload path for user files */
export function generateFilePath(userId: string, originalName: string): string {
  const ts = Date.now();
  const rand = Math.random().toString(36).substring(2, 8);
  const ext = originalName.split(".").pop()?.toLowerCase() || "bin";
  return `uploads/${userId}/${ts}-${rand}.${ext}`;
}

/** Output path for processed/generated files */
export function generateOutputPath(
  userId: string,
  toolName: string,
  ext: string
): string {
  const ts = Date.now();
  return `outputs/${userId}/${toolName}-${ts}.${ext}`;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}