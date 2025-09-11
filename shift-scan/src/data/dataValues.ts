import { FieldType, Prisma } from "../../prisma/generated/prisma/client";

export const now = new Date();

// Helper function to format field names (snake_case)
function formatName(label: string): string {
  return label.toLowerCase().replace(/\s+/g, "_");
}
/* Addresses */
export const initialAddresses: Prisma.AddressCreateInput[] = [
  {
    id: "1",
    street: "120 S 100 W",
    city: "Burley",
    state: "ID",
    zipCode: "83318",
    country: "US",
  },
];

/* COMPANY */
export const initialCompany: Prisma.CompanyCreateInput[] = [
  {
    id: "1",
    name: "Streamline Precision LLC",
    Address: { connect: { id: "1" } },
    Users: { connect: [] },
  },
];

/* FORM TEMPLATES */
export const initialFormTemplates: Prisma.FormTemplateCreateInput[] = [
  {
    id: "ft1",
    name: "Leave Request Form",
    formType: "GENERAL",
    isSignatureRequired: true,
    Company: { connect: { id: "1" } },
    FormGrouping: {
      create: [
        {
          title: "",
          order: 1,
          Fields: {
            create: [
              {
                label: "Request Start Date",
                type: FieldType.DATE,
                required: true,
                order: 1,
              },
              {
                label: "Request End Date",
                type: FieldType.DATE,
                required: true,
                order: 2,
              },
              {
                label: "Request Type",
                type: FieldType.DROPDOWN,
                required: true,
                order: 3,
                Options: {
                  create: [
                    { value: "Paid Vacation" },
                    { value: "Sick Leave" },
                    { value: "Military Leave" },
                    { value: "Family Medical Leave" },
                    { value: "Non-Paid Personal Leave" },
                  ],
                },
              },
              {
                label: "Comments",
                type: FieldType.TEXTAREA,
                required: false,
                order: 4,
                placeholder: "Enter comments here...",
              },
            ],
          },
        },
      ],
    },
  },

  // {
  //   name: "Injury Report Form",
  //   formType: "INCIDENT",
  //   isSignatureRequired: true,
  //   Company: { connect: { id: "1" } },
  //   FormGrouping: {
  //     create: [
  //       {
  //         title: "",
  //         order: 1,
  //         Fields: {
  //           create: [
  //             {
  //               label: "Describe the Injury",
  //               type: FieldType.TEXTAREA,
  //               required: true,
  //               order: 1,
  //               placeholder: "Enter details here",
  //             },
  //             {
  //               label: "I contacted My Supervisor",
  //               type: FieldType.CHECKBOX,
  //               required: true,
  //               order: 2,
  //             },
  //             {
  //               label: "This is my signature",
  //               type: FieldType.CHECKBOX,
  //               required: true,
  //               order: 3,
  //             },
  //           ],
  //         },
  //       },
  //     ],
  //   },
  // },
];

