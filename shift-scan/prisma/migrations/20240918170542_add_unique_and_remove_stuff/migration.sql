/*
  Warnings:

  - You are about to drop the `UserCostCodes` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `CostCodes` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "UserCostCodes" DROP CONSTRAINT "UserCostCodes_costCodeId_fkey";

-- DropForeignKey
ALTER TABLE "UserCostCodes" DROP CONSTRAINT "UserCostCodes_userId_fkey";

-- DropIndex
DROP INDEX "CostCodes_id_key";

-- DropTable
DROP TABLE "UserCostCodes";

-- CreateIndex
CREATE UNIQUE INDEX "CostCodes_name_key" ON "CostCodes"("name");
