/*
  Warnings:

  - A unique constraint covering the columns `[employeeEquipmentLogId]` on the table `RefuelLog` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RefuelLog_employeeEquipmentLogId_key" ON "RefuelLog"("employeeEquipmentLogId");
