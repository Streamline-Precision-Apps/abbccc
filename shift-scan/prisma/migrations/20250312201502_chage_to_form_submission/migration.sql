/*
  Warnings:

  - You are about to drop the column `endDate` on the `FormSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `FormSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `requestType` on the `FormSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `FormSubmission` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FormSubmission" DROP COLUMN "endDate",
DROP COLUMN "name",
DROP COLUMN "requestType",
DROP COLUMN "startDate",
ALTER COLUMN "data" DROP NOT NULL;

-- DropEnum
DROP TYPE "TimeOffRequestType";
