-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "createAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" DATETIME NOT NULL,
    "SubscriptionDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "CostCode" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "CCTag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Crew" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "crewType" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PdfDocument" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "qrId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "description" TEXT,
    "fileData" BLOB NOT NULL,
    "contentType" TEXT NOT NULL DEFAULT 'application/pdf',
    "size" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploadDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "DocumentTag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tagName" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Equipment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "qrId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "equipmentTag" TEXT NOT NULL DEFAULT 'EQUIPMENT',
    "status" TEXT NOT NULL DEFAULT 'OPERATIONAL',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "inUse" BOOLEAN NOT NULL DEFAULT false,
    "overWeight" BOOLEAN DEFAULT false,
    "currentWeight" REAL DEFAULT 0
);

-- CreateTable
CREATE TABLE "CreationLogs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdById" TEXT,
    "equipmentId" TEXT,
    "jobsiteId" TEXT,
    "comment" TEXT,
    "createdByOffice" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CreationLogs_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "CreationLogs_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "CreationLogs_jobsiteId_fkey" FOREIGN KEY ("jobsiteId") REFERENCES "Jobsite" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EquipmentVehicleInfo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "make" TEXT,
    "model" TEXT,
    "year" TEXT,
    "licensePlate" TEXT,
    "registrationExpiration" DATETIME,
    "mileage" INTEGER,
    CONSTRAINT "EquipmentVehicleInfo_id_fkey" FOREIGN KEY ("id") REFERENCES "Equipment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmployeeEquipmentLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "equipmentId" TEXT NOT NULL,
    "jobsiteId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "startTime" DATETIME,
    "endTime" DATETIME,
    "comment" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isFinished" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "timeSheetId" TEXT,
    "tascoLogId" TEXT,
    "laborLogId" TEXT,
    "truckingLogId" TEXT,
    CONSTRAINT "EmployeeEquipmentLog_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EmployeeEquipmentLog_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EmployeeEquipmentLog_jobsiteId_fkey" FOREIGN KEY ("jobsiteId") REFERENCES "Jobsite" ("qrId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EmployeeEquipmentLog_timeSheetId_fkey" FOREIGN KEY ("timeSheetId") REFERENCES "TimeSheet" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EquipmentHauled" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "truckingLogId" TEXT NOT NULL,
    "equipmentId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "jobSiteId" TEXT,
    CONSTRAINT "EquipmentHauled_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment" ("qrId") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "EquipmentHauled_jobSiteId_fkey" FOREIGN KEY ("jobSiteId") REFERENCES "Jobsite" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EquipmentHauled_truckingLogId_fkey" FOREIGN KEY ("truckingLogId") REFERENCES "TruckingLog" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Error" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "errorMessage" TEXT,
    "userId" TEXT,
    "fileLocation" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "FormTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "formType" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "isSignatureRequired" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "FormTemplate_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FormGrouping" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT,
    "order" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "FormField" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "formGroupingId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL,
    "defaultValue" TEXT,
    "placeholder" TEXT,
    "maxLength" INTEGER,
    "helperText" TEXT,
    CONSTRAINT "FormField_formGroupingId_fkey" FOREIGN KEY ("formGroupingId") REFERENCES "FormGrouping" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FormFieldOption" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fieldId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    CONSTRAINT "FormFieldOption_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "FormField" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FormSubmission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT,
    "formTemplateId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "formType" TEXT,
    "data" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "submittedAt" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    CONSTRAINT "FormSubmission_formTemplateId_fkey" FOREIGN KEY ("formTemplateId") REFERENCES "FormTemplate" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FormSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FormApproval" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "formSubmissionId" TEXT NOT NULL,
    "signedBy" TEXT,
    "submittedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "signature" TEXT,
    "comment" TEXT,
    CONSTRAINT "FormApproval_formSubmissionId_fkey" FOREIGN KEY ("formSubmissionId") REFERENCES "FormSubmission" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FormApproval_signedBy_fkey" FOREIGN KEY ("signedBy") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Jobsite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "qrId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'US',
    "comment" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "archiveDate" DATETIME,
    "companyId" TEXT,
    "Client" TEXT DEFAULT 'Streamline Precision LLC',
    CONSTRAINT "Jobsite_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TimeSheet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "jobsiteId" TEXT NOT NULL,
    "costcode" TEXT NOT NULL,
    "nu" TEXT NOT NULL DEFAULT 'nu',
    "Fp" TEXT NOT NULL DEFAULT 'fp',
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME,
    "comment" TEXT,
    "statusComment" TEXT,
    "location" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "workType" TEXT NOT NULL,
    "editedByUserId" TEXT,
    "newTimeSheetId" TEXT,
    "createdByAdmin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TimeSheet_costcode_fkey" FOREIGN KEY ("costcode") REFERENCES "CostCode" ("name") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TimeSheet_jobsiteId_fkey" FOREIGN KEY ("jobsiteId") REFERENCES "Jobsite" ("qrId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TimeSheet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MaintenanceLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "timeSheetId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "maintenanceId" TEXT NOT NULL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME,
    "comment" TEXT,
    CONSTRAINT "MaintenanceLog_maintenanceId_fkey" FOREIGN KEY ("maintenanceId") REFERENCES "Maintenance" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MaintenanceLog_timeSheetId_fkey" FOREIGN KEY ("timeSheetId") REFERENCES "TimeSheet" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MaintenanceLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Maintenance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "equipmentId" TEXT NOT NULL,
    "equipmentIssue" TEXT,
    "employeeEquipmentLogId" TEXT,
    "additionalInfo" TEXT,
    "location" TEXT,
    "problemDiagnosis" TEXT,
    "solution" TEXT,
    "totalHoursLaboured" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "priority" TEXT NOT NULL,
    "delay" DATETIME,
    "delayReasoning" TEXT,
    "repaired" BOOLEAN NOT NULL DEFAULT false,
    "selected" BOOLEAN NOT NULL DEFAULT false,
    "hasBeenDelayed" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT,
    CONSTRAINT "Maintenance_employeeEquipmentLogId_fkey" FOREIGN KEY ("employeeEquipmentLogId") REFERENCES "EmployeeEquipmentLog" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Maintenance_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TascoLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "timeSheetId" TEXT NOT NULL,
    "shiftType" TEXT NOT NULL,
    "equipmentId" TEXT,
    "laborType" TEXT,
    "materialType" TEXT,
    "LoadQuantity" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "TascoLog_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment" ("qrId") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "TascoLog_materialType_fkey" FOREIGN KEY ("materialType") REFERENCES "TascoMaterialTypes" ("name") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TascoLog_timeSheetId_fkey" FOREIGN KEY ("timeSheetId") REFERENCES "TimeSheet" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TascoMaterialTypes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "TruckingLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "timeSheetId" TEXT NOT NULL,
    "laborType" TEXT NOT NULL,
    "taskName" TEXT,
    "equipmentId" TEXT,
    "startingMileage" INTEGER,
    "endingMileage" INTEGER,
    "truckLaborLogId" TEXT,
    CONSTRAINT "TruckingLog_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment" ("qrId") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "TruckingLog_timeSheetId_fkey" FOREIGN KEY ("timeSheetId") REFERENCES "TimeSheet" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TruckLaborLogs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "truckingLogId" TEXT,
    "type" TEXT NOT NULL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME,
    CONSTRAINT "TruckLaborLogs_truckingLogId_fkey" FOREIGN KEY ("truckingLogId") REFERENCES "TruckingLog" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StateMileage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "truckingLogId" TEXT NOT NULL,
    "state" TEXT,
    "stateLineMileage" INTEGER,
    CONSTRAINT "StateMileage_truckingLogId_fkey" FOREIGN KEY ("truckingLogId") REFERENCES "TruckingLog" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Material" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "truckingLogId" TEXT NOT NULL,
    "LocationOfMaterial" TEXT,
    "name" TEXT,
    "quantity" INTEGER,
    "materialWeight" REAL,
    "lightWeight" REAL,
    "grossWeight" REAL,
    "loadType" TEXT,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Material_truckingLogId_fkey" FOREIGN KEY ("truckingLogId") REFERENCES "TruckingLog" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RefuelLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employeeEquipmentLogId" TEXT,
    "truckingLogId" TEXT,
    "tascoLogId" TEXT,
    "gallonsRefueled" REAL,
    "milesAtFueling" INTEGER,
    CONSTRAINT "RefuelLog_employeeEquipmentLogId_fkey" FOREIGN KEY ("employeeEquipmentLogId") REFERENCES "EmployeeEquipmentLog" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "RefuelLog_tascoLogId_fkey" FOREIGN KEY ("tascoLogId") REFERENCES "TascoLog" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "RefuelLog_truckingLogId_fkey" FOREIGN KEY ("truckingLogId") REFERENCES "TruckingLog" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "permission" TEXT NOT NULL DEFAULT 'USER',
    "image" TEXT,
    "startDate" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "terminationDate" DATETIME,
    "accountSetup" BOOLEAN NOT NULL DEFAULT false,
    "clockedIn" BOOLEAN NOT NULL DEFAULT false,
    "companyId" TEXT NOT NULL,
    "passwordResetTokenId" TEXT,
    "workTypeId" TEXT,
    CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "generalReminders" BOOLEAN NOT NULL DEFAULT false,
    "personalReminders" BOOLEAN NOT NULL DEFAULT false,
    "cameraAccess" BOOLEAN NOT NULL DEFAULT false,
    "locationAccess" BOOLEAN NOT NULL DEFAULT false,
    "cookiesAccess" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Contacts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employeeId" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "emergencyContact" TEXT,
    "emergencyContactNumber" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Contacts_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiration" DATETIME NOT NULL,
    CONSTRAINT "PasswordResetToken_email_fkey" FOREIGN KEY ("email") REFERENCES "User" ("email") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_CCTagToCostCode" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_CCTagToCostCode_A_fkey" FOREIGN KEY ("A") REFERENCES "CCTag" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CCTagToCostCode_B_fkey" FOREIGN KEY ("B") REFERENCES "CostCode" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_CCTagToJobsite" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_CCTagToJobsite_A_fkey" FOREIGN KEY ("A") REFERENCES "CCTag" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CCTagToJobsite_B_fkey" FOREIGN KEY ("B") REFERENCES "Jobsite" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_CrewToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_CrewToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Crew" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CrewToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_DocumentTagToEquipment" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_DocumentTagToEquipment_A_fkey" FOREIGN KEY ("A") REFERENCES "DocumentTag" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_DocumentTagToEquipment_B_fkey" FOREIGN KEY ("B") REFERENCES "Equipment" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_DocumentTagToPdfDocument" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_DocumentTagToPdfDocument_A_fkey" FOREIGN KEY ("A") REFERENCES "DocumentTag" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_DocumentTagToPdfDocument_B_fkey" FOREIGN KEY ("B") REFERENCES "PdfDocument" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_FormGroupingToFormTemplate" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_FormGroupingToFormTemplate_A_fkey" FOREIGN KEY ("A") REFERENCES "FormGrouping" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_FormGroupingToFormTemplate_B_fkey" FOREIGN KEY ("B") REFERENCES "FormTemplate" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "CostCode_name_key" ON "CostCode"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CCTag_name_key" ON "CCTag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PdfDocument_qrId_key" ON "PdfDocument"("qrId");

-- CreateIndex
CREATE INDEX "PdfDocument_qrId_idx" ON "PdfDocument"("qrId");

-- CreateIndex
CREATE INDEX "PdfDocument_fileName_idx" ON "PdfDocument"("fileName");

-- CreateIndex
CREATE UNIQUE INDEX "Equipment_qrId_key" ON "Equipment"("qrId");

-- CreateIndex
CREATE INDEX "Equipment_qrId_idx" ON "Equipment"("qrId");

-- CreateIndex
CREATE UNIQUE INDEX "CreationLogs_equipmentId_key" ON "CreationLogs"("equipmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Jobsite_qrId_key" ON "Jobsite"("qrId");

-- CreateIndex
CREATE INDEX "Jobsite_qrId_idx" ON "Jobsite"("qrId");

-- CreateIndex
CREATE UNIQUE INDEX "Jobsite_name_address_city_state_key" ON "Jobsite"("name", "address", "city", "state");

-- CreateIndex
CREATE UNIQUE INDEX "Maintenance_employeeEquipmentLogId_key" ON "Maintenance"("employeeEquipmentLogId");

-- CreateIndex
CREATE UNIQUE INDEX "TascoMaterialTypes_name_key" ON "TascoMaterialTypes"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_firstName_lastName_DOB_key" ON "User"("firstName", "lastName", "DOB");

-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_userId_key" ON "UserSettings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Contacts_employeeId_key" ON "Contacts"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_email_token_key" ON "PasswordResetToken"("email", "token");

-- CreateIndex
CREATE UNIQUE INDEX "_CCTagToCostCode_AB_unique" ON "_CCTagToCostCode"("A", "B");

-- CreateIndex
CREATE INDEX "_CCTagToCostCode_B_index" ON "_CCTagToCostCode"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CCTagToJobsite_AB_unique" ON "_CCTagToJobsite"("A", "B");

-- CreateIndex
CREATE INDEX "_CCTagToJobsite_B_index" ON "_CCTagToJobsite"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CrewToUser_AB_unique" ON "_CrewToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_CrewToUser_B_index" ON "_CrewToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DocumentTagToEquipment_AB_unique" ON "_DocumentTagToEquipment"("A", "B");

-- CreateIndex
CREATE INDEX "_DocumentTagToEquipment_B_index" ON "_DocumentTagToEquipment"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DocumentTagToPdfDocument_AB_unique" ON "_DocumentTagToPdfDocument"("A", "B");

-- CreateIndex
CREATE INDEX "_DocumentTagToPdfDocument_B_index" ON "_DocumentTagToPdfDocument"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FormGroupingToFormTemplate_AB_unique" ON "_FormGroupingToFormTemplate"("A", "B");

-- CreateIndex
CREATE INDEX "_FormGroupingToFormTemplate_B_index" ON "_FormGroupingToFormTemplate"("B");
