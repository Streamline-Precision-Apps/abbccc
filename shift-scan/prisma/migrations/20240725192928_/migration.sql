-- CreateEnum
CREATE TYPE "permission" AS ENUM ('USER', 'MANAGER', 'PROJECTMANAGER', 'ADMIN', 'SUPERADMIN');

-- CreateEnum
CREATE TYPE "tags" AS ENUM ('TRUCK', 'TRAILER', 'EQUIPMENT', 'VEHICLE');

-- CreateEnum
CREATE TYPE "equipmentStatus" AS ENUM ('OPERATIONAL', 'NEEDS_REPAIR');

-- CreateEnum
CREATE TYPE "formStatus" AS ENUM ('PENDING', 'APPROVED', 'DENIED');

-- CreateEnum
CREATE TYPE "formActive" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "formType" AS ENUM ('MEDICAL', 'INSPECTION', 'MANAGER', 'LEAVE', 'SAFETY', 'INJURY');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "Signature" TEXT,
    "DOB" TEXT NOT NULL,
    "truck_view" BOOLEAN NOT NULL,
    "tasco_view" BOOLEAN NOT NULL,
    "labor_view" BOOLEAN NOT NULL,
    "mechanic_view" BOOLEAN NOT NULL,
    "permission" "permission" NOT NULL,
    "email" TEXT NOT NULL,
    "email_verified" TIMESTAMP(3),
    "phone" TEXT NOT NULL,
    "image" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSettings" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "timezone" TEXT NOT NULL,
    "dateFormat" TEXT NOT NULL,
    "timeFormat" TEXT NOT NULL,

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verificationtokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Trainings" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trainings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTrainings" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "completed_trainings" INTEGER NOT NULL,
    "assigned_trainings" INTEGER NOT NULL,
    "completion" BOOLEAN NOT NULL DEFAULT false,
    "trainings" JSONB NOT NULL,

    CONSTRAINT "UserTrainings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Jobsite" (
    "id" SERIAL NOT NULL,
    "jobsite_id" TEXT NOT NULL,
    "jobsite_name" TEXT NOT NULL,
    "jobsite_active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Jobsite_pkey" PRIMARY KEY ("jobsite_id")
);