/* JOBSITES */
// export const initialJobsites: Prisma.JobsiteCreateInput[] = [
//   {
//     id: "1",
//     qrId: "j123",
//     name: "Jobsite 1",
//     description: "Description for Jobsite 1",
//     Address: { connect: { id: "1" } },
//     comment: "Comments for Jobsite 1",
//     Client: { connect: { id: "client1" } },
//     TimeSheets: { connect: [] },
//     CCTags: { connect: [] },
//     EquipmentHauled: { connect: [] },
//   },
//   {
//     id: "2",
//     qrId: "j234",
//     name: "Jobsite 2",
//     description: "Description for Jobsite 2",
//     Address: { connect: { id: "2" } },
//     comment: "Comments for Jobsite 2",
//     Client: { connect: { id: "client1" } },
//     TimeSheets: { connect: [] },
//     CCTags: { connect: [] },
//     EquipmentHauled: { connect: [] },
//   },
//   {
//     qrId: "j345",
//     name: "Jobsite 3",
//     description: "Description for Jobsite 3",
//     Address: { connect: { id: "3" } },
//     comment: "Comments for Jobsite 3",
//     Client: { connect: { id: "client1" } },
//     TimeSheets: { connect: [] },
//     CCTags: { connect: [] },
//     EquipmentHauled: { connect: [] },
//   },
//   {
//     qrId: "j456",
//     name: "Jobsite 4",
//     description: "Description for Jobsite 4",
//     Address: { connect: { id: "4" } },
//     comment: "Comments for Jobsite 4",
//     Client: { connect: { id: "client1" } },
//     TimeSheets: { connect: [] },
//     CCTags: { connect: [] },
//     EquipmentHauled: { connect: [] },
//   },
//   {
//     qrId: "j567",
//     name: "Jobsite 5",
//     description: "Description for Jobsite 5",
//     Address: { connect: { id: "5" } },
//     comment: "Comments for Jobsite 5",
//     Client: { connect: { id: "client1" } },
//     TimeSheets: { connect: [] },
//     CCTags: { connect: [] },
//     EquipmentHauled: { connect: [] },
//   },
// {
//   qrId: "TASCO",
//   name: "Tasco Jobsite",
//   description: "Tasco Jobsite",
//   Address: { connect: { id: "6" } },
//   comment: "Comments for Jobsite 1",
//   Client: { connect: { id: "client2" } },
//   TimeSheets: { connect: [] },
//   CCTags: { connect: [] },
//   EquipmentHauled: { connect: [] },
// },
// {
//   qrId: "MECHANIC",
//   name: "Mechanic Jobsite",
//   description: "Mechanic Jobsite",
//   Address: { connect: { id: "7" } },
//   comment: "Comments for Jobsite 2",
//   Client: { connect: { id: "client2" } },
//   TimeSheets: { connect: [] },
//   CCTags: { connect: [] },
//   EquipmentHauled: { connect: [] },
// },
// {
//   qrId: "TRUCK",
//   name: "Truck Jobsite",
//   description: "Truck Jobsite",
//   Address: { connect: { id: "8" } },
//   comment: "Comments for Jobsite 3",
//   Client: { connect: { id: "client2" } },
//   TimeSheets: { connect: [] },
//   CCTags: { connect: [] },
//   EquipmentHauled: { connect: [] },
// },
// ];

/* CREWS */
export const initialCrews: Prisma.CrewCreateInput[] = [
  // {
  //   name: "Sean's Crew",
  //   leadId: "9",
  //   crewType: "LABOR",
  //   Users: { connect: [{ id: "9" }, { id: "2" }, { id: "3" }, { id: "7" }] },
  // },
  {
    name: "Devun's Crew",
    leadId: "7",
    crewType: "LABOR",
    Users: { connect: [{ id: "7" }, { id: "8" }, { id: "9" }] },
  },
];

// /* CLIENTS */
// export const initialClients: Prisma.ClientCreateInput[] = [
//   {
//     id: "client1",
//     name: "ABC Construction",
//     description: "Primary construction client",
//     Address: { connect: { id: "9" } },
//     contactPhone: "555-555-0101",
//     contactEmail: "contact@abcconstruction.com",
//     contactPerson: "John Smith",
//     Company: { connect: { id: "1" } },
//   },
//   {
//     id: "client2",
//     name: "Tasco Industries",
//     description: "Secondary industrial client",
//     Address: { connect: { id: "10" } },
//     contactPhone: "555-555-0202",
//     contactEmail: "contact@tascoindustries.com",
//     contactPerson: "Jane Johnson",
//     Company: { connect: { id: "1" } },
//   },
// ];

