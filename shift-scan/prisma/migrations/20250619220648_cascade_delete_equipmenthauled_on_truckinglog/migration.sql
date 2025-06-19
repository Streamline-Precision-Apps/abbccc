-- DropForeignKey
ALTER TABLE "EquipmentHauled" DROP CONSTRAINT "EquipmentHauled_truckingLogId_fkey";

-- AddForeignKey
ALTER TABLE "EquipmentHauled" ADD CONSTRAINT "EquipmentHauled_truckingLogId_fkey" FOREIGN KEY ("truckingLogId") REFERENCES "TruckingLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
