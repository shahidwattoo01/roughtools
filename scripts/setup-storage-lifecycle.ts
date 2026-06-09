#!/usr/bin/env ts-node
/**
 * setup-storage-lifecycle.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Run once to configure your S3/R2 bucket lifecycle rules.
 * This sets up automatic deletion of files older than 1 hour.
 *
 * Usage:
 *   pnpm ts-node scripts/setup-storage-lifecycle.ts
 *
 * Requires: STORAGE_* env vars set in your .env
 * ─────────────────────────────────────────────────────────────────────────────
 */

import {
  S3Client,
  PutBucketLifecycleConfigurationCommand,
  CreateBucketCommand,
  HeadBucketCommand,
  PutBucketCorsCommand,
} from "@aws-sdk/client-s3";
import * as dotenv from "dotenv";

dotenv.config();

const s3 = new S3Client({
  region: process.env.STORAGE_REGION || "auto",
  endpoint: process.env.STORAGE_ENDPOINT,
  credentials: {
    accessKeyId: process.env.STORAGE_ACCESS_KEY_ID!,
    secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.STORAGE_BUCKET_NAME || "roughtools-files";

async function setup(): Promise<void> {
  console.log(`\n🔧 Setting up storage bucket: ${BUCKET}\n`);

  // 1. Create bucket if it doesn't exist
  try {
    await s3.send(new HeadBucketCommand({ Bucket: BUCKET }));
    console.log(`✅ Bucket "${BUCKET}" already exists`);
  } catch {
    try {
      await s3.send(new CreateBucketCommand({ Bucket: BUCKET }));
      console.log(`✅ Created bucket "${BUCKET}"`);
    } catch (err: any) {
      console.error(`❌ Failed to create bucket: ${err.message}`);
      process.exit(1);
    }
  }

  // 2. Set lifecycle rules — auto-delete after 1 hour
  try {
    await s3.send(
      new PutBucketLifecycleConfigurationCommand({
        Bucket: BUCKET,
        LifecycleConfiguration: {
          Rules: [
            {
              ID: "delete-temp-uploads-1h",
              Status: "Enabled",
              Filter: { Prefix: "uploads/" },
              Expiration: {
                // Minimum S3/R2 is 1 day — use our app-level cleanup job for <1 day
                Days: 1,
              },
            },
            {
              ID: "delete-temp-outputs-1h",
              Status: "Enabled",
              Filter: { Prefix: "outputs/" },
              Expiration: {
                Days: 1,
              },
            },
          ],
        },
      })
    );
    console.log(`✅ Lifecycle rules set (auto-delete uploads/ and outputs/ after 1 day)`);
    console.log(`   Note: Sub-hour cleanup handled by the cleanupFiles.ts cron job`);
  } catch (err: any) {
    // Cloudflare R2 free tier may not support lifecycle rules
    console.warn(`⚠️  Lifecycle rules not supported or failed: ${err.message}`);
    console.warn(`   → The cleanupFiles.ts cron job will handle deletion instead.`);
  }

  // 3. Set CORS rules — allow browser uploads from your domain
  const webUrl = process.env.WEB_URL || "http://localhost:3000";
  try {
    await s3.send(
      new PutBucketCorsCommand({
        Bucket: BUCKET,
        CORSConfiguration: {
          CORSRules: [
            {
              AllowedOrigins: [webUrl, "https://roughtools.com"],
              AllowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
              AllowedHeaders: ["*"],
              ExposeHeaders: ["ETag", "Content-Length"],
              MaxAgeSeconds: 3600,
            },
          ],
        },
      })
    );
    console.log(`✅ CORS configured for ${webUrl}`);
  } catch (err: any) {
    console.warn(`⚠️  CORS setup skipped: ${err.message}`);
  }

  console.log(`\n🎉 Storage setup complete!\n`);
  console.log(`Next steps:`);
  console.log(`  1. Start Gotenberg: docker-compose up -d gotenberg`);
  console.log(`  2. Copy .env.example to .env and fill in your values`);
  console.log(`  3. Run the API: pnpm dev\n`);
}

setup().catch((err) => {
  console.error("Setup failed:", err);
  process.exit(1);
});