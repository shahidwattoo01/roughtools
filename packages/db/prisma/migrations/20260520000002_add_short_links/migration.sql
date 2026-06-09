-- CreateTable
CREATE TABLE "short_links" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "original_url" TEXT NOT NULL,
    "user_id" TEXT,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "short_links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "short_links_slug_key" ON "short_links"("slug");
CREATE INDEX "short_links_slug_idx" ON "short_links"("slug");
CREATE INDEX "short_links_user_id_idx" ON "short_links"("user_id");
