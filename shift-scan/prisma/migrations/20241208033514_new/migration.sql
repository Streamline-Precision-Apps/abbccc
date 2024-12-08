-- CreateEnum
CREATE TYPE "Permission" AS ENUM ('USER', 'MANAGER', 'ADMIN', 'SUPERADMIN');

-- CreateEnum
CREATE TYPE "Tags" AS ENUM ('TRUCK', 'TRAILER', 'EQUIPMENT', 'VEHICLE');

-- CreateEnum
CREATE TYPE "EquipmentStatus" AS ENUM ('OPERATIONAL', 'NEEDS_REPAIR', 'NEEDS_MAINTENANCE');

-- CreateEnum
CREATE TYPE "FormStatus" AS ENUM ('PENDING', 'APPROVED', 'DENIED', 'TEMPORARY');

-- CreateEnum
CREATE TYPE "IsActive" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "FormType" AS ENUM ('MEDICAL', 'INSPECTION', 'MANAGER', 'LEAVE', 'SAFETY', 'INJURY');

-- CreateTable
CREATE TABLE "PasswordResetTokens" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiration" TIMESTAMP(3) NOT NULL,
    "usersId" TEXT,

    CONSTRAINT "PasswordResetTokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "signature" TEXT,
    "DOB" TEXT NOT NULL,
    "truckView" BOOLEAN NOT NULL,
    "tascoView" BOOLEAN NOT NULL,
    "laborView" BOOLEAN NOT NULL,
    "mechanicView" BOOLEAN NOT NULL,
    "permission" "Permission" NOT NULL,
    "image" TEXT,
    "activeEmployee" BOOLEAN NOT NULL DEFAULT true,
    "startDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "terminationDate" TIMESTAMP(3),
    "accountSetup" BOOLEAN NOT NULL DEFAULT false,
    "passwordResetTokensId" TEXT,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "approvedRequests" BOOLEAN NOT NULL DEFAULT false,
    "timeOffRequests" BOOLEAN NOT NULL DEFAULT false,
    "generalReminders" BOOLEAN NOT NULL DEFAULT false,
    "biometric" BOOLEAN NOT NULL DEFAULT false,
    "cameraAccess" BOOLEAN NOT NULL DEFAULT false,
    "locationAccess" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trainings" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trainings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTrainings" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "trainingId" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserTrainings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Jobsites" (
    "id" TEXT NOT NULL,
    "qrId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "status" "FormStatus" NOT NULL DEFAULT 'PENDING',
    "name" TEXT NOT NULL,
    "streetNumber" TEXT,
    "streetName" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "description" TEXT NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Jobsites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeSheets" (
    "submitDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "jobsiteId" TEXT NOT NULL,
    "costcode" TEXT NOT NULL,
    "nu" TEXT NOT NULL DEFAULT 'nu',
    "Fp" TEXT NOT NULL DEFAULT 'fp',
    "vehicleId" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "duration" DOUBLE PRECISION,
    "startingMileage" INTEGER,
    "endingMileage" INTEGER,
    "leftIdaho" BOOLEAN DEFAULT false,
    "equipmentHauled" TEXT,
    "materialsHauled" TEXT,
    "hauledLoadsQuantity" INTEGER,
    "refuelingGallons" DOUBLE PRECISION,
    "timeSheetComments" TEXT,
    "status" "FormStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "TimeSheets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeEquipmentLogs" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "equipmentId" TEXT NOT NULL,
    "jobsiteId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "duration" DOUBLE PRECISION,
    "isRefueled" BOOLEAN NOT NULL DEFAULT false,
    "fuelUsed" DOUBLE PRECISION DEFAULT 0.0,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "isSubmitted" BOOLEAN NOT NULL DEFAULT false,
    "status" "FormStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "EmployeeEquipmentLogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Equipment" (
    "id" TEXT NOT NULL,
    "qrId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "equipmentTag" "Tags" NOT NULL DEFAULT 'EQUIPMENT',
    "lastInspection" TIMESTAMP(3),
    "lastRepair" TIMESTAMP(3),
    "status" "EquipmentStatus" NOT NULL DEFAULT 'OPERATIONAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "make" TEXT,
    "model" TEXT,
    "year" TEXT,
    "licensePlate" TEXT,
    "registrationExpiration" TIMESTAMP(3),
    "mileage" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "inUse" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CostCodes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CostCodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CCTags" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "CCTags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrewMembers" (
    "id" SERIAL NOT NULL,
    "supervisor" BOOLEAN NOT NULL DEFAULT false,
    "employeeId" TEXT NOT NULL,
    "crewId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CrewMembers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Crews" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Crews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrewJobsites" (
    "id" SERIAL NOT NULL,
    "crewId" INTEGER NOT NULL,
    "jobsiteId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CrewJobsites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contacts" (
    "id" SERIAL NOT NULL,
    "employeeId" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT,
    "emergencyContact" TEXT,
    "emergencyContactNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Addresses" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" INTEGER NOT NULL,
    "country" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InjuryForms" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "submitDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date" DATE NOT NULL,
    "contactedSupervisor" BOOLEAN NOT NULL DEFAULT false,
    "incidentDescription" TEXT NOT NULL,
    "signature" TEXT,
    "verifyFormSignature" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "InjuryForms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timeoffRequestForms" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "requestedStartDate" TIMESTAMP(3) NOT NULL,
    "requestedEndDate" TIMESTAMP(3) NOT NULL,
    "requestType" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "managerComment" TEXT,
    "status" "FormStatus" NOT NULL DEFAULT 'PENDING',
    "employeeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "decidedBy" TEXT,

    CONSTRAINT "timeoffRequestForms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CCTagsToJobsites" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CCTagsToCostCodes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_AddressesToJobsites" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetTokens_token_key" ON "PasswordResetTokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetTokens_email_token_key" ON "PasswordResetTokens"("email", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_userId_key" ON "UserSettings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserTrainings_trainingId_key" ON "UserTrainings"("trainingId");

-- CreateIndex
CREATE UNIQUE INDEX "Jobsites_qrId_key" ON "Jobsites"("qrId");

-- CreateIndex
CREATE UNIQUE INDEX "Equipment_qrId_key" ON "Equipment"("qrId");

-- CreateIndex
CREATE UNIQUE INDEX "CostCodes_name_key" ON "CostCodes"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CCTags_name_key" ON "CCTags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Contacts_employeeId_key" ON "Contacts"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "_CCTagsToJobsites_AB_unique" ON "_CCTagsToJobsites"("A", "B");

-- CreateIndex
CREATE INDEX "_CCTagsToJobsites_B_index" ON "_CCTagsToJobsites"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CCTagsToCostCodes_AB_unique" ON "_CCTagsToCostCodes"("A", "B");

-- CreateIndex
CREATE INDEX "_CCTagsToCostCodes_B_index" ON "_CCTagsToCostCodes"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AddressesToJobsites_AB_unique" ON "_AddressesToJobsites"("A", "B");

-- CreateIndex
CREATE INDEX "_AddressesToJobsites_B_index" ON "_AddressesToJobsites"("B");

-- AddForeignKey
ALTER TABLE "PasswordResetTokens" ADD CONSTRAINT "PasswordResetTokens_email_fkey" FOREIGN KEY ("email") REFERENCES "Users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTrainings" ADD CONSTRAINT "UserTrainings_trainingId_fkey" FOREIGN KEY ("trainingId") REFERENCES "Trainings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTrainings" ADD CONSTRAINT "UserTrainings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeSheets" ADD CONSTRAINT "TimeSheets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeSheets" ADD CONSTRAINT "TimeSheets_jobsiteId_fkey" FOREIGN KEY ("jobsiteId") REFERENCES "Jobsites"("qrId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeEquipmentLogs" ADD CONSTRAINT "EmployeeEquipmentLogs_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeEquipmentLogs" ADD CONSTRAINT "EmployeeEquipmentLogs_jobsiteId_fkey" FOREIGN KEY ("jobsiteId") REFERENCES "Jobsites"("qrId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeEquipmentLogs" ADD CONSTRAINT "EmployeeEquipmentLogs_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrewMembers" ADD CONSTRAINT "CrewMembers_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "Crews"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrewMembers" ADD CONSTRAINT "CrewMembers_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrewJobsites" ADD CONSTRAINT "CrewJobsites_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "Crews"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrewJobsites" ADD CONSTRAINT "CrewJobsites_jobsiteId_fkey" FOREIGN KEY ("jobsiteId") REFERENCES "Jobsites"("qrId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contacts" ADD CONSTRAINT "Contacts_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InjuryForms" ADD CONSTRAINT "InjuryForms_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timeoffRequestForms" ADD CONSTRAINT "timeoffRequestForms_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CCTagsToJobsites" ADD CONSTRAINT "_CCTagsToJobsites_A_fkey" FOREIGN KEY ("A") REFERENCES "CCTags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CCTagsToJobsites" ADD CONSTRAINT "_CCTagsToJobsites_B_fkey" FOREIGN KEY ("B") REFERENCES "Jobsites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CCTagsToCostCodes" ADD CONSTRAINT "_CCTagsToCostCodes_A_fkey" FOREIGN KEY ("A") REFERENCES "CCTags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CCTagsToCostCodes" ADD CONSTRAINT "_CCTagsToCostCodes_B_fkey" FOREIGN KEY ("B") REFERENCES "CostCodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AddressesToJobsites" ADD CONSTRAINT "_AddressesToJobsites_A_fkey" FOREIGN KEY ("A") REFERENCES "Addresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AddressesToJobsites" ADD CONSTRAINT "_AddressesToJobsites_B_fkey" FOREIGN KEY ("B") REFERENCES "Jobsites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
