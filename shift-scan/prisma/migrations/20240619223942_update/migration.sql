/*
  Warnings:

  - The primary key for the `ContactJoin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `employee_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `AddressJobsite` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CostCodeJobsite` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AddressJobsite" DROP CONSTRAINT "AddressJobsite_address_id_fkey";

-- DropForeignKey
ALTER TABLE "AddressJobsite" DROP CONSTRAINT "AddressJobsite_jobsite_id_fkey";

-- DropForeignKey
ALTER TABLE "CostCodeJobsite" DROP CONSTRAINT "CostCodeJobsite_cost_code_id_fkey";

-- DropForeignKey
ALTER TABLE "CostCodeJobsite" DROP CONSTRAINT "CostCodeJobsite_jobsite_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_employee_id_fkey";

-- DropIndex
DROP INDEX "AddressEmployee_address_id_employee_id_key";

-- DropIndex
DROP INDEX "EmployeePosition_position_id_employee_id_key";

-- AlterTable
ALTER TABLE "AddressEmployee" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "AddressEmployee_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ContactJoin" DROP CONSTRAINT "ContactJoin_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "ContactJoin_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "EmployeePosition" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "EmployeePosition_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" DROP COLUMN "employee_id";

-- DropTable
DROP TABLE "AddressJobsite";

-- DropTable
DROP TABLE "CostCodeJobsite";

-- CreateTable
CREATE TABLE "_EmployeeToUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CostCodeToJobsite" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_AddressToJobsite" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_EmployeeToUser_AB_unique" ON "_EmployeeToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_EmployeeToUser_B_index" ON "_EmployeeToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CostCodeToJobsite_AB_unique" ON "_CostCodeToJobsite"("A", "B");

-- CreateIndex
CREATE INDEX "_CostCodeToJobsite_B_index" ON "_CostCodeToJobsite"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AddressToJobsite_AB_unique" ON "_AddressToJobsite"("A", "B");

-- CreateIndex
CREATE INDEX "_AddressToJobsite_B_index" ON "_AddressToJobsite"("B");

-- AddForeignKey
ALTER TABLE "_EmployeeToUser" ADD CONSTRAINT "_EmployeeToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmployeeToUser" ADD CONSTRAINT "_EmployeeToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CostCodeToJobsite" ADD CONSTRAINT "_CostCodeToJobsite_A_fkey" FOREIGN KEY ("A") REFERENCES "CostCode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CostCodeToJobsite" ADD CONSTRAINT "_CostCodeToJobsite_B_fkey" FOREIGN KEY ("B") REFERENCES "Jobsite"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AddressToJobsite" ADD CONSTRAINT "_AddressToJobsite_A_fkey" FOREIGN KEY ("A") REFERENCES "Address"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AddressToJobsite" ADD CONSTRAINT "_AddressToJobsite_B_fkey" FOREIGN KEY ("B") REFERENCES "Jobsite"("id") ON DELETE CASCADE ON UPDATE CASCADE;