/* USERS */
export const initialUsers: Prisma.UserCreateInput[] = [
  {
    id: "7",
    firstName: "Devun",
    lastName: "Durst",
    username: "devunfox",
    email: "devunfox15@gmail.com",
    password: "securepassword",
    DOB: new Date("1999-07-08").toISOString(),
    truckView: true,
    tascoView: true,
    laborView: true,
    mechanicView: true,
    permission: "SUPERADMIN",
    image: "",
    Company: { connect: { id: "1" } },
    Contact: {
      create: {
        phoneNumber: "987-654-3210",
        emergencyContact: "your wife",
        emergencyContactNumber: "218-765-4311",
        createdAt: now,
        updatedAt: now,
      },
    },
  },
  {
    id: "8",
    firstName: "Zachary",
    lastName: "Robker",
    username: "zrobker",
    email: "test08@gmail.com",
    password: "securepassword",
    DOB: new Date("1996-12-22").toISOString(),
    truckView: true,
    tascoView: true,
    laborView: true,
    mechanicView: true,
    permission: "SUPERADMIN",
    image: "",
    Company: { connect: { id: "1" } },
    Contact: {
      create: {
        phoneNumber: "987-654-3210",
        emergencyContact: "your wife",
        emergencyContactNumber: "218-765-4311",
        createdAt: now,
        updatedAt: now,
      },
    },
  },
  {
    id: "9",
    firstName: "Sean",
    lastName: "walker",
    username: "seanwalk",
    email: "test09@gmail.com",
    password: "securepassword",
    DOB: new Date("2000-06-15").toISOString(),
    truckView: true,
    tascoView: true,
    laborView: true,
    mechanicView: true,
    permission: "SUPERADMIN",
    image: "",
    Company: { connect: { id: "1" } },
    Contact: {
      create: {
        phoneNumber: "987-654-3210",
        emergencyContact: "your wife",
        emergencyContactNumber: "218-765-4311",
        createdAt: now,
        updatedAt: now,
      },
    },
  },
  {
    id: "12",
    firstName: "Zane",
    lastName: "Gillette",
    username: "zanegillette",
    email: "zane@streamlineprecision.com",
    password: "securepassword",
    DOB: null,
    truckView: true,
    tascoView: true,
    laborView: true,
    mechanicView: true,
    permission: "SUPERADMIN",
    image: "",
    Company: { connect: { id: "1" } },
    Contact: {
      create: {
        phoneNumber: "",
        emergencyContact: "",
        emergencyContactNumber: "",
        createdAt: now,
        updatedAt: now,
      },
    },
  },
];

/* COST CODES */
export const initialCostCodes: Prisma.CostCodeCreateInput[] = [
  {
    id: "1",
    name: "#01.20 Engineering Labor",
    CCTags: { connect: [] },
  },
  {
    id: "2",
    name: "#02.20 Earth Labor",
    CCTags: { connect: [] },
  },
  {
    id: "3",
    name: "#03.20 Concrete Labor",
    CCTags: { connect: [] },
  },
  {
    id: "4",
    name: "#04.20 Finishes Labor",
    CCTags: { connect: [] },
  },
  {
    id: "5",
    name: "#05.20 Steel Labor",
    CCTags: { connect: [] },
  },
  {
    id: "6",
    name: "#06.20 Wood Labor",
    CCTags: { connect: [] },
  },
  {
    id: "7",
    name: "#07.20 Insulation Labor",
    CCTags: { connect: [] },
  },
  {
    id: "8",
    name: "#08.20 Door and Window labor",
    CCTags: { connect: [] },
  },
  {
    id: "9",
    name: "#09.20 Utilities Labor",
    CCTags: { connect: [] },
  },
  {
    id: "10",
    name: "#10.20 Process Labor",
    CCTags: { connect: [] },
  },
  {
    id: "11",
    name: "#11.20 Shop Labor",
    CCTags: { connect: [] },
  },
  {
    id: "12",
    name: "#12.20 Pipe Labor",
    CCTags: { connect: [] },
  },
  {
    id: "13",
    name: "#13.20 Trucking Labor",
    CCTags: { connect: [] },
  },
  {
    id: "14",
    name: "#00.50 Mechanics",
    CCTags: { connect: [] },
  },
  {
    id: "15",
    name: "#99.99 General Office",
    CCTags: { connect: [] },
  },
  {
    id: "16",
    name: "#80.20 Amalgamated Labor",
    CCTags: { connect: [] },
  },
  {
    id: "17",
    name: "#80.40 Amalgamated Equipment",
    CCTags: { connect: [] },
  },
  {
    id: "18",
    name: "#1000 Gillette Farms",
    CCTags: { connect: [] },
  },
  {
    id: "19",
    name: "#1001 Chicken Barn",
    CCTags: { connect: [] },
  },
];

/* CC TAGS */
export const initialCCTags: Prisma.CCTagCreateInput[] = [
  {
    name: "All",
    Jobsites: {
      connect: [
        { qrId: "j123" },
        { qrId: "j234" },
        { qrId: "j345" },
        { qrId: "j456" },
        { qrId: "j567" },
      ],
    },
    CostCodes: {
      connect: Array.from({ length: 19 }, (_, i) => ({
        id: (i + 1).toString(),
      })),
    },
  },
];

