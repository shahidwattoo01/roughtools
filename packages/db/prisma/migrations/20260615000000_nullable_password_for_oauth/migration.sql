-- AlterTable: make password_hash nullable so OAuth users don't need a local password
ALTER TABLE "users" ALTER COLUMN "password_hash" DROP NOT NULL;
