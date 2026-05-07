-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "durationMonths" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "productSlug" TEXT;

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "durationMonths" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "productSlug" TEXT;
