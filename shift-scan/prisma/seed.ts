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
        console.error('Error upserting company:', error instanceof Error ? error.stack || error : error);
        continue;
      }
    }

    // 2. Insert Form Templates
    for (const formTemplate of initialFormTemplates) {
      try {
        const newTemplate = await prisma.formTemplate.create({ data: formTemplate });
        console.log('Created form template with id:', newTemplate.id);
      } catch (error) {
        console.error('Error creating form template:', error instanceof Error ? error.stack || error : error);
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
        console.error('Error upserting user:', error instanceof Error ? error.stack || error : error);
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
        console.error('Error upserting contact:', error instanceof Error ? error.stack || error : error);
        continue;
      }
    }

    // 4. Insert Jobsites
    for (const jobsite of initialJobsites) {
      try {
        const newJobsite = await prisma.jobsite.create({ data: jobsite });
        console.log("Created jobsite with id:", newJobsite.id);
      } catch (error) {
        console.error("Error creating jobsite:", error instanceof Error ? error.stack || error : error);
        continue;
      }
    }

    // 5. Insert Cost Codes
    for (const costCode of initialCostCodes) {
      try {
        const newCostCode = await prisma.costCode.create({ data: costCode });
        console.log("Created cost code with id:", newCostCode.id);
      } catch (error) {
        console.error("Error creating cost code:", error instanceof Error ? error.stack || error : error);
        continue;
      }
    }

    // 6. Insert CCTags
    for (const cctag of initialCCTags) {
      try {
        const newCCTag = await prisma.cCTag.create({ data: cctag });
        console.log("Created CCTag with id:", newCCTag.id);
      } catch (error) {
        console.error("Error creating CCTag:", error instanceof Error ? error.stack || error : error);
        continue;
      }
    }

    // 7. Insert Document Tags (new model)
    for (const documentTag of initialDocumentTags) {
      try {
        const newDocTag = await prisma.documentTag.create({ data: documentTag });
        console.log("Created document tag with id:", newDocTag.id);
      } catch (error) {
        console.error("Error creating document tag:", error instanceof Error ? error.stack || error : error);
        continue;
      }
    }

    // 8. Insert PDF Documents (new model)
    for (const pdfDocument of initialPdfDocuments) {
      try {
        const newPdfDoc = await prisma.pdfDocument.create({ data: pdfDocument });
        console.log("Created PDF document with id:", newPdfDoc.id);
      } catch (error) {
        console.error("Error creating PDF document:", error instanceof Error ? error.stack || error : error);
        continue;
      }
    }

    // 9. Insert Equipment (using updatedEquipment seed values)
    for (const equip of updatedEquipment) {
      // Example: check for DocumentTags references
      if (equip.DocumentTags && equip.DocumentTags.connect) {
        const connectValue = equip.DocumentTags.connect;
        const connectArray = Array.isArray(connectValue) ? connectValue : [connectValue];
        let allTagsExist = true;
        for (const tag of connectArray) {
          const exists = await prisma.documentTag.findUnique({ where: { id: tag.id } });
          if (!exists) {
            console.warn(`Skipping equipment with id ${equip.id || '[no id]'}: missing DocumentTag id ${tag.id}`);
            allTagsExist = false;
            break;
          }
        }
        if (!allTagsExist) continue;
      }
      try {
        const newEquipment = await prisma.equipment.create({ data: equip });
        console.log("Created equipment with id:", newEquipment.id);
      } catch (error) {
        console.error("Error creating equipment (check referenced IDs):", equip, error instanceof Error ? error.stack || error : error);
        continue;
      }
    }

    // 10. Insert Creation Logs (new model)
    for (const creationLog of initialCreationLogs) {
      if (creationLog.Equipment && creationLog.Equipment.connect) {
        const eq = creationLog.Equipment.connect;
        let exists = null;
        if (eq.id) {
          exists = await prisma.equipment.findUnique({ where: { id: eq.id } });
        } else if (eq.qrId) {
          exists = await prisma.equipment.findUnique({ where: { qrId: eq.qrId } });
        }
        if (!exists) {
          console.warn(`Skipping creationLog: missing Equipment (id: ${eq.id || ''}, qrId: ${eq.qrId || ''})`);
          continue;
        }
      }
      try {
        const newCreationLog = await prisma.creationLogs.create({ data: creationLog });
        console.log("Created creation log with id:", newCreationLog.id);
      } catch (error) {
        console.error("Error creating creation log (check referenced IDs):", creationLog, error instanceof Error ? error.stack || error : error);
        continue;
      }
    }

    // 11. Insert Crews
    for (const crew of initialCrews) {
      try {
        const newCrew = await prisma.crew.create({ data: crew });
        console.log("Created crew with id:", newCrew.id);
      } catch (error) {
        console.error("Error creating crew:", error instanceof Error ? error.stack || error : error);
        continue;
      }
    }

    // 12. Insert User Settings
    for (const settings of initialUserSettings) {
      try {
        const newSettings = await prisma.userSettings.create({ data: settings });
        console.log("Created user settings with id:", newSettings.id);
      } catch (error) {
        console.error("Error creating user settings:", error instanceof Error ? error.stack || error : error);
        continue;
      }
    }

    // 13. Insert TimeSheets
    for (const timesheet of initialTimeSheets) {
      try {
        const newTimeSheet = await prisma.timeSheet.create({ data: timesheet });
        console.log("Created timesheet with id:", newTimeSheet.id);
      } catch (error) {
        console.error("Error creating timesheet:", error instanceof Error ? error.stack || error : error);
        continue;
      }
    }

    // 14. Insert Trucking Logs
    for (const truckingLog of initialTruckingLogs) {
      if (truckingLog.Equipment && truckingLog.Equipment.connect) {
        const eq = truckingLog.Equipment.connect;
        let exists = null;
        if (eq.id) {
          exists = await prisma.equipment.findUnique({ where: { id: eq.id } });
        } else if (eq.qrId) {
          exists = await prisma.equipment.findUnique({ where: { qrId: eq.qrId } });
        }
        if (!exists) {
          console.warn(`Skipping truckingLog: missing Equipment (id: ${eq.id || ''}, qrId: ${eq.qrId || ''})`);
          continue;
        }
      }
      try {
        const newTruckingLog = await prisma.truckingLog.create({ data: truckingLog });
        console.log("Created trucking log with id:", newTruckingLog.id);
      } catch (error) {
        console.error("Error creating trucking log (check referenced IDs):", truckingLog, error instanceof Error ? error.stack || error : error);
        continue;
      }
    }

    // 15. Insert Employee Equipment Logs
    for (const log of initialEmployeeEquipmentLogs) {
      if (log.Equipment && log.Equipment.connect) {
        const eq = log.Equipment.connect;
        let exists = null;
        if (eq.id) {
          exists = await prisma.equipment.findUnique({ where: { id: eq.id } });
        } else if (eq.qrId) {
          exists = await prisma.equipment.findUnique({ where: { qrId: eq.qrId } });
        }
        if (!exists) {
          console.warn(`Skipping employeeEquipmentLog: missing Equipment (id: ${eq.id || ''}, qrId: ${eq.qrId || ''})`);
          continue;
        }
      }
      if (log.Jobsite && log.Jobsite.connect) {
        const js = log.Jobsite.connect;
        let exists = null;
        if (js.id) {
          exists = await prisma.jobsite.findUnique({ where: { id: js.id } });
        } else if (js.qrId) {
          exists = await prisma.jobsite.findUnique({ where: { qrId: js.qrId } });
        }
        if (!exists) {
          console.warn(`Skipping employeeEquipmentLog: missing Jobsite (id: ${js.id || ''}, qrId: ${js.qrId || ''})`);
          continue;
        }
      }
      try {
        const newLog = await prisma.employeeEquipmentLog.create({ data: log });
        console.log("Created employee equipment log with id:", newLog.id);
      } catch (error) {
        console.error("Error creating employee equipment log (check referenced IDs):", log, error instanceof Error ? error.stack || error : error);
        continue;
      }
    }

    // 16. Insert Equipment Hauled
    for (const equipmentHauled of initialEquipmentHauled) {
      if (equipmentHauled.TruckingLog && equipmentHauled.TruckingLog.connect) {
        const tl = equipmentHauled.TruckingLog.connect;
        let exists = null;
        if (tl.id) {
          exists = await prisma.truckingLog.findUnique({ where: { id: tl.id } });
        }
        if (!exists) {
          console.warn(`Skipping equipmentHauled: missing TruckingLog (id: ${tl.id || ''})`);
          continue;
        }
      }
      if (equipmentHauled.Equipment && equipmentHauled.Equipment.connect) {
        const eq = equipmentHauled.Equipment.connect;
        let exists = null;
        if (eq.id) {
          exists = await prisma.equipment.findUnique({ where: { id: eq.id } });
        } else if (eq.qrId) {
          exists = await prisma.equipment.findUnique({ where: { qrId: eq.qrId } });
        }
        if (!exists) {
          console.warn(`Skipping equipmentHauled: missing Equipment (id: ${eq.id || ''}, qrId: ${eq.qrId || ''})`);
          continue;
        }
      }
      if (equipmentHauled.JobSite && equipmentHauled.JobSite.connect) {
        const js = equipmentHauled.JobSite.connect;
        let exists = null;
        if (js.id) {
          exists = await prisma.jobsite.findUnique({ where: { id: js.id } });
        } else if (js.qrId) {
          exists = await prisma.jobsite.findUnique({ where: { qrId: js.qrId } });
        }
        if (!exists) {
          console.warn(`Skipping equipmentHauled: missing JobSite (id: ${js.id || ''}, qrId: ${js.qrId || ''})`);
          continue;
        }
      }
      try {
        const newEquipmentHauled = await prisma.equipmentHauled.create({ data: equipmentHauled });
        console.log("Created equipment hauled with id:", newEquipmentHauled.id);
      } catch (error) {
        console.error("Error creating equipment hauled (check referenced IDs):", equipmentHauled, error instanceof Error ? error.stack || error : error);
        continue;
      }
    }

    // 17. Insert Errors
    for (const errorRecord of initialErrors) {
      try {
        const newError = await prisma.error.create({ data: errorRecord });
        console.log("Created error with id:", newError.id);
      } catch (error) {
        console.error("Error creating error record:", error instanceof Error ? error.stack || error : error);
        continue;
      }
    }

    // 18. Insert Form Submissions
    for (const submission of initialFormSubmissions) {
      try {
        const newSubmission = await prisma.formSubmission.create({ data: submission });
        console.log("Created form submission with id:", newSubmission.id);
      } catch (error) {
        console.error("Error creating form submission:", error instanceof Error ? error.stack || error : error);
        continue;
      }
    }

    // 19. Insert Form Approvals
    for (const approval of initialFormApprovals) {
      try {
        const newApproval = await prisma.formApproval.create({ data: approval });
        console.log("Created form approval with id:", newApproval.id);
      } catch (error) {
        console.error("Error creating form approval:", error instanceof Error ? error.stack || error : error);
        continue;
      }
    }

    // 20. Insert Maintenances
    for (const maintenance of initialMaintenances) {
      try {
        const newMaintenance = await prisma.maintenance.create({ data: maintenance });
        console.log("Created maintenance with id:", newMaintenance.id);
      } catch (error) {
        console.error("Error creating maintenance:", error instanceof Error ? error.stack || error : error);
        continue;
      }
    }

    // 21. Insert Maintenance Logs
    for (const maintenanceLog of initialMaintenanceLogs) {
      try {
        const newMaintenanceLog = await prisma.maintenanceLog.create({ data: maintenanceLog });
        console.log("Created maintenance log with id:", newMaintenanceLog.id);
      } catch (error) {
        console.error("Error creating maintenance log:", error instanceof Error ? error.stack || error : error);
        continue;
      }
    }

    // 22. Insert Tasco Material Types
    for (const tascoType of initialTascoMaterialTypes) {
      try {
        const newTascoType = await prisma.tascoMaterialTypes.create({ data: tascoType });
        console.log("Created Tasco Material Type with id:", newTascoType.id);
      } catch (error) {
        console.error("Error creating Tasco Material Type:", error instanceof Error ? error.stack || error : error);
        continue;
      }
    }

    // 23. Insert Tasco Logs
    for (const tascoLog of initialTascoLogs) {
      if (tascoLog.Equipment && tascoLog.Equipment.connect) {
        const eq = tascoLog.Equipment.connect;
        let exists = null;
        if (eq.id) {
          exists = await prisma.equipment.findUnique({ where: { id: eq.id } });
        } else if (eq.qrId) {
          exists = await prisma.equipment.findUnique({ where: { qrId: eq.qrId } });
        }
        if (!exists) {
          console.warn(`Skipping tascoLog: missing Equipment (id: ${eq.id || ''}, qrId: ${eq.qrId || ''})`);
          continue;
        }
      }
      try {
        const newTascoLog = await prisma.tascoLog.create({ data: tascoLog });
        console.log("Created Tasco log with id:", newTascoLog.id);
      } catch (error) {
        console.error("Error creating Tasco log (check referenced IDs):", tascoLog, error instanceof Error ? error.stack || error : error);
        continue;
      }
    }

    // 24. Insert Materials
    for (const material of initialMaterials) {
      if (material.TruckingLog && material.TruckingLog.connect) {
        const tl = material.TruckingLog.connect;
        let exists = null;
        if (tl.id) {
          exists = await prisma.truckingLog.findUnique({ where: { id: tl.id } });
        }
        if (!exists) {
          console.warn(`Skipping material: missing TruckingLog (id: ${tl.id || ''})`);
          continue;
        }
      }
      try {
        const newMaterial = await prisma.material.create({ data: material });
        console.log("Created material with id:", newMaterial.id);
      } catch (error) {
        console.error("Error creating material (check referenced IDs):", material, error instanceof Error ? error.stack || error : error);
        continue;
      }
    }

    // 25. Insert Refuel Logs
    for (const refuel of initialRefueled) {
      // Check TruckingLog relation
      if (refuel.TruckingLog && refuel.TruckingLog.connect) {
        const tl = refuel.TruckingLog.connect;
        let exists = null;
        if (tl.id) {
          exists = await prisma.truckingLog.findUnique({ where: { id: tl.id } });
        }
        if (!exists) {
          console.warn(`Skipping refuelLog: missing TruckingLog (id: ${tl.id || ''})`);
          continue;
        }
      }
      // Check TascoLog relation
      if (refuel.TascoLog && refuel.TascoLog.connect) {
        const tlog = refuel.TascoLog.connect;
        let exists = null;
        if (tlog.id) {
          exists = await prisma.tascoLog.findUnique({ where: { id: tlog.id } });
        }
        if (!exists) {
          console.warn(`Skipping refuelLog: missing TascoLog (id: ${tlog.id || ''})`);
          continue;
        }
      }
      try {
        const newRefuel = await prisma.refuelLog.create({ data: refuel });
        console.log('Created refuel log with id:', newRefuel.id);
      } catch (error) {
        console.error('Error creating refuel log (check referenced IDs):', refuel, error instanceof Error ? error.stack || error : error);
        continue;
      }
    }

    // 26. Insert State Mileage
    for (const stateMileage of initialStateMileage) {
      if (stateMileage.TruckingLog && stateMileage.TruckingLog.connect) {
        const tl = stateMileage.TruckingLog.connect;
        let exists = null;
        if (tl.id) {
          exists = await prisma.truckingLog.findUnique({ where: { id: tl.id } });
        }
        if (!exists) {
          console.warn(`Skipping stateMileage: missing TruckingLog (id: ${tl.id || ''})`);
          continue;
        }
      }
      try {
        const newStateMileage = await prisma.stateMileage.create({ data: stateMileage });
        console.log("Created state mileage with id:", newStateMileage.id);
      } catch (error) {
        console.error("Error creating state mileage (check referenced IDs):", stateMileage, error instanceof Error ? error.stack || error : error);
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
