/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `TascoMaterialTypes` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "TascoLog" DROP CONSTRAINT "TascoLog_materialType_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "TascoMaterialTypes_name_key" ON "TascoMaterialTypes"("name");

-- AddForeignKey
ALTER TABLE "TascoLog" ADD CONSTRAINT "TascoLog_materialType_fkey" FOREIGN KEY ("materialType") REFERENCES "TascoMaterialTypes"("name") ON DELETE CASCADE ON UPDATE CASCADE;
