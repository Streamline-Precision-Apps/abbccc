-- AlterTable
ALTER TABLE "TruckingLog" ADD COLUMN     "truckLaborLogId" TEXT;

-- CreateTable
CREATE TABLE "TruckLaborLogs" (
    "id" TEXT NOT NULL,
    "truckingLogId" TEXT,
    "type" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),

    CONSTRAINT "TruckLaborLogs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TruckLaborLogs" ADD CONSTRAINT "TruckLaborLogs_truckingLogId_fkey" FOREIGN KEY ("truckingLogId") REFERENCES "TruckingLog"("id") ON DELETE SET NULL ON UPDATE CASCADE;