-- CreateTable
CREATE TABLE "timesheets" (
    "submit_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "jobsite_id" TEXT NOT NULL,
    "costcode" TEXT NOT NULL,
    "nu" TEXT NOT NULL DEFAULT 'nu',
    "Fp" TEXT NOT NULL DEFAULT 'fp',
    "vehicle_id" INTEGER,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3),
    "total_break_time" DOUBLE PRECISION,
    "duration" DOUBLE PRECISION,
    "starting_mileage" INTEGER,
    "ending_mileage" INTEGER,
    "left_idaho" BOOLEAN DEFAULT false,
    "equipment_hauled" TEXT,
    "materials_hauled" TEXT,
    "hauled_loads_quantity" INTEGER,
    "refueling_gallons" DOUBLE PRECISION,
    "timesheet_comments" TEXT,
    "app_comment" TEXT,
    "status" "formStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "timesheets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeEquipmentLog" (
    "id" SERIAL NOT NULL,
    "equipment_id" TEXT NOT NULL,
    "jobsite_id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3),
    "duration" DOUBLE PRECISION,
    "equipment_notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmployeeEquipmentLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Equipment" (
    "id" TEXT NOT NULL,
    "qr_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "formStatus" NOT NULL DEFAULT 'PENDING',
    "equipment_tag" "tags" NOT NULL DEFAULT 'EQUIPMENT',
    "last_inspection" TIMESTAMP(3),
    "last_repair" TIMESTAMP(3),
    "equipment_status" "equipmentStatus" NOT NULL DEFAULT 'OPERATIONAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "make" TEXT,
    "model" TEXT,
    "year" TEXT,
    "license_plate" TEXT,
    "registration_expiration" TIMESTAMP(3),
    "mileage" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CostCode" (
    "id" SERIAL NOT NULL,
    "cost_code" TEXT NOT NULL,
    "cost_code_description" TEXT NOT NULL,
    "cost_code_type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CostCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrewMember" (
    "id" SERIAL NOT NULL,
    "supervisor" BOOLEAN NOT NULL DEFAULT false,
    "employee_id" TEXT NOT NULL,
    "crew_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CrewMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Crew" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Crew_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrewJobsite" (
    "id" SERIAL NOT NULL,
    "crew_id" INTEGER NOT NULL,
    "jobsite_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CrewJobsite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" SERIAL NOT NULL,
    "phone_number" TEXT NOT NULL,
    "email" TEXT,
    "emergency_contact" TEXT,
    "emergency_contact_no" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipcode" INTEGER NOT NULL,
    "country" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Form" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "formType" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT '[]',
    "updatedNow" TIMESTAMP(3),
    "published" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Form_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormSubmissions" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "formId" INTEGER NOT NULL,
    "type" "formType" NOT NULL,
    "submitted" BOOLEAN NOT NULL DEFAULT false,
    "status" "formStatus" NOT NULL DEFAULT 'PENDING',
    "content" TEXT NOT NULL,

    CONSTRAINT "FormSubmissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InjuryForm" (
    "id" SERIAL NOT NULL,
    "contactedSupervisor" BOOLEAN NOT NULL DEFAULT false,
    "incidentDescription" TEXT NOT NULL,
    "signedForm" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "InjuryForm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CostCodeToJobsite" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ContactToUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_AddressToJobsite" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_Signature_key" ON "users"("Signature");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_user_id_key" ON "UserSettings"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_token_key" ON "sessions"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "verificationtokens_identifier_token_key" ON "verificationtokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "UserTrainings_user_id_key" ON "UserTrainings"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Equipment_qr_id_key" ON "Equipment"("qr_id");

-- CreateIndex
CREATE UNIQUE INDEX "Form_id_name_key" ON "Form"("id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "_CostCodeToJobsite_AB_unique" ON "_CostCodeToJobsite"("A", "B");

-- CreateIndex
CREATE INDEX "_CostCodeToJobsite_B_index" ON "_CostCodeToJobsite"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ContactToUser_AB_unique" ON "_ContactToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ContactToUser_B_index" ON "_ContactToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AddressToJobsite_AB_unique" ON "_AddressToJobsite"("A", "B");

-- CreateIndex
CREATE INDEX "_AddressToJobsite_B_index" ON "_AddressToJobsite"("B");

-- AddForeignKey
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTrainings" ADD CONSTRAINT "UserTrainings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timesheets" ADD CONSTRAINT "timesheets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timesheets" ADD CONSTRAINT "timesheets_jobsite_id_fkey" FOREIGN KEY ("jobsite_id") REFERENCES "Jobsite"("jobsite_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeEquipmentLog" ADD CONSTRAINT "EmployeeEquipmentLog_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeEquipmentLog" ADD CONSTRAINT "EmployeeEquipmentLog_jobsite_id_fkey" FOREIGN KEY ("jobsite_id") REFERENCES "Jobsite"("jobsite_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeEquipmentLog" ADD CONSTRAINT "EmployeeEquipmentLog_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "Equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrewMember" ADD CONSTRAINT "CrewMember_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrewMember" ADD CONSTRAINT "CrewMember_crew_id_fkey" FOREIGN KEY ("crew_id") REFERENCES "Crew"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrewJobsite" ADD CONSTRAINT "CrewJobsite_crew_id_fkey" FOREIGN KEY ("crew_id") REFERENCES "Crew"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrewJobsite" ADD CONSTRAINT "CrewJobsite_jobsite_id_fkey" FOREIGN KEY ("jobsite_id") REFERENCES "Jobsite"("jobsite_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormSubmissions" ADD CONSTRAINT "FormSubmissions_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormSubmissions" ADD CONSTRAINT "FormSubmissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CostCodeToJobsite" ADD CONSTRAINT "_CostCodeToJobsite_A_fkey" FOREIGN KEY ("A") REFERENCES "CostCode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CostCodeToJobsite" ADD CONSTRAINT "_CostCodeToJobsite_B_fkey" FOREIGN KEY ("B") REFERENCES "Jobsite"("jobsite_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContactToUser" ADD CONSTRAINT "_ContactToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContactToUser" ADD CONSTRAINT "_ContactToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AddressToJobsite" ADD CONSTRAINT "_AddressToJobsite_A_fkey" FOREIGN KEY ("A") REFERENCES "Address"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AddressToJobsite" ADD CONSTRAINT "_AddressToJobsite_B_fkey" FOREIGN KEY ("B") REFERENCES "Jobsite"("jobsite_id") ON DELETE CASCADE ON UPDATE CASCADE;
