-- CreateEnum
CREATE TYPE "permission" AS ENUM ('USER', 'MANAGER', 'ADMIN', 'SUPERADMIN');

-- CreateEnum
CREATE TYPE "formStatus" AS ENUM ('PENDING', 'APPROVED', 'DENIED');

-- CreateEnum
CREATE TYPE "tags" AS ENUM ('Truck', 'Trailer', 'Equipment');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "truck_view" BOOLEAN,
    "tasco_view" BOOLEAN,
    "labor_view" BOOLEAN,
    "mechanic_view" BOOLEAN,
    "email" TEXT NOT NULL,
    "email_verified" TIMESTAMP(3),
    "phone" TEXT NOT NULL,
    "image" TEXT,
    "employee_id" INTEGER,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "userId" TEXT NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("provider","providerAccountId")
);

-- CreateTable
CREATE TABLE "Session" (
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("identifier","token")
);

-- CreateTable
CREATE TABLE "Employee" (
    "employee_id" SERIAL NOT NULL,
    "employee_first_name" TEXT NOT NULL,
    "employee_middle_name" TEXT,
    "employee_last_name" TEXT NOT NULL,
    "employee_dob" TIMESTAMP(3) NOT NULL,
    "employee_start_date" TIMESTAMP(3),
    "employee_termination_date" TIMESTAMP(3),
    "employee_availability" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("employee_id")
);

-- CreateTable
CREATE TABLE "Jobsite" (
    "jobsite_id" SERIAL NOT NULL,
    "qr_id" TEXT NOT NULL,
    "jobsite_name" TEXT NOT NULL,
    "jobsite_active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Jobsite_pkey" PRIMARY KEY ("jobsite_id")
);

-- CreateTable
CREATE TABLE "TimeSheet" (
    "submit_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "form_id" SERIAL NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "jobsite_id" INTEGER NOT NULL,
    "costcode" TEXT NOT NULL,
    "nu" TEXT NOT NULL DEFAULT 'nu',
    "Fp" TEXT DEFAULT 'fp',
    "vehicle_id" INTEGER,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "total_break_time" DOUBLE PRECISION,
    "duration" DOUBLE PRECISION NOT NULL,
    "starting_mileage" INTEGER,
    "ending_mileage" INTEGER,
    "left_idaho" BOOLEAN DEFAULT false,
    "equipment_hauled" TEXT,
    "materials_hauled" TEXT,
    "hauled_loads_quantity" INTEGER,
    "refueling_gallons" INTEGER,
    "timesheet_comments" TEXT,
    "app_comment" TEXT,

    CONSTRAINT "TimeSheet_pkey" PRIMARY KEY ("form_id")
);

-- CreateTable
CREATE TABLE "EmployeeEquipmentLog" (
    "employee_equipment_log_id" SERIAL NOT NULL,
    "equipment_id" INTEGER NOT NULL,
    "jobsite_id" INTEGER NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "equipment_notes" TEXT NOT NULL,
    "equipment_status" TEXT NOT NULL DEFAULT 'Operational',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmployeeEquipmentLog_pkey" PRIMARY KEY ("employee_equipment_log_id")
);

-- CreateTable
CREATE TABLE "Equipment" (
    "equipment_id" SERIAL NOT NULL,
    "is_vehicle" BOOLEAN NOT NULL,
    "is_trailer" BOOLEAN NOT NULL,
    "qr_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,
    "equipment_tag" "tags" NOT NULL,
    "last_inspection" TIMESTAMP(3),
    "last_repair" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "make" TEXT,
    "model" TEXT,
    "year" TEXT,
    "license_plate" TEXT,
    "is_registered" TIMESTAMP(3),
    "mileage" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("equipment_id")
);

-- CreateTable
CREATE TABLE "CostCodeJobsite" (
    "cost_code_jobsite_id" SERIAL NOT NULL,
    "jobsite_id" INTEGER NOT NULL,
    "cost_code_id" INTEGER NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CostCodeJobsite_pkey" PRIMARY KEY ("cost_code_jobsite_id")
);

-- CreateTable
CREATE TABLE "CostCode" (
    "cost_code_id" SERIAL NOT NULL,
    "cost_code" TEXT NOT NULL,
    "cost_code_description" TEXT NOT NULL,
    "cost_code_type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CostCode_pkey" PRIMARY KEY ("cost_code_id")
);

-- CreateTable
CREATE TABLE "CrewMember" (
    "crew_member_id" SERIAL NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "crew_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CrewMember_pkey" PRIMARY KEY ("crew_member_id")
);

-- CreateTable
CREATE TABLE "Crew" (
    "crew_id" SERIAL NOT NULL,
    "crew_name" TEXT NOT NULL,
    "crew_description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Crew_pkey" PRIMARY KEY ("crew_id")
);

-- CreateTable
CREATE TABLE "CrewJobsite" (
    "crewJobsite_id" SERIAL NOT NULL,
    "crew_id" INTEGER NOT NULL,
    "jobsite_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CrewJobsite_pkey" PRIMARY KEY ("crewJobsite_id")
);

