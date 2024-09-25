/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `CostCodes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "UserCostCodes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "costCodeId" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserCostCodes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserCostCodes_id_key" ON "UserCostCodes"("id");

-- CreateIndex
CREATE UNIQUE INDEX "CostCodes_id_key" ON "CostCodes"("id");

-- AddForeignKey
ALTER TABLE "UserCostCodes" ADD CONSTRAINT "UserCostCodes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCostCodes" ADD CONSTRAINT "UserCostCodes_costCodeId_fkey" FOREIGN KEY ("costCodeId") REFERENCES "CostCodes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