// /* DOCUMENT TAGS (new) */
// export const initialDocumentTags: Prisma.DocumentTagCreateInput[] = [
//   {
//     id: "dt1",
//     tagName: "General",
//   },
//   {
//     id: "dt2",
//     tagName: "Policies",
//   },
//   {
//     id: "dt3",
//     tagName: "SPOs",
//   },
//   {
//     id: "dt4",
//     tagName: "Documents",
//   },
// ];

// const validMinimalPdf = Buffer.from(
//   `%PDF-1.4
//   1 0 obj
//   << /Type /Catalog /Pages 2 0 R >>
//   endobj
//   2 0 obj
//   << /Type /Pages /Count 1 /Kids [3 0 R] >>
//   endobj
//   3 0 obj
//   << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>
//   endobj
//   4 0 obj
//   << /Length 44 >>
//   stream
//   BT /F1 24 Tf 100 700 Td (Hello World) Tj ET
//   endstream
//   endobj
//   xref
//   0 5
//   0000000000 65535 f
//   0000000010 00000 n
//   0000000061 00000 n
//   0000000112 00000 n
//   0000000217 00000 n
//   trailer
//   << /Root 1 0 R /Size 5 >>
//   startxref
//   322
//   %%EOF`
// );

// /* PDF DOCUMENTS (new) */
// export const initialPdfDocuments: Prisma.PdfDocumentCreateInput[] = [
//   {
//     qrId: "pdf2",
//     fileName: "company_policy.pdf",
//     description: "Company policy PDF",
//     fileData: new Uint8Array(validMinimalPdf),
//     contentType: "application/pdf",
//     size: validMinimalPdf.length,
//     DocumentTags: { connect: [{ id: "dt2" }] },
//   },
//   {
//     qrId: "pdf3",
//     fileName: "spo_guideline.pdf",
//     description: "Standard Procedure Operations guide",
//     fileData: new Uint8Array(validMinimalPdf),
//     contentType: "application/pdf",
//     size: validMinimalPdf.length,
//     DocumentTags: { connect: [{ id: "dt3" }] },
//   },
//   {
//     qrId: "pdf4",
//     fileName: "internal_doc.pdf",
//     description: "Internal documentation",
//     fileData: new Uint8Array(validMinimalPdf),
//     contentType: "application/pdf",
//     size: validMinimalPdf.length,
//     DocumentTags: { connect: [{ id: "dt4" }] },
//   },
//   {
//     qrId: "pdf5",
//     fileName: "inactive_doc.pdf",
//     description: "Archived or inactive PDF",
//     fileData: new Uint8Array(validMinimalPdf),
//     contentType: "application/pdf",
//     size: validMinimalPdf.length,
//     isActive: false,
//     DocumentTags: { connect: [{ id: "dt4" }] },
//   },
// ];

/* UPDATED EQUIPMENT */
/* 
   For each TRUCK entry, we remove the removed fields (lastInspection, lastRepair, etc.)
   and add nested equipmentVehicleInfo. For EQUIPMENT, TRAILER, or VEHICLE entries we remove those fields.
*/

/* USER SETTINGS */
export const initialUserSettings: Prisma.UserSettingsCreateInput[] = [
  // { User: { connect: { id: "1" } } },
  // { User: { connect: { id: "2" } } },
  // { User: { connect: { id: "3" } } },
  // { User: { connect: { id: "4" } } },
  // { User: { connect: { id: "5" } } },
  // { User: { connect: { id: "6" } } },
  { User: { connect: { id: "7" } } },
  { User: { connect: { id: "8" } } },
  { User: { connect: { id: "9" } } },
  // { User: { connect: { id: "10" } } },
  // { User: { connect: { id: "11" } } },
  { User: { connect: { id: "12" } } },
];

/* EMPLOYEE EQUIPMENT LOGS */
// export const initialEmployeeEquipmentLogs: Prisma.EmployeeEquipmentLogCreateInput[] =
//   [
//     {
//       Equipment: { connect: { id: "eq1" } },
//       startTime: new Date(now.getTime() - 3600000),
//       endTime: new Date(),
//       comment: "Equipment log test entry",
//       TimeSheet: { connect: { id: "ts1" } },
//     },
//   ];

/* EQUIPMENT HAULED */
// export const initialEquipmentHauled: Prisma.EquipmentHauledCreateInput[] = [
//   {
//     TruckingLog: { connect: { id: "tl1" } },
//     Equipment: { connect: { id: "eq2" } },
//     JobSite: { connect: { id: "2" } },
//   },
// ];

