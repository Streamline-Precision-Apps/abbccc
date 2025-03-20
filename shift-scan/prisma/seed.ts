import { PrismaClient } from "@prisma/client";
import {
  initialCompany,
  initialFormTemplates,
  initialUsers,
  initialContacts,
  initialJobsites,
  initialCostCodes,
  initialCCTags,
  intialEquipment,
  initialCrews,
  initialUserSettings,
  initialTimeSheets,
  initialTruckingLogs,
  initialEmployeeEquipmentLogs,
  initialEquipmentHauled,
  initialErrors,
  initialFormSubmissions,
  initialFormApprovals,
  initialMaintenances,
  initialMaintenanceLogs,
  initialTascoMaterialTypes,
  initialTascoLogs,
  initialMaterials,
  initialRefueled,
  initialStateMileage,
  initialWorkTypes,
} from "@/data/dataValues";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding...");

  try {
    // 1. Insert Companies
    for (const company of initialCompany) {
      try {
        const newCompany = await prisma.company.create({ data: company });
        console.log("Created company with id:", newCompany.id);
      } catch (error) {
        console.log("Error creating company:", error);
        continue;
      }
    }

    // 2. Insert Form Templates (make sure one has id "ft1")
    for (const formTemplate of initialFormTemplates) {
      try {
        const newTemplate = await prisma.formTemplate.create({ data: formTemplate });
        console.log("Created form template with id:", newTemplate.id);
      } catch (error) {
        console.log("Error creating form template:", error);
        continue;
      }
    }

    // 3. Insert Users
    for (const user of initialUsers) {
      try {
        const newUser = await prisma.user.create({ data: user });
        console.log("Created user with id:", newUser.id);
      } catch (error) {
        console.log("Error creating user:", error);
        continue;
      }
    }

    // 4. Insert Contacts
    for (const contact of initialContacts) {
      try {
        const newContact = await prisma.contacts.create({ data: contact });
        console.log("Created contact with id:", newContact.id);
      } catch (error) {
        console.log("Error creating contact:", error);
        continue;
      }
    }

    // 5. Insert Jobsites
    for (const jobsite of initialJobsites) {
      try {
        const newJobsite = await prisma.jobsite.create({ data: jobsite });
        console.log("Created jobsite with id:", newJobsite.id);
      } catch (error) {
        console.log("Error creating jobsite:", error);
        continue;
      }
    }

    // 6. Insert Cost Codes
    for (const costCode of initialCostCodes) {
      try {
        const newCostCode = await prisma.costCode.create({ data: costCode });
        console.log("Created cost code with id:", newCostCode.id);
      } catch (error) {
        console.log("Error creating cost code:", error);
        continue;
      }
    }

    // 7. Insert CCTags
    for (const cctag of initialCCTags) {
      try {
        const newCCTag = await prisma.cCTag.create({ data: cctag });
        console.log("Created CCTag with id:", newCCTag.id);
      } catch (error) {
        console.log("Error creating CCTag:", error);
        continue;
      }
    }

    // 8. Insert Equipment (ensure equipment with ids "eq1", "eq2", "eq3" exist)
    for (const equip of intialEquipment) {
      try {
        const newEquipment = await prisma.equipment.create({ data: equip });
        console.log("Created equipment with id:", newEquipment.id);
      } catch (error) {
        console.log("Error creating equipment:", error);
        continue;
      }
    }

    // 9. Insert Crews
    for (const crew of initialCrews) {
      try {
        const newCrew = await prisma.crew.create({ data: crew });
        console.log("Created crew with id:", newCrew.id);
      } catch (error) {
        console.log("Error creating crew:", error);
        continue;
      }
    }

    // 10. Insert User Settings
    for (const settings of initialUserSettings) {
      try {
        const newSettings = await prisma.userSettings.create({ data: settings });
        console.log("Created user settings with id:", newSettings.id);
      } catch (error) {
        console.log("Error creating user settings:", error);
        continue;
      }
    }

    // 11. Insert TimeSheets (ensure one has id "ts1")
    for (const timesheet of initialTimeSheets) {
      try {
        const newTimeSheet = await prisma.timeSheet.create({ data: timesheet });
        console.log("Created timesheet with id:", newTimeSheet.id);
      } catch (error) {
        console.log("Error creating timesheet:", error);
        continue;
      }
    }

    // 12. Insert Trucking Logs (ensure one has id "tl1" and connects to timesheet "ts1")
    for (const truckingLog of initialTruckingLogs) {
      try {
        const newTruckingLog = await prisma.truckingLog.create({ data: truckingLog });
        console.log("Created trucking log with id:", newTruckingLog.id);
      } catch (error) {
        console.log("Error creating trucking log:", error);
        continue;
      }
    }

    // 13. Insert Employee Equipment Logs
    for (const log of initialEmployeeEquipmentLogs) {
      try {
        const newLog = await prisma.employeeEquipmentLog.create({ data: log });
        console.log("Created employee equipment log with id:", newLog.id);
      } catch (error) {
        console.log("Error creating employee equipment log:", error);
        continue;
      }
    }

    // 14. Insert Equipment Hauled (ensure the connected Equipment record exists)
    for (const equipmentHauled of initialEquipmentHauled) {
      try {
        const newEquipmentHauled = await prisma.equipmentHauled.create({ data: equipmentHauled });
        console.log("Created equipment hauled with id:", newEquipmentHauled.id);
      } catch (error) {
        console.log("Error creating equipment hauled:", error);
        continue;
      }
    }

    // 15. Insert Errors
    for (const errorRecord of initialErrors) {
      try {
        const newError = await prisma.error.create({ data: errorRecord });
        console.log("Created error with id:", newError.id);
      } catch (error) {
        console.log("Error creating error record:", error);
        continue;
      }
    }

    // 16. Insert Form Submissions (ensure one has id "fs1" and connects to Form Template "ft1")
    for (const submission of initialFormSubmissions) {
      try {
        const newSubmission = await prisma.formSubmission.create({ data: submission });
        console.log("Created form submission with id:", newSubmission.id);
      } catch (error) {
        console.log("Error creating form submission:", error);
        continue;
      }
    }

    // 17. Insert Form Approvals (connects to Form Submission "fs1")
    for (const approval of initialFormApprovals) {
      try {
        const newApproval = await prisma.formApproval.create({ data: approval });
        console.log("Created form approval with id:", newApproval.id);
      } catch (error) {
        console.log("Error creating form approval:", error);
        continue;
      }
    }

    // 18. Insert Maintenances (ensure one has id "m1" and connects to Equipment "eq3")
    for (const maintenance of initialMaintenances) {
      try {
        const newMaintenance = await prisma.maintenance.create({ data: maintenance });
        console.log("Created maintenance with id:", newMaintenance.id);
      } catch (error) {
        console.log("Error creating maintenance:", error);
        continue;
      }
    }

    // 19. Insert Maintenance Logs (connects to Maintenance "m1")
    for (const maintenanceLog of initialMaintenanceLogs) {
      try {
        const newMaintenanceLog = await prisma.maintenanceLog.create({ data: maintenanceLog });
        console.log("Created maintenance log with id:", newMaintenanceLog.id);
      } catch (error) {
        console.log("Error creating maintenance log:", error);
        continue;
      }
    }

    // 20. Insert Tasco Material Types
    for (const tascoType of initialTascoMaterialTypes) {
      try {
        const newTascoType = await prisma.tascoMaterialTypes.create({ data: tascoType });
        console.log("Created Tasco Material Type with id:", newTascoType.id);
      } catch (error) {
        console.log("Error creating Tasco Material Type:", error);
        continue;
      }
    }

    // 21. Insert Tasco Logs (connects to an existing TimeSheet and Equipment)
    for (const tascoLog of initialTascoLogs) {
      try {
        const newTascoLog = await prisma.tascoLog.create({ data: tascoLog });
        console.log("Created Tasco log with id:", newTascoLog.id);
      } catch (error) {
        console.log("Error creating Tasco log:", error);
        continue;
      }
    }

    // 22. Insert Materials (associated with a TruckingLog)
    for (const material of initialMaterials) {
      try {
        const newMaterial = await prisma.material.create({ data: material });
        console.log("Created material with id:", newMaterial.id);
      } catch (error) {
        console.log("Error creating material:", error);
        continue;
      }
    }

    // 23. Insert Refueled records (associated with a TruckingLog or TascoLog)
    for (const refuel of initialRefueled) {
      try {
        const newRefuel = await prisma.refueled.create({ data: refuel });
        console.log("Created refueled record with id:", newRefuel.id);
      } catch (error) {
        console.log("Error creating refueled record:", error);
        continue;
      }
    }

    // 24. Insert State Mileage (associated with a TruckingLog)
    for (const stateMileage of initialStateMileage) {
      try {
        const newStateMileage = await prisma.stateMileage.create({ data: stateMileage });
        console.log("Created state mileage with id:", newStateMileage.id);
      } catch (error) {
        console.log("Error creating state mileage:", error);
        continue;
      }
    }

    // 25. Insert Work Types
    for (const workType of initialWorkTypes) {
      try {
        const newWorkType = await prisma.workTypes.create({ data: workType });
        console.log("Created work type with id:", newWorkType.id);
      } catch (error) {
        console.log("Error creating work type:", error);
        continue;
      }
    }

    console.log("Sample data upserted successfully!");
  } catch (error) {
    console.log("An error occurred during seeding:", error);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
