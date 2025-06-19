-- DropForeignKey
ALTER TABLE "Material" DROP CONSTRAINT "Material_truckingLogId_fkey";

-- DropForeignKey
ALTER TABLE "RefuelLog" DROP CONSTRAINT "RefuelLog_truckingLogId_fkey";

-- DropForeignKey
ALTER TABLE "StateMileage" DROP CONSTRAINT "StateMileage_truckingLogId_fkey";

-- DropForeignKey
ALTER TABLE "TruckLaborLogs" DROP CONSTRAINT "TruckLaborLogs_truckingLogId_fkey";

-- AddForeignKey
ALTER TABLE "TruckLaborLogs" ADD CONSTRAINT "TruckLaborLogs_truckingLogId_fkey" FOREIGN KEY ("truckingLogId") REFERENCES "TruckingLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StateMileage" ADD CONSTRAINT "StateMileage_truckingLogId_fkey" FOREIGN KEY ("truckingLogId") REFERENCES "TruckingLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_truckingLogId_fkey" FOREIGN KEY ("truckingLogId") REFERENCES "TruckingLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefuelLog" ADD CONSTRAINT "RefuelLog_truckingLogId_fkey" FOREIGN KEY ("truckingLogId") REFERENCES "TruckingLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
