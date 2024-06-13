/*
  Warnings:

  - You are about to drop the column `employee_last_name_2` on the `Employee` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "employee_last_name_2";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "labor_view" BOOLEAN,
ADD COLUMN     "mechanic_view" BOOLEAN,
ADD COLUMN     "tasco_view" BOOLEAN,
ADD COLUMN     "truck_view" BOOLEAN;
