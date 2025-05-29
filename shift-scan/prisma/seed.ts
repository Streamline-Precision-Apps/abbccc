import { PrismaClient } from "@prisma/client";
import {
  initialCompany,
  initialFormTemplates,
  initialUsers,
  initialContacts,
  initialJobsites,
  initialCostCodes,
  initialCCTags,
  updatedEquipment, // updated equipment seed values from dataValues.ts
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
  // New seed arrays for the new models:
  initialDocumentTags,
  initialPdfDocuments,
  initialCreationLogs
} from "@/data/dataValues";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding...");

  try {
    // 1. Upsert Companies
    for (const company of initialCompany) {
      try {
        const upsertedCompany = await prisma.company.upsert({
          where: { id: company.id },
          update: company,
          create: company,
        });
        console.log('Upserted company with id:', upsertedCompany.id);
      } catch (error) {
        console.log('Error upserting company:', error);
        continue;
      }
    }

    // 2. Insert Form Templates
    for (const formTemplate of initialFormTemplates) {
      try {
        const newTemplate = await prisma.formTemplate.create({ data: formTemplate });
        console.log('Created form template with id:', newTemplate.id);
      } catch (error) {
        console.log('Error creating form template:', error);
        continue;
      }
    }

    // 3. Upsert Users
    for (const user of initialUsers) {
      try {
        const upsertedUser = await prisma.user.upsert({
          where: { id: user.id },
          update: user,
          create: user,
        });
        console.log('Upserted user with id:', upsertedUser.id);
      } catch (error) {
        console.log('Error upserting user:', error);
        continue;
      }
    }

    // 3.5. Upsert Contacts
    for (const contact of initialContacts) {
      const userId = contact.User?.connect?.id;
      if (!userId) {
        console.log('Skipping contact: missing userId');
        continue;
      }
      try {
        const upsertedContact = await prisma.contacts.upsert({
          where: { userId },
          update: contact,
          create: contact,
        });
        console.log('Upserted contact for user id:', userId);
      } catch (error) {
        console.log('Error upserting contact:', error);
        continue;
      }
    }

    // 4. Insert Jobsites
    for (const jobsite of initialJobsites) {
      try {
        const newJobsite = await prisma.jobsite.create({ data: jobsite });
        console.log("Created jobsite with id:", newJobsite.id);
      } catch (error) {
        console.log("Error creating jobsite:", error);
        continue;
      }
    }

    // 5. Insert Cost Codes
    for (const costCode of initialCostCodes) {
      try {
        const newCostCode = await prisma.costCode.create({ data: costCode });
        console.log("Created cost code with id:", newCostCode.id);
      } catch (error) {
        console.log("Error creating cost code:", error);
        continue;
      }
    }

    // 6. Insert CCTags
    for (const cctag of initialCCTags) {
      try {
        const newCCTag = await prisma.cCTag.create({ data: cctag });
        console.log("Created CCTag with id:", newCCTag.id);
      } catch (error) {
        console.log("Error creating CCTag:", error);
        continue;
      }
    }

    // 7. Insert Document Tags (new model)
    for (const documentTag of initialDocumentTags) {
      try {
        const newDocTag = await prisma.documentTag.create({ data: documentTag });
        console.log("Created document tag with id:", newDocTag.id);
      } catch (error) {
        console.log("Error creating document tag:", error);
        continue;
      }
    }

    // 8. Insert PDF Documents (new model)
    for (const pdfDocument of initialPdfDocuments) {
      try {
        const newPdfDoc = await prisma.pdfDocument.create({ data: pdfDocument });
        console.log("Created PDF document with id:", newPdfDoc.id);
      } catch (error) {
        console.log("Error creating PDF document:", error);
        continue;
      }
    }

    // 9. Insert Equipment (using updatedEquipment seed values)
    for (const equip of updatedEquipment) {
      try {
        const newEquipment = await prisma.equipment.create({ data: equip });
        console.log("Created equipment with id:", newEquipment.id);
      } catch (error) {
        console.log("Error creating equipment:", error);
        continue;
      }
    }

    // 10. Insert Creation Logs (new model)
    for (const creationLog of initialCreationLogs) {
      try {
        const newCreationLog = await prisma.creationLogs.create({ data: creationLog });
        console.log("Created creation log with id:", newCreationLog.id);
      } catch (error) {
        console.log("Error creating creation log:", error);
        continue;
      }
    }

    // 11. Insert Crews
    for (const crew of initialCrews) {
      try {
        const newCrew = await prisma.crew.create({ data: crew });
        console.log("Created crew with id:", newCrew.id);
      } catch (error) {
        console.log("Error creating crew:", error);
        continue;
      }
    }

    // 12. Insert User Settings
    for (const settings of initialUserSettings) {
      try {
        const newSettings = await prisma.userSettings.create({ data: settings });
        console.log("Created user settings with id:", newSettings.id);
      } catch (error) {
        console.log("Error creating user settings:", error);
        continue;
      }
    }

    // 13. Insert TimeSheets
    for (const timesheet of initialTimeSheets) {
      try {
        const newTimeSheet = await prisma.timeSheet.create({ data: timesheet });
        console.log("Created timesheet with id:", newTimeSheet.id);
      } catch (error) {
        console.log("Error creating timesheet:", error);
        continue;
      }
    }

    // 14. Insert Trucking Logs
    for (const truckingLog of initialTruckingLogs) {
      try {
        const newTruckingLog = await prisma.truckingLog.create({ data: truckingLog });
        console.log("Created trucking log with id:", newTruckingLog.id);
      } catch (error) {
        console.log("Error creating trucking log:", error);
        continue;
      }
    }

    // 15. Insert Employee Equipment Logs
    for (const log of initialEmployeeEquipmentLogs) {
      try {
        const newLog = await prisma.employeeEquipmentLog.create({ data: log });
        console.log("Created employee equipment log with id:", newLog.id);
      } catch (error) {
        console.log("Error creating employee equipment log:", error);
        continue;
      }
    }

    // 16. Insert Equipment Hauled
    for (const equipmentHauled of initialEquipmentHauled) {
      try {
        const newEquipmentHauled = await prisma.equipmentHauled.create({ data: equipmentHauled });
        console.log("Created equipment hauled with id:", newEquipmentHauled.id);
      } catch (error) {
        console.log("Error creating equipment hauled:", error);
        continue;
      }
    }

    // 17. Insert Errors
    for (const errorRecord of initialErrors) {
      try {
        const newError = await prisma.error.create({ data: errorRecord });
        console.log("Created error with id:", newError.id);
      } catch (error) {
        console.log("Error creating error record:", error);
        continue;
      }
    }

    // 18. Insert Form Submissions
    for (const submission of initialFormSubmissions) {
      try {
        const newSubmission = await prisma.formSubmission.create({ data: submission });
        console.log("Created form submission with id:", newSubmission.id);
      } catch (error) {
        console.log("Error creating form submission:", error);
        continue;
      }
    }

    // 19. Insert Form Approvals
    for (const approval of initialFormApprovals) {
      try {
        const newApproval = await prisma.formApproval.create({ data: approval });
        console.log("Created form approval with id:", newApproval.id);
      } catch (error) {
        console.log("Error creating form approval:", error);
        continue;
      }
    }

    // 20. Insert Maintenances
    for (const maintenance of initialMaintenances) {
      try {
        const newMaintenance = await prisma.maintenance.create({ data: maintenance });
        console.log("Created maintenance with id:", newMaintenance.id);
      } catch (error) {
        console.log("Error creating maintenance:", error);
        continue;
      }
    }

    // 21. Insert Maintenance Logs
    for (const maintenanceLog of initialMaintenanceLogs) {
      try {
        const newMaintenanceLog = await prisma.maintenanceLog.create({ data: maintenanceLog });
        console.log("Created maintenance log with id:", newMaintenanceLog.id);
      } catch (error) {
        console.log("Error creating maintenance log:", error);
        continue;
      }
    }

    // 22. Insert Tasco Material Types
    for (const tascoType of initialTascoMaterialTypes) {
      try {
        const newTascoType = await prisma.tascoMaterialTypes.create({ data: tascoType });
        console.log("Created Tasco Material Type with id:", newTascoType.id);
      } catch (error) {
        console.log("Error creating Tasco Material Type:", error);
        continue;
      }
    }

    // 23. Insert Tasco Logs
    for (const tascoLog of initialTascoLogs) {
      try {
        const newTascoLog = await prisma.tascoLog.create({ data: tascoLog });
        console.log("Created Tasco log with id:", newTascoLog.id);
      } catch (error) {
        console.log("Error creating Tasco log:", error);
        continue;
      }
    }

    // 24. Insert Materials
    for (const material of initialMaterials) {
      try {
        const newMaterial = await prisma.material.create({ data: material });
        console.log("Created material with id:", newMaterial.id);
      } catch (error) {
        console.log("Error creating material:", error);
        continue;
      }
    }

    // 25. Insert Refuel Logs
    for (const refuel of initialRefueled) {
      try {
        const newRefuel = await prisma.refuelLog.create({ data: refuel });
        console.log("Created refuel log with id:", newRefuel.id);
      } catch (error) {
        console.log("Error creating refuel log:", error);
        continue;
      }
    }

    // 26. Insert State Mileage
    for (const stateMileage of initialStateMileage) {
      try {
        const newStateMileage = await prisma.stateMileage.create({ data: stateMileage });
        console.log("Created state mileage with id:", newStateMileage.id);
      } catch (error) {
        console.log("Error creating state mileage:", error);
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
