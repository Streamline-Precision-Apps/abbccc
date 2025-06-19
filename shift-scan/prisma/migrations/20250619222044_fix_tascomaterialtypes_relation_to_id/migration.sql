-- DropForeignKey
ALTER TABLE "TascoLog" DROP CONSTRAINT "TascoLog_materialType_fkey";

-- AddForeignKey
ALTER TABLE "TascoLog" ADD CONSTRAINT "TascoLog_materialType_fkey" FOREIGN KEY ("materialType") REFERENCES "TascoMaterialTypes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
