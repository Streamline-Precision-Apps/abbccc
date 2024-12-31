/*
  Warnings:

  - Added the required column `truckingCCId` to the `TruckingLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `truckingJobSiteId` to the `TruckingLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TruckingLog" ADD COLUMN     "truckingCCId" TEXT NOT NULL,
ADD COLUMN     "truckingJobSiteId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "TruckingLog" ADD CONSTRAINT "TruckingLog_truckingJobSiteId_fkey" FOREIGN KEY ("truckingJobSiteId") REFERENCES "Jobsite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TruckingLog" ADD CONSTRAINT "TruckingLog_truckingCCId_fkey" FOREIGN KEY ("truckingCCId") REFERENCES "CostCode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
