-- Phase 5-18: Add analytics, requests, newsletter, contact, and GDPR tables

-- CreateTable: tool_usage (Phase 9)
CREATE TABLE "tool_usage" (
    "id" TEXT NOT NULL,
    "tool_slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "user_id" TEXT,
    "success" BOOLEAN NOT NULL DEFAULT true,
    "duration_ms" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tool_usage_pkey" PRIMARY KEY ("id")
);

-- CreateTable: web_vitals (Phase 9)
CREATE TABLE "web_vitals" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "rating" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "navigation_type" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "web_vitals_pkey" PRIMARY KEY ("id")
);

-- CreateTable: tool_requests (Phase 18)
CREATE TABLE "tool_requests" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "votes" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tool_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable: newsletter_subscribers (Phase 7)
CREATE TABLE "newsletter_subscribers" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "token" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "newsletter_subscribers_pkey" PRIMARY KEY ("id")
);

-- CreateTable: contact_messages (Phase 7)
CREATE TABLE "contact_messages" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'other',
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id")
);

-- AlterTable: add missing avatar column to users (if not already present)
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "avatar" TEXT;

-- CreateIndex
CREATE INDEX "tool_usage_tool_slug_idx" ON "tool_usage"("tool_slug");
CREATE INDEX "tool_usage_created_at_idx" ON "tool_usage"("created_at");
CREATE INDEX "web_vitals_name_idx" ON "web_vitals"("name");
CREATE INDEX "web_vitals_created_at_idx" ON "web_vitals"("created_at");
CREATE INDEX "tool_requests_votes_idx" ON "tool_requests"("votes");
CREATE INDEX "contact_messages_created_at_idx" ON "contact_messages"("created_at");

-- CreateUniqueIndex
CREATE UNIQUE INDEX "newsletter_subscribers_email_key" ON "newsletter_subscribers"("email");
CREATE UNIQUE INDEX "newsletter_subscribers_token_key" ON "newsletter_subscribers"("token");