-- CreateTable
CREATE TABLE "EmployeePosition" (
    "employee_positions_id" SERIAL NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "position_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmployeePosition_pkey" PRIMARY KEY ("employee_positions_id")
);

-- CreateTable
CREATE TABLE "Position" (
    "position_id" SERIAL NOT NULL,
    "position_name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Position_pkey" PRIMARY KEY ("position_id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "contact_id" SERIAL NOT NULL,
    "phone_number" TEXT,
    "email" TEXT NOT NULL,
    "emergency_contact" TEXT NOT NULL,
    "emergency_contact_no" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("contact_id")
);

-- CreateTable
CREATE TABLE "ContactJoin" (
    "contact_join_id" SERIAL NOT NULL,
    "contact_id" INTEGER NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactJoin_pkey" PRIMARY KEY ("contact_join_id")
);

-- CreateTable
CREATE TABLE "AddressAssigner" (
    "address_assigner_id" SERIAL NOT NULL,
    "address_id" INTEGER NOT NULL,
    "employee_id" INTEGER,
    "jobsite_id" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AddressAssigner_pkey" PRIMARY KEY ("address_assigner_id")
);

-- CreateTable
CREATE TABLE "Address" (
    "address_id" SERIAL NOT NULL,
    "street_no" INTEGER NOT NULL,
    "street_name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipcode" INTEGER NOT NULL,
    "country" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("address_id")
);

-- CreateTable
CREATE TABLE "FormData" (
    "form_id" SERIAL NOT NULL,
    "form_type" TEXT NOT NULL,
    "form_name" TEXT NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "start_date_requested" TIMESTAMP(3) NOT NULL,
    "end_date_requested" TIMESTAMP(3) NOT NULL,
    "time_request_type" TEXT NOT NULL,
    "time_request_comments" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "formStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "FormData_pkey" PRIMARY KEY ("form_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_employee_id_key" ON "Account"("employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "Jobsite_qr_id_key" ON "Jobsite"("qr_id");

-- CreateIndex
CREATE UNIQUE INDEX "Equipment_qr_id_key" ON "Equipment"("qr_id");

-- CreateIndex
CREATE UNIQUE INDEX "CrewJobsite_crew_id_jobsite_id_key" ON "CrewJobsite"("crew_id", "jobsite_id");

-- CreateIndex
CREATE UNIQUE INDEX "EmployeePosition_position_id_employee_id_key" ON "EmployeePosition"("position_id", "employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "Position_position_name_key" ON "Position"("position_name");

-- CreateIndex
CREATE UNIQUE INDEX "AddressAssigner_employee_id_jobsite_id_key" ON "AddressAssigner"("employee_id", "jobsite_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("employee_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeSheet" ADD CONSTRAINT "TimeSheet_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeEquipmentLog" ADD CONSTRAINT "EmployeeEquipmentLog_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeEquipmentLog" ADD CONSTRAINT "EmployeeEquipmentLog_jobsite_id_fkey" FOREIGN KEY ("jobsite_id") REFERENCES "Jobsite"("jobsite_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeEquipmentLog" ADD CONSTRAINT "EmployeeEquipmentLog_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "Equipment"("equipment_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CostCodeJobsite" ADD CONSTRAINT "CostCodeJobsite_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CostCodeJobsite" ADD CONSTRAINT "CostCodeJobsite_jobsite_id_fkey" FOREIGN KEY ("jobsite_id") REFERENCES "Jobsite"("jobsite_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CostCodeJobsite" ADD CONSTRAINT "CostCodeJobsite_cost_code_id_fkey" FOREIGN KEY ("cost_code_id") REFERENCES "CostCode"("cost_code_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrewMember" ADD CONSTRAINT "CrewMember_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrewMember" ADD CONSTRAINT "CrewMember_crew_id_fkey" FOREIGN KEY ("crew_id") REFERENCES "Crew"("crew_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrewJobsite" ADD CONSTRAINT "CrewJobsite_crew_id_fkey" FOREIGN KEY ("crew_id") REFERENCES "Crew"("crew_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrewJobsite" ADD CONSTRAINT "CrewJobsite_jobsite_id_fkey" FOREIGN KEY ("jobsite_id") REFERENCES "Jobsite"("jobsite_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeePosition" ADD CONSTRAINT "EmployeePosition_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeePosition" ADD CONSTRAINT "EmployeePosition_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "Position"("position_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactJoin" ADD CONSTRAINT "ContactJoin_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "Contact"("contact_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactJoin" ADD CONSTRAINT "ContactJoin_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AddressAssigner" ADD CONSTRAINT "AddressAssigner_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "Address"("address_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AddressAssigner" ADD CONSTRAINT "AddressAssigner_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("employee_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AddressAssigner" ADD CONSTRAINT "AddressAssigner_jobsite_id_fkey" FOREIGN KEY ("jobsite_id") REFERENCES "Jobsite"("jobsite_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormData" ADD CONSTRAINT "FormData_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE;
