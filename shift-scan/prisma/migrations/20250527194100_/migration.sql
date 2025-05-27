/*
  Warnings:

  - You are about to drop the column `activeEmployee` on the `User` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `CreationLogs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CreationLogs" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "activeEmployee";