/* ERRORS */
// export const initialErrors: Prisma.ErrorCreateInput[] = [
//   {
//     errorMessage: "Test error message",
//     userId: "1",
//     fileLocation: "/path/to/file",
//   },
// ];

/* FORM SUBMISSIONS */
// export const initialFormSubmissions: Prisma.FormSubmissionCreateInput[] = [
//   {
//     id: "fs1",
//     title: "Test Submission",
//     FormTemplate: { connect: { id: "ft1" } },
//     User: { connect: { id: "1" } },
//     formType: "GENERAL",
//     data: {},
//     submittedAt: new Date(),
//     status: FormStatus.APPROVED,
//   },
// ];

/* FORM APPROVALS */
// export const initialFormApprovals: Prisma.FormApprovalCreateInput[] = [
//   {
//     FormSubmission: { connect: { id: "fs1" } },
//     Approver: { connect: { id: "2" } },
//     signature: "SampleSignatureString",
//     comment: "Approved after review",
//   },
// ];

/* TIME SHEETS */
// export const initialTimeSheets: Prisma.TimeSheetCreateInput[] = [
//   // --- Test data for hour viewer: 14 days of timesheets with varied hours ---
//   ...Array.from({ length: 14 }).map((_, i) => {
//     const day = new Date();
//     day.setHours(8, 0, 0, 0);
//     day.setDate(day.getDate() - (13 - i));
//     const startTime = new Date(day);
//     // Random hours between 6 and 12
//     const hoursWorked = Math.floor(Math.random() * 7) + 6; // 6 to 12 inclusive
//     const endTime = new Date(day);
//     endTime.setHours(8 + hoursWorked, 0, 0, 0);
//     return {
//       id: `ts_test_${i + 1}`,
//       date: new Date(day),
//       User: { connect: { id: "8" } },
//       Jobsite: { connect: { qrId: "j123" } },
//       CostCode: { connect: { name: "#01.20 Engineering Labor" } },
//       nu: "nu",
//       Fp: "fp",
//       startTime,
//       endTime,
//       comment: `Timesheet test entry for ${day
//         .toISOString()
//         .slice(0, 10)} (${hoursWorked} hrs)`,
//       statusComment: "Approved by manager",
//       location: "Site A",
//       status: FormStatus.APPROVED,
//       workType: WorkType.LABOR,
//       createdByAdmin: false,
//       createdAt: new Date(day),
//     };
//   }),
//   {
//     id: "ts1",
//     date: new Date(),
//     User: { connect: { id: "1" } },
//     Jobsite: { connect: { qrId: "j123" } },
//     CostCode: { connect: { name: "#01.20 Engineering Labor" } },
//     nu: "nu",
//     Fp: "fp",
//     startTime: new Date(now.getTime() - 7200000),
//     endTime: new Date(),
//     comment: "Timesheet test entry",
//     statusComment: "Approved by manager",
//     location: "Site A",
//     status: FormStatus.APPROVED,
//     workType: WorkType.LABOR,
//     createdByAdmin: false,
//     createdAt: new Date(),
//   },
//   {
//     id: "ts2",
//     date: new Date(),
//     User: { connect: { id: "1" } },
//     Jobsite: { connect: { qrId: "j123" } },
//     CostCode: { connect: { name: "#01.20 Engineering Labor" } },
//     nu: "nu",
//     Fp: "fp",
//     startTime: new Date(now.getTime() - 7200000),
//     endTime: new Date(),
//     comment: "Timesheet test entry",
//     statusComment: "Approved by manager",
//     location: "Site A",
//     status: FormStatus.APPROVED,
//     workType: WorkType.LABOR,
//     createdByAdmin: false,
//     createdAt: new Date(),
//   },
//   {
//     id: "ts3",
//     date: new Date(),
//     User: { connect: { id: "8" } },
//     Jobsite: { connect: { qrId: "j123" } },
//     CostCode: { connect: { name: "#01.20 Engineering Labor" } },
//     nu: "nu",
//     Fp: "fp",
//     startTime: new Date(now.getTime() - 7200000),
//     endTime: new Date(),
//     comment: "Timesheet test entry",
//     statusComment: "Approved by manager",
//     location: "Site A",
//     status: FormStatus.APPROVED,
//     workType: WorkType.LABOR,
//     createdByAdmin: false,
//     createdAt: new Date(),
//   },
// ];

