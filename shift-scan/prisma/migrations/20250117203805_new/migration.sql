-- DropForeignKey
ALTER TABLE "TimeSheet" DROP CONSTRAINT "TimeSheet_costcode_fkey";

-- AddForeignKey
ALTER TABLE "TimeSheet" ADD CONSTRAINT "TimeSheet_costcode_fkey" FOREIGN KEY ("costcode") REFERENCES "CostCode"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
