/*
  Warnings:

  - You are about to drop the column `status` on the `Jobsite` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Jobsite_approvalStatus_idx";

-- AlterTable
ALTER TABLE "CostCode" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Jobsite" DROP COLUMN "status";
