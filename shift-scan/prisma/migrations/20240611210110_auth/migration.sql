/*
  Warnings:

  - Made the column `nu` on table `TimeSheet` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "TimeSheet" ALTER COLUMN "nu" SET NOT NULL,
ALTER COLUMN "nu" SET DEFAULT 'nu',
ALTER COLUMN "Fp" SET DEFAULT 'fp';
