/*
  Warnings:

  - You are about to drop the column `box_1` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the column `box_2` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the column `box_3` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the column `box_4` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the column `box_5` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the column `box_6` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the column `box_7` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the column `box_8` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the column `box_9` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FormData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `type` to the `Form` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Form` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "formType" AS ENUM ('MEDICAL', 'INSPECTION', 'MANAGER', 'LEAVE', 'SAFETY');

-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "FormData" DROP CONSTRAINT "FormData_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- AlterTable
ALTER TABLE "EmployeeEquipmentLog" ALTER COLUMN "end_time" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Form" DROP COLUMN "box_1",
DROP COLUMN "box_2",
DROP COLUMN "box_3",
DROP COLUMN "box_4",
DROP COLUMN "box_5",
DROP COLUMN "box_6",
DROP COLUMN "box_7",
DROP COLUMN "box_8",
DROP COLUMN "box_9",
DROP COLUMN "title",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" "formStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "type" "formType" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "Account";

-- DropTable
DROP TABLE "FormData";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "VerificationToken";

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verificationtokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "FormStructure" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "box_1" BOOLEAN NOT NULL DEFAULT false,
    "box_2" BOOLEAN NOT NULL DEFAULT false,
    "box_3" BOOLEAN NOT NULL DEFAULT false,
    "box_4" BOOLEAN NOT NULL DEFAULT false,
    "box_5" BOOLEAN NOT NULL DEFAULT false,
    "box_6" BOOLEAN NOT NULL DEFAULT false,
    "box_7" BOOLEAN NOT NULL DEFAULT false,
    "box_8" BOOLEAN NOT NULL DEFAULT false,
    "box_9" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "FormStructure_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_token_key" ON "sessions"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "verificationtokens_identifier_token_key" ON "verificationtokens"("identifier", "token");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_id_fkey" FOREIGN KEY ("id") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
