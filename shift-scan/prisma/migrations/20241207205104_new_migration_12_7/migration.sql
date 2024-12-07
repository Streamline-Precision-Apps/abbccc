/*
  Warnings:

  - You are about to drop the column `image` on the `Equipment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[employeeId]` on the table `CrewMembers` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "FormStatus" ADD VALUE 'TEMPORARY';

-- DropForeignKey
ALTER TABLE "Contacts" DROP CONSTRAINT "Contacts_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "CrewMembers" DROP CONSTRAINT "CrewMembers_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "EmployeeEquipmentLogs" DROP CONSTRAINT "EmployeeEquipmentLogs_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "InjuryForms" DROP CONSTRAINT "InjuryForms_userId_fkey";

-- DropForeignKey
ALTER TABLE "TimeSheets" DROP CONSTRAINT "TimeSheets_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserSettings" DROP CONSTRAINT "UserSettings_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserTrainings" DROP CONSTRAINT "UserTrainings_userId_fkey";

-- DropForeignKey
ALTER TABLE "timeoffRequestForms" DROP CONSTRAINT "timeoffRequestForms_employeeId_fkey";

-- AlterTable
ALTER TABLE "Equipment" DROP COLUMN "image";

-- CreateIndex
CREATE UNIQUE INDEX "CrewMembers_employeeId_key" ON "CrewMembers"("employeeId");

-- AddForeignKey
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTrainings" ADD CONSTRAINT "UserTrainings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeSheets" ADD CONSTRAINT "TimeSheets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeEquipmentLogs" ADD CONSTRAINT "EmployeeEquipmentLogs_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrewMembers" ADD CONSTRAINT "CrewMembers_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contacts" ADD CONSTRAINT "Contacts_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InjuryForms" ADD CONSTRAINT "InjuryForms_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timeoffRequestForms" ADD CONSTRAINT "timeoffRequestForms_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
