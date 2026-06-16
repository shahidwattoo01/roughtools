-- CreateEnum
CREATE TYPE "ToolStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
-- CreateEnum
CREATE TYPE "BlogStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
-- CreateEnum
CREATE TYPE "IqDomain" AS ENUM ('FLUID_REASONING', 'CRYSTALLIZED_INTELLIGENCE', 'PROCESSING_SPEED', 'WORKING_MEMORY', 'SPATIAL_REASONING', 'QUANTITATIVE_REASONING');
-- CreateEnum
CREATE TYPE "IqFormat" AS ENUM ('MATRIX', 'SEQUENCE', 'ANALOGY', 'MEMORY', 'SPATIAL', 'DEDUCTION');
-- CreateEnum
CREATE TYPE "IqSessionStatus" AS ENUM ('INSTRUCTIONS', 'ACTIVE', 'PAUSED', 'COMPLETED', 'VOIDED', 'EXPIRED');
-- CreateEnum
CREATE TYPE "IqAgeGroup" AS ENUM ('AGE_18_24', 'AGE_25_34', 'AGE_35_44', 'AGE_45_54', 'AGE_55_64', 'AGE_65_PLUS');
-- DropIndex
DROP INDEX "blog_posts_is_published_idx";
-- DropIndex
DROP INDEX "tools_category_idx";
-- AlterTable
ALTER TABLE "api_usage_logs" DROP COLUMN "ip_address";
-- AlterTable
ALTER TABLE "blog_posts" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "status" "BlogStatus" NOT NULL DEFAULT 'DRAFT';
-- AlterTable
ALTER TABLE "tools" DROP COLUMN "category",
ADD COLUMN     "author_id" TEXT,
ADD COLUMN     "category_id" TEXT NOT NULL,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "features" JSONB,
ADD COLUMN     "like_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "status" "ToolStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "view_count" INTEGER NOT NULL DEFAULT 0;
-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "tool_tags" (
    "tool_id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,
    CONSTRAINT "tool_tags_pkey" PRIMARY KEY ("tool_id","tag_id")
);
-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL,
    "tool_id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "iq_question_bank" (
    "id" TEXT NOT NULL,
    "domain" "IqDomain" NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "format" "IqFormat" NOT NULL,
    "content" JSONB NOT NULL,
    "time_limit_seconds" INTEGER NOT NULL,
    "discrimination_index" DOUBLE PRECISION NOT NULL DEFAULT 0.7,
    "difficulty_calibrated" BOOLEAN NOT NULL DEFAULT false,
    "pilot" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "iq_question_bank_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "iq_sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "session_token" TEXT NOT NULL,
    "status" "IqSessionStatus" NOT NULL DEFAULT 'ACTIVE',
    "age_group" "IqAgeGroup" NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3) NOT NULL,
    "total_questions" INTEGER NOT NULL DEFAULT 0,
    "current_index" INTEGER NOT NULL DEFAULT 0,
    "questions_order" JSONB NOT NULL DEFAULT '[]',
    "theta_estimates" JSONB NOT NULL DEFAULT '{}',
    "std_errors" JSONB NOT NULL DEFAULT '{}',
    "focus_loss_count" INTEGER NOT NULL DEFAULT 0,
    "pause_count" INTEGER NOT NULL DEFAULT 0,
    "ip_address_hash" TEXT,
    "user_agent" TEXT,
    "invalidity_flags" JSONB NOT NULL DEFAULT '[]',
    "raw_score" DOUBLE PRECISION,
    "iq_score" INTEGER,
    "confidence_lower" INTEGER,
    "confidence_upper" INTEGER,
    "percentile" DOUBLE PRECISION,
    "domain_scores" JSONB,
    "is_valid" BOOLEAN NOT NULL DEFAULT true,
    "norming_version" TEXT,
    "report_ready" BOOLEAN NOT NULL DEFAULT false,
    "report_url" TEXT,
    CONSTRAINT "iq_sessions_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "iq_responses" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "domain" "IqDomain" NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "presented_at" TIMESTAMP(3) NOT NULL,
    "answered_at" TIMESTAMP(3) NOT NULL,
    "time_taken_ms" INTEGER NOT NULL,
    "selected_option" INTEGER,
    "is_correct" BOOLEAN NOT NULL,
    "is_timeout" BOOLEAN NOT NULL DEFAULT false,
    "is_pilot" BOOLEAN NOT NULL DEFAULT false,
    "weighted_score" DOUBLE PRECISION NOT NULL,
    "time_penalty" DOUBLE PRECISION NOT NULL,
    "final_score" DOUBLE PRECISION NOT NULL,
    CONSTRAINT "iq_responses_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "iq_norming_snapshots" (
    "id" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "age_group" "IqAgeGroup" NOT NULL,
    "sample_size" INTEGER NOT NULL,
    "mean_raw" DOUBLE PRECISION NOT NULL,
    "std_dev_raw" DOUBLE PRECISION NOT NULL,
    "percentile_table" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "iq_norming_snapshots_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "iq_question_analytics" (
    "question_id" TEXT NOT NULL,
    "total_presentations" INTEGER NOT NULL DEFAULT 0,
    "total_correct" INTEGER NOT NULL DEFAULT 0,
    "mean_time_ms" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "std_dev_time_ms" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "difficulty_empirical" DOUBLE PRECISION,
    "discrimination_empirical" DOUBLE PRECISION,
    "exposure_this_month" INTEGER NOT NULL DEFAULT 0,
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "iq_question_analytics_pkey" PRIMARY KEY ("question_id")
);
-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");
-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");
-- CreateIndex
CREATE UNIQUE INDEX "tags_slug_key" ON "tags"("slug");
-- CreateIndex
CREATE INDEX "comments_tool_id_idx" ON "comments"("tool_id");
-- CreateIndex
CREATE INDEX "iq_question_bank_domain_difficulty_is_active_pilot_idx" ON "iq_question_bank"("domain", "difficulty", "is_active", "pilot");
-- CreateIndex
CREATE UNIQUE INDEX "iq_sessions_session_token_key" ON "iq_sessions"("session_token");
-- CreateIndex
CREATE INDEX "iq_sessions_user_id_status_idx" ON "iq_sessions"("user_id", "status");
-- CreateIndex
CREATE INDEX "iq_sessions_status_expires_at_idx" ON "iq_sessions"("status", "expires_at");
-- CreateIndex
CREATE INDEX "iq_responses_session_id_idx" ON "iq_responses"("session_id");
-- CreateIndex
CREATE INDEX "iq_responses_question_id_idx" ON "iq_responses"("question_id");
-- CreateIndex
CREATE INDEX "iq_norming_snapshots_age_group_is_active_idx" ON "iq_norming_snapshots"("age_group", "is_active");
-- CreateIndex
CREATE INDEX "blog_posts_status_idx" ON "blog_posts"("status");
-- CreateIndex
CREATE INDEX "tools_category_id_idx" ON "tools"("category_id");
-- CreateIndex
CREATE INDEX "tools_status_idx" ON "tools"("status");
-- AddForeignKey
ALTER TABLE "tools" ADD CONSTRAINT "tools_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "tools" ADD CONSTRAINT "tools_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "tool_tags" ADD CONSTRAINT "tool_tags_tool_id_fkey" FOREIGN KEY ("tool_id") REFERENCES "tools"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "tool_tags" ADD CONSTRAINT "tool_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_tool_id_fkey" FOREIGN KEY ("tool_id") REFERENCES "tools"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "iq_responses" ADD CONSTRAINT "iq_responses_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "iq_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "iq_responses" ADD CONSTRAINT "iq_responses_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "iq_question_bank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "iq_question_analytics" ADD CONSTRAINT "iq_question_analytics_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "iq_question_bank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
