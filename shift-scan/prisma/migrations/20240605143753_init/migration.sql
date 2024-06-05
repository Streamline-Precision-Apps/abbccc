-- CreateEnum
CREATE TYPE "permission" AS ENUM ('USER', 'MANAGER', 'ADMIN', 'SUPERADMIN');

-- CreateEnum
CREATE TYPE "views" AS ENUM ('TRUCK', 'TASCO', 'BASE');

-- CreateEnum
CREATE TYPE "formStatus" AS ENUM ('PENDING', 'APPROVED', 'DENIED');

-- CreateTable
CREATE TABLE "EmployeeAccount" (
    "account_id" SERIAL NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "employee_username" TEXT NOT NULL,
    "employee_password" TEXT NOT NULL,
    "employee_privilege_level" "permission" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmployeeAccount_pkey" PRIMARY KEY ("account_id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "employee_id" SERIAL NOT NULL,
    "employee_first_name" TEXT NOT NULL,
    "employee_middle_name" TEXT,
    "employee_last_name" TEXT NOT NULL,
    "employee_last_name_2" TEXT,
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
    "vehicle_id" INTEGER,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "total_break_time" DOUBLE PRECISION,
    "duration" DOUBLE PRECISION NOT NULL,
    "starting_mileage" INTEGER,
    "ending_mileage" INTEGER,
    "left_idaho" BOOLEAN NOT NULL DEFAULT false,
    "equipment_hauled" TEXT,
    "materials_hauled" TEXT,
    "hauled_loads_quantity" INTEGER,
    "refueling_gallons" INTEGER,
    "timesheet_comments" TEXT NOT NULL,
    "app_comment" TEXT NOT NULL,

    CONSTRAINT "TimeSheet_pkey" PRIMARY KEY ("form_id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "vehicle_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "vehicle_mileage" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("vehicle_id")
);

-- CreateTable
CREATE TABLE "Trailer" (
    "trailer_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "vehicle_mileage" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trailer_pkey" PRIMARY KEY ("trailer_id")
);

-- CreateTable
CREATE TABLE "EmployeeEquipmentLog" (
    "employee_equipment_log_id" SERIAL NOT NULL,
    "equipment_id" INTEGER NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "log_start_time" TIMESTAMP(3) NOT NULL,
    "log_end_time" TIMESTAMP(3) NOT NULL,
    "equipment_notes" TEXT NOT NULL,
    "equipment_Status" TEXT NOT NULL DEFAULT 'Operational',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmployeeEquipmentLog_pkey" PRIMARY KEY ("employee_equipment_log_id")
);

-- CreateTable
CREATE TABLE "Equipment" (
    "equipment_id" SERIAL NOT NULL,
    "equipment_name" TEXT NOT NULL,
    "equipment_description" TEXT NOT NULL,
    "equipment_status" BOOLEAN NOT NULL,
    "equipment_tag" TEXT NOT NULL,
    "last_inspection" TIMESTAMP(3) NOT NULL,
    "last_repair" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("equipment_id")
);

-- CreateTable
CREATE TABLE "JobsiteEquipmentLog" (
    "jobsite_equipment_log_id" SERIAL NOT NULL,
    "jobsite_id" INTEGER NOT NULL,
    "equipment_id" INTEGER NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobsiteEquipmentLog_pkey" PRIMARY KEY ("jobsite_equipment_log_id")
);

-- CreateTable
CREATE TABLE "CostCodeJobsite" (
    "cost_code_jobsite_id" SERIAL NOT NULL,
    "jobsite_id" INTEGER NOT NULL,
    "cost_code_id" INTEGER NOT NULL,
    "log_start_time" TIMESTAMP(3) NOT NULL,
    "log_end_time" TIMESTAMP(3) NOT NULL,
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
    "updatedAt" TIMESTAMP(3) NOT NULL,

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
    "jobsite_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Crew_pkey" PRIMARY KEY ("crew_id")
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
    "position_name" "views" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Position_pkey" PRIMARY KEY ("position_id")
);

-- CreateTable
CREATE TABLE "EmployeeView" (
    "employee_View_id" SERIAL NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "view_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmployeeView_pkey" PRIMARY KEY ("employee_View_id")
);

-- CreateTable
CREATE TABLE "View" (
    "view_id" SERIAL NOT NULL,
    "view_name" "views" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "View_pkey" PRIMARY KEY ("view_id")
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
CREATE TABLE "AddressPeople" (
    "address_assigner_id" SERIAL NOT NULL,
    "address_id" INTEGER NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AddressPeople_pkey" PRIMARY KEY ("address_assigner_id")
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
CREATE TABLE "AddressJobsite" (
    "address_assigner_id" SERIAL NOT NULL,
    "address_id" INTEGER NOT NULL,
    "jobsite_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AddressJobsite_pkey" PRIMARY KEY ("address_assigner_id")
);

-- CreateTable
CREATE TABLE "JobLocation" (
    "address_id" SERIAL NOT NULL,
    "street_no" INTEGER NOT NULL,
    "street_name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipcode" INTEGER NOT NULL,
    "country" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobLocation_pkey" PRIMARY KEY ("address_id")
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
CREATE UNIQUE INDEX "EmployeeAccount_employee_id_key" ON "EmployeeAccount"("employee_id");

-- AddForeignKey
ALTER TABLE "EmployeeAccount" ADD CONSTRAINT "EmployeeAccount_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeSheet" ADD CONSTRAINT "TimeSheet_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeEquipmentLog" ADD CONSTRAINT "EmployeeEquipmentLog_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "Equipment"("equipment_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeEquipmentLog" ADD CONSTRAINT "EmployeeEquipmentLog_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobsiteEquipmentLog" ADD CONSTRAINT "JobsiteEquipmentLog_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "Equipment"("equipment_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CostCodeJobsite" ADD CONSTRAINT "CostCodeJobsite_jobsite_id_fkey" FOREIGN KEY ("jobsite_id") REFERENCES "Jobsite"("jobsite_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CostCodeJobsite" ADD CONSTRAINT "CostCodeJobsite_cost_code_id_fkey" FOREIGN KEY ("cost_code_id") REFERENCES "CostCode"("cost_code_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrewMember" ADD CONSTRAINT "CrewMember_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrewMember" ADD CONSTRAINT "CrewMember_crew_id_fkey" FOREIGN KEY ("crew_id") REFERENCES "Crew"("crew_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Crew" ADD CONSTRAINT "Crew_jobsite_id_fkey" FOREIGN KEY ("jobsite_id") REFERENCES "Jobsite"("jobsite_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeePosition" ADD CONSTRAINT "EmployeePosition_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeePosition" ADD CONSTRAINT "EmployeePosition_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "Position"("position_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeView" ADD CONSTRAINT "EmployeeView_view_id_fkey" FOREIGN KEY ("view_id") REFERENCES "View"("view_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeView" ADD CONSTRAINT "EmployeeView_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "EmployeeAccount"("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactJoin" ADD CONSTRAINT "ContactJoin_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "Contact"("contact_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactJoin" ADD CONSTRAINT "ContactJoin_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AddressPeople" ADD CONSTRAINT "AddressPeople_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "Address"("address_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AddressPeople" ADD CONSTRAINT "AddressPeople_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AddressJobsite" ADD CONSTRAINT "AddressJobsite_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "JobLocation"("address_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AddressJobsite" ADD CONSTRAINT "AddressJobsite_jobsite_id_fkey" FOREIGN KEY ("jobsite_id") REFERENCES "Jobsite"("jobsite_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormData" ADD CONSTRAINT "FormData_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE;
