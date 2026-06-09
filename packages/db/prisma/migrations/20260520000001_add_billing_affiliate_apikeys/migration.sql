-- Phase 8: Add Subscription, AffiliateClick, AffiliateConversion, Referral, ApiKey, ReferralCode tables

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELED', 'PAST_DUE', 'TRIALING', 'INCOMPLETE');

-- CreateTable: subscriptions
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "stripe_customer_id" TEXT NOT NULL,
    "stripe_subscription_id" TEXT,
    "plan" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'TRIALING',
    "current_period_start" TIMESTAMP(3),
    "current_period_end" TIMESTAMP(3),
    "cancel_at_period_end" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable: affiliate_clicks
CREATE TABLE "affiliate_clicks" (
    "id" TEXT NOT NULL,
    "referral_code" TEXT NOT NULL,
    "ip_hash" TEXT,
    "user_agent" TEXT,
    "page" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "affiliate_clicks_pkey" PRIMARY KEY ("id")
);

-- CreateTable: affiliate_conversions
CREATE TABLE "affiliate_conversions" (
    "id" TEXT NOT NULL,
    "referral_code" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "plan" TEXT,
    "amount_cents" INTEGER NOT NULL DEFAULT 0,
    "commission_cents" INTEGER NOT NULL DEFAULT 0,
    "paid_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "affiliate_conversions_pkey" PRIMARY KEY ("id")
);

-- CreateTable: referrals
CREATE TABLE "referrals" (
    "id" TEXT NOT NULL,
    "referrer_id" TEXT NOT NULL,
    "referred_user_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "reward_granted" BOOLEAN NOT NULL DEFAULT false,
    "reward_type" TEXT,
    "reward_value" INTEGER,
    "converted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "referrals_pkey" PRIMARY KEY ("id")
);

-- CreateTable: api_keys
CREATE TABLE "api_keys" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "key_hash" TEXT NOT NULL,
    "key_prefix" TEXT NOT NULL,
    "last_used" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable: referral_codes
CREATE TABLE "referral_codes" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "referral_codes_pkey" PRIMARY KEY ("id")
);

-- CreateUniqueIndex
CREATE UNIQUE INDEX "subscriptions_user_id_key" ON "subscriptions"("user_id");
CREATE UNIQUE INDEX "subscriptions_stripe_customer_id_key" ON "subscriptions"("stripe_customer_id");
CREATE UNIQUE INDEX "subscriptions_stripe_subscription_id_key" ON "subscriptions"("stripe_subscription_id");
CREATE UNIQUE INDEX "referrals_referred_user_id_key" ON "referrals"("referred_user_id");
CREATE UNIQUE INDEX "api_keys_key_hash_key" ON "api_keys"("key_hash");
CREATE UNIQUE INDEX "referral_codes_user_id_key" ON "referral_codes"("user_id");
CREATE UNIQUE INDEX "referral_codes_code_key" ON "referral_codes"("code");

-- CreateIndex
CREATE INDEX "subscriptions_user_id_idx" ON "subscriptions"("user_id");
CREATE INDEX "subscriptions_stripe_customer_id_idx" ON "subscriptions"("stripe_customer_id");
CREATE INDEX "affiliate_clicks_referral_code_idx" ON "affiliate_clicks"("referral_code");
CREATE INDEX "affiliate_clicks_created_at_idx" ON "affiliate_clicks"("created_at");
CREATE INDEX "affiliate_conversions_referral_code_idx" ON "affiliate_conversions"("referral_code");
CREATE INDEX "affiliate_conversions_user_id_idx" ON "affiliate_conversions"("user_id");
CREATE INDEX "referrals_referrer_id_idx" ON "referrals"("referrer_id");
CREATE INDEX "referrals_code_idx" ON "referrals"("code");
CREATE INDEX "api_keys_user_id_idx" ON "api_keys"("user_id");
CREATE INDEX "api_keys_key_hash_idx" ON "api_keys"("key_hash");
CREATE INDEX "referral_codes_code_idx" ON "referral_codes"("code");
