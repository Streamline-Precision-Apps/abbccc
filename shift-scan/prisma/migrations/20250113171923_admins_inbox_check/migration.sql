-- AlterTable
ALTER TABLE "Refueled" ADD COLUMN     "milesAtfueling" INTEGER;

-- AlterTable
ALTER TABLE "TimeSheet" ADD COLUMN     "createdByAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "editedByUserId" TEXT,
ADD COLUMN     "newTimeSheetId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "clockedIn" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "timeOffRequestForm" ADD COLUMN     "name" TEXT,
ADD COLUMN     "signature" TEXT;