/* MAINTENANCE LOGS */
// export const initialMaintenanceLogs: Prisma.MaintenanceLogCreateInput[] = [
//   {
//     TimeSheet: { connect: { id: "ts1" } },
//     User: { connect: { id: "1" } },
//     Maintenance: { connect: { id: "m1" } },
//     startTime: new Date(now.getTime() - 5400000),
//     endTime: new Date(),
//     comment: "Maintenance log test entry",
//   },
// ];

/* MAINTENANCES */
// export const initialMaintenances: Prisma.MaintenanceCreateInput[] = [
//   {
//     id: "m1",
//     Equipment: { connect: { id: "eq3" } },
//     equipmentIssue: "Oil leak detected",
//     additionalInfo: "Requires urgent repair",
//     location: "Main Garage",
//     problemDiagnosis: "Worn gasket",
//     solution: "Replace gasket",
//     totalHoursLaboured: 2,
//     priority: Priority.HIGH,
//     delay: new Date(now.getTime() + 3600000),
//     delayReasoning: "Awaiting parts",
//     repaired: false,
//     selected: false,
//     hasBeenDelayed: true,
//     createdBy: "1",
//   },
// ];

/* TASCO MATERIAL TYPES */
export const initialTascoMaterialTypes: Prisma.TascoMaterialTypesCreateInput[] =
  [
    { name: "Rock" },
    { name: "Elimco" },
    { name: "Coal" },
    { name: "Lime Kiln" },
    { name: "Ag Waste" },
    { name: "Belt Mud" },
    { name: "End Of Campaign Clean Up" },
  ];

// /* TRUCKING LOGS */
// export const initialTruckingLogs: Prisma.TruckingLogCreateInput[] = [
//   {
//     id: "tl1",
//     TimeSheet: { connect: { id: "ts1" } },
//     laborType: "TRUCK_DRIVER",
//     taskName: "Deliver Material",
//     Equipment: { connect: { qrId: "TRK-007 Kenworth W900" } },
//     startingMileage: 1000,
//     endingMileage: 1200,
//   },
// ];

/* MATERIALS */
// export const initialMaterials: Prisma.MaterialCreateInput[] = [
//   {
//     LocationOfMaterial: "Warehouse A",
//     TruckingLog: { connect: { id: "tl1" } },
//     name: "Concrete",
//     quantity: 5,
//     loadType: LoadType.SCREENED,
//     materialWeight: 2.0,
//     unit: "TONS",
//   },
//   {
//     LocationOfMaterial: "Supplier B",
//     TruckingLog: { connect: { id: "tl1" } },
//     name: "Gravel",
//     quantity: 3,
//     loadType: LoadType.UNSCREENED,
//     materialWeight: 5.4,
//     unit: "TONS",
//   },
// ];

/* REFUEL LOGS */
// export const initialRefueled: Prisma.RefuelLogCreateInput[] = [
//   {
//     TruckingLog: { connect: { id: "tl1" } },
//     gallonsRefueled: 50,
//     milesAtFueling: 1200,
//   },
//   {
//     TascoLog: { connect: { id: "tlTasco1" } },
//     gallonsRefueled: 20,
//   },
// ];

/* STATE MILEAGE */
// export const initialStateMileage: Prisma.StateMileageCreateInput[] = [
//   {
//     TruckingLog: { connect: { id: "tl1" } },
//     state: "ID",
//     stateLineMileage: 100,
//   },
//   {
//     TruckingLog: { connect: { id: "tl1" } },
//     state: "UT",
//     stateLineMileage: 200,
//   },
// ];

/* TASCO LOGS */
// export const initialTascoLogs: Prisma.TascoLogCreateInput[] = [
//   {
//     id: "tlTasco1",
//     TimeSheet: { connect: { id: "ts1" } },
//     shiftType: "Loading",
//     Equipment: { connect: { qrId: "TRK-007 Kenworth W900" } },
//     laborType: "Manual Labor",
//     LoadQuantity: 10,
//   },
//   {
//     TimeSheet: { connect: { id: "ts2" } },
//     shiftType: "Unloading",
//     Equipment: { connect: { qrId: "TRK-9" } },
//     laborType: "Truck Driver",
//     LoadQuantity: 5,
//   },
// ];
