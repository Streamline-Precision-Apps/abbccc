/*
  Warnings:

  - You are about to drop the column `approved` on the `timeoffRequestForm` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "timeoffRequestForm" DROP COLUMN "approved",
ADD COLUMN     "status" "FormStatus" NOT NULL DEFAULT 'PENDING';
