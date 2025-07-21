import { PrismaClient } from "@prisma/client";
import {
  initialCompany,
  initialFormTemplates,
  initialUsers,
  // initialClients,
  // initialJobsites,
  initialCostCodes,
  initialCCTags,
  updatedEquipment,
  initialCrews,
  initialUserSettings,
  // initialTimeSheets,
  // initialTruckingLogs,
  // initialEmployeeEquipmentLogs,
  // initialEquipmentHauled,
  // initialErrors,
  // initialFormSubmissions,
  // initialFormApprovals,
  // initialMaintenances,
  // initialMaintenanceLogs,
  initialTascoMaterialTypes,
  // initialTascoLogs,
  // initialMaterials,
  // initialRefueled,
  // initialStateMileage,
  // initialDocumentTags,
  // initialPdfDocuments,
  // initialAddresses,
} from "../src/data/dataValues";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding...");

  try {
    // 1. Upsert Addresses
    // for (const address of initialAddresses) {
    //   try {
    //     await prisma.address.upsert({
    //       where: { id: address.id },
    //       update: address,
    //       create: address,
    //     });
    //   } catch (error) {
    //     console.error(
    //       "Error upserting address:",
    //       error instanceof Error ? error.stack || error : error
    //     );
    //     continue;
    //   }
    // }
    // console.log("Address upsert operation completed.");

    // 1. Upsert Companies

    for (const company of initialCompany) {
      try {
        await prisma.company.upsert({
          where: { id: company.id },
          update: company,
          create: company,
        });
      } catch (error) {
        console.error(
          "Error upserting company:",
          error instanceof Error ? error.stack || error : error
        );
        continue;
      }
    }
    console.log("Company upsert operation completed.");

    // 2. Insert Form Templates

    for (const formTemplate of initialFormTemplates) {
      try {
        const newTemplate = await prisma.formTemplate.create({
          data: formTemplate,
        });
        // console.log("Created form template with id:", newTemplate.id);
      } catch (error) {
        console.error(
          "Error creating form template:",
          error instanceof Error ? error.stack || error : error
        );
        continue;
      }
    }
    console.log("Form templates inserted successfully.");

    // 3. Upsert Users
    for (const user of initialUsers) {
      try {
        const upsertedUser = await prisma.user.upsert({
          where: { id: user.id },
          update: user,
          create: user,
        });
        // console.log("Upserted user with id:", upsertedUser.id);
      } catch (error) {
        console.error(
          "Error upserting user:",
          error instanceof Error ? error.stack || error : error
        );
        continue;
      }
    }
    console.log("Users upsert operation completed.");

    // 3.6. Insert Clients

    // for (const client of initialClients) {
    //   try {
    //     const newClient = await prisma.client.create({ data: client });
    //     // console.log("Created client with id:", newClient.id);
    //   } catch (error) {
    //     console.log("Error creating client:", error);
    //     continue;
    //   }
    // }
    // console.log("Clients inserted successfully.");

    // 4. Insert Jobsites

    // for (const jobsite of initialJobsites) {
    //   try {
    //     const newJobsite = await prisma.jobsite.create({ data: jobsite });
    //     // console.log("Created jobsite with id:", newJobsite.id);
    //   } catch (error) {
    //     console.error(
    //       "Error creating jobsite:",
    //       error instanceof Error ? error.stack || error : error
    //     );
    //     continue;
    //   }
    // }
    // console.log("Jobsites inserted successfully.");

    // 5. Insert Cost Codes

    for (const costCode of initialCostCodes) {
      try {
        const newCostCode = await prisma.costCode.create({ data: costCode });
        // console.log("Created cost code with id:", newCostCode.id);
      } catch (error) {
        console.error(
          "Error creating cost code:",
          error instanceof Error ? error.stack || error : error
        );
        continue;
      }
    }
    console.log("Cost codes inserted successfully.");

    // 6. Insert CCTags

    for (const cctag of initialCCTags) {
      try {
        const newCCTag = await prisma.cCTag.create({ data: cctag });
        // console.log("Created CCTag with id:", newCCTag.id);
      } catch (error) {
        console.error(
          "Error creating CCTag:",
          error instanceof Error ? error.stack || error : error
        );
        continue;
      }
    }
    console.log("CCTags inserted successfully.");

    // 7. Insert Document Tags (new model)

    // for (const documentTag of initialDocumentTags) {
    //   try {
    //     const newDocTag = await prisma.documentTag.create({
    //       data: documentTag,
    //     });
    //     // console.log("Created document tag with id:", newDocTag.id);
    //   } catch (error) {
    //     console.error(
    //       "Error creating document tag:",
    //       error instanceof Error ? error.stack || error : error
    //     );
    //     continue;
    //   }
    // }
    // console.log("Document tags inserted successfully.");

    // 8. Insert PDF Documents (new model)

    // for (const pdfDocument of initialPdfDocuments) {
    //   try {
    //     const newPdfDoc = await prisma.pdfDocument.create({
    //       data: pdfDocument,
    //     });
    //     // console.log("Created PDF document with id:", newPdfDoc.id);
    //   } catch (error) {
    //     console.error(
    //       "Error creating PDF document:",
    //       error instanceof Error ? error.stack || error : error
    //     );
    //     continue;
    //   }
    // }
    // console.log("PDF documents inserted successfully.");

    // 9. Insert Equipment (using updatedEquipment seed values)

    for (const equip of updatedEquipment) {
      if (equip.DocumentTags && equip.DocumentTags.connect) {
        const connectValue = equip.DocumentTags.connect;
        const connectArray = Array.isArray(connectValue)
          ? connectValue
          : [connectValue];
        let allTagsExist = true;
        for (const tag of connectArray) {
          const exists = await prisma.documentTag.findUnique({
            where: { id: tag.id },
          });
          if (!exists) {
            console.warn(
              `Skipping equipment with id ${
                equip.id || "[no id]"
              }: missing DocumentTag id ${tag.id}`
            );
            allTagsExist = false;
            break;
          }
        }
        if (!allTagsExist) continue;
      }
      try {
        const newEquipment = await prisma.equipment.create({ data: equip });
        // console.log("Created equipment with id:", newEquipment.id);
      } catch (error) {
        console.error(
          "Error creating equipment (check referenced IDs):",
          equip,
          error instanceof Error ? error.stack || error : error
        );
        continue;
      }
    }
    console.log("Equipment inserted successfully.");

    // 10. Insert Crews

    for (const crew of initialCrews) {
      try {
        const newCrew = await prisma.crew.create({ data: crew });
        // console.log("Created crew with id:", newCrew.id);
      } catch (error) {
        console.error(
          "Error creating crew:",
          error instanceof Error ? error.stack || error : error
        );
        continue;
      }
    }
    console.log("Crews inserted successfully.");

    // 11. Insert User Settings

    for (const settings of initialUserSettings) {
      try {
        const newSettings = await prisma.userSettings.create({
          data: settings,
        });
        // console.log("Created user settings with id:", newSettings.id);
      } catch (error) {
        console.error(
          "Error creating user settings:",
          error instanceof Error ? error.stack || error : error
        );
        continue;
      }
    }
    console.log("User settings inserted successfully.");

    // 12. Insert TimeSheets

    // for (const timesheet of initialTimeSheets) {
    //   try {
    //     const newTimeSheet = await prisma.timeSheet.create({
    //       data: timesheet,
    //     });
    //     // console.log("Created timesheet with id:", newTimeSheet.id);
    //   } catch (error) {
    //     console.error(
    //       "Error creating timesheet:",
    //       error instanceof Error ? error.stack || error : error
    //     );
    //     continue;
    //   }
    // }
    // console.log("TimeSheets inserted successfully.");

    // 13. Insert Trucking Logs

    // for (const truckingLog of initialTruckingLogs) {
    //   if (truckingLog.Equipment && truckingLog.Equipment.connect) {
    //     const eq = truckingLog.Equipment.connect;
    //     let exists = null;
    //     if (eq.id) {
    //       exists = await prisma.equipment.findUnique({
    //         where: { id: eq.id },
    //       });
    //     } else if (eq.qrId) {
    //       exists = await prisma.equipment.findUnique({
    //         where: { qrId: eq.qrId },
    //       });
    //     }
    //     if (!exists) {
    //       console.warn(
    //         `Skipping truckingLog: missing Equipment (id: ${
    //           eq.id || ""
    //         }, qrId: ${eq.qrId || ""})`
    //       );
    //       continue;
    //     }
    //   }
    //   try {
    //     const newTruckingLog = await prisma.truckingLog.create({
    //       data: truckingLog,
    //     });
    //     console.log("Created trucking log with id:", newTruckingLog.id);
    //   } catch (error) {
    //     console.error(
    //       "Error creating trucking log (check referenced IDs):",
    //       truckingLog,
    //       error instanceof Error ? error.stack || error : error
    //     );
    //     continue;
    //   }
    // }
    // console.log("Trucking logs inserted successfully.");

    // 14. Insert Employee Equipment Logs

    // for (const log of initialEmployeeEquipmentLogs) {
    //   if (log.Equipment && log.Equipment.connect) {
    //     const eq = log.Equipment.connect;
    //     let exists = null;
    //     if (eq.id) {
    //       exists = await prisma.equipment.findUnique({
    //         where: { id: eq.id },
    //       });
    //     } else if (eq.qrId) {
    //       exists = await prisma.equipment.findUnique({
    //         where: { qrId: eq.qrId },
    //       });
    //     }
    //     if (!exists) {
    //       console.warn(
    //         `Skipping employeeEquipmentLog: missing Equipment (id: ${
    //           eq.id || ""
    //         }, qrId: ${eq.qrId || ""})`
    //       );
    //       continue;
    //     }
    //   }
    //   try {
    //     const newLog = await prisma.employeeEquipmentLog.create({
    //       data: log,
    //     });
    //     //console.log("Created employee equipment log with id:", newLog.id);
    //   } catch (error) {
    //     console.error(
    //       "Error creating employee equipment log (check referenced IDs):",
    //       log,
    //       error instanceof Error ? error.stack || error : error
    //     );
    //     continue;
    //   }
    // }
    // console.log("Employee equipment logs inserted successfully.");

    // 15. Insert Equipment Hauled

    // for (const equipmentHauled of initialEquipmentHauled) {
    //   if (equipmentHauled.TruckingLog && equipmentHauled.TruckingLog.connect) {
    //     const tl = equipmentHauled.TruckingLog.connect;
    //     let exists = null;
    //     if (tl.id) {
    //       exists = await prisma.truckingLog.findUnique({
    //         where: { id: tl.id },
    //       });
    //     }
    //     if (!exists) {
    //       console.warn(
    //         `Skipping equipmentHauled: missing TruckingLog (id: ${tl.id || ""})`
    //       );
    //       continue;
    //     }
    //   }
    //   if (equipmentHauled.Equipment && equipmentHauled.Equipment.connect) {
    //     const eq = equipmentHauled.Equipment.connect;
    //     let exists = null;
    //     if (eq.id) {
    //       exists = await prisma.equipment.findUnique({
    //         where: { id: eq.id },
    //       });
    //     } else if (eq.qrId) {
    //       exists = await prisma.equipment.findUnique({
    //         where: { qrId: eq.qrId },
    //       });
    //     }
    //     if (!exists) {
    //       console.warn(
    //         `Skipping equipmentHauled: missing Equipment (id: ${
    //           eq.id || ""
    //         }, qrId: ${eq.qrId || ""})`
    //       );
    //       continue;
    //     }
    //   }
    //   if (equipmentHauled.JobSite && equipmentHauled.JobSite.connect) {
    //     const js = equipmentHauled.JobSite.connect;
    //     let exists = null;
    //     if (js.id) {
    //       exists = await prisma.jobsite.findUnique({ where: { id: js.id } });
    //     } else if (js.qrId) {
    //       exists = await prisma.jobsite.findUnique({
    //         where: { qrId: js.qrId },
    //       });
    //     }
    //     if (!exists) {
    //       console.warn(
    //         `Skipping equipmentHauled: missing JobSite (id: ${
    //           js.id || ""
    //         }, qrId: ${js.qrId || ""})`
    //       );
    //       continue;
    //     }
    //   }
    //   try {
    //     const newEquipmentHauled = await prisma.equipmentHauled.create({
    //       data: equipmentHauled,
    //     });
    //     //console.log("Created equipment hauled with id:", newEquipmentHauled.id);
    //   } catch (error) {
    //     console.error(
    //       "Error creating equipment hauled (check referenced IDs):",
    //       equipmentHauled,
    //       error instanceof Error ? error.stack || error : error
    //     );
    //     continue;
    //   }
    // }
    // console.log("Equipment hauled inserted successfully.");

    // 16. Insert Errors

    // for (const errorRecord of initialErrors) {
    //   try {
    //     const newError = await prisma.error.create({ data: errorRecord });
    //     //console.log("Created error with id:", newError.id);
    //   } catch (error) {
    //     console.error(
    //       "Error creating error record:",
    //       error instanceof Error ? error.stack || error : error
    //     );
    //     continue;
    //   }
    // }
    // console.log("Errors inserted successfully.");

    // 17. Insert Form Submissions

    // for (const submission of initialFormSubmissions) {
    //   try {
    //     const newSubmission = await prisma.formSubmission.create({
    //       data: submission,
    //     });
    //     //console.log("Created form submission with id:", newSubmission.id);
    //   } catch (error) {
    //     console.error(
    //       "Error creating form submission:",
    //       error instanceof Error ? error.stack || error : error
    //     );
    //     continue;
    //   }
    // }
    // console.log("Form submissions inserted successfully.");

    // 18. Insert Form Approvals

    // for (const approval of initialFormApprovals) {
    //   try {
    //     const newApproval = await prisma.formApproval.create({
    //       data: approval,
    //     });
    //     //console.log("Created form approval with id:", newApproval.id);
    //   } catch (error) {
    //     console.error(
    //       "Error creating form approval:",
    //       error instanceof Error ? error.stack || error : error
    //     );
    //     continue;
    //   }
    // }
    // console.log("Form approvals inserted successfully.");

    // 19. Insert Maintenances

    // for (const maintenance of initialMaintenances) {
    //   try {
    //     const newMaintenance = await prisma.maintenance.create({
    //       data: maintenance,
    //     });
    //     //console.log("Created maintenance with id:", newMaintenance.id);
    //   } catch (error) {
    //     console.error(
    //       "Error creating maintenance:",
    //       error instanceof Error ? error.stack || error : error
    //     );
    //     continue;
    //   }
    // }
    // console.log("Maintenances inserted successfully.");

    // 20. Insert Maintenance Logs

    // for (const maintenanceLog of initialMaintenanceLogs) {
    //   try {
    //     const newMaintenanceLog = await prisma.maintenanceLog.create({
    //       data: maintenanceLog,
    //     });
    //     //console.log("Created maintenance log with id:", newMaintenanceLog.id);
    //   } catch (error) {
    //     console.error(
    //       "Error creating maintenance log:",
    //       error instanceof Error ? error.stack || error : error
    //     );
    //     continue;
    //   }
    // }
    // console.log("Maintenance logs inserted successfully.");

    // 21. Insert Tasco Material Types

    for (const tascoType of initialTascoMaterialTypes) {
      try {
        const newTascoType = await prisma.tascoMaterialTypes.create({
          data: tascoType,
        });
        //console.log("Created Tasco Material Type with id:", newTascoType.id);
      } catch (error) {
        console.error(
          "Error creating Tasco Material Type:",
          error instanceof Error ? error.stack || error : error
        );
        continue;
      }
    }
    console.log("Tasco Material Types inserted successfully.");

    // 22. Insert Tasco Logs

    // for (const tascoLog of initialTascoLogs) {
    //   if (tascoLog.Equipment && tascoLog.Equipment.connect) {
    //     const eq = tascoLog.Equipment.connect;
    //     let exists = null;
    //     if (eq.id) {
    //       exists = await prisma.equipment.findUnique({
    //         where: { id: eq.id },
    //       });
    //     } else if (eq.qrId) {
    //       exists = await prisma.equipment.findUnique({
    //         where: { qrId: eq.qrId },
    //       });
    //     }
    //     if (!exists) {
    //       console.warn(
    //         `Skipping tascoLog: missing Equipment (id: ${eq.id || ""}, qrId: ${
    //           eq.qrId || ""
    //         })`
    //       );
    //       continue;
    //     }
    //   }
    //   try {
    //     const newTascoLog = await prisma.tascoLog.create({ data: tascoLog });
    //     //console.log("Created Tasco log with id:", newTascoLog.id);
    //   } catch (error) {
    //     console.error(
    //       "Error creating Tasco log (check referenced IDs):",
    //       tascoLog,
    //       error instanceof Error ? error.stack || error : error
    //     );
    //     continue;
    //   }
    // }
    // console.log("Tasco logs inserted successfully.");

    // 23. Insert Materials

    // for (const material of initialMaterials) {
    //   if (material.TruckingLog && material.TruckingLog.connect) {
    //     const tl = material.TruckingLog.connect;
    //     let exists = null;
    //     if (tl.id) {
    //       exists = await prisma.truckingLog.findUnique({
    //         where: { id: tl.id },
    //       });
    //     }
    //     if (!exists) {
    //       console.warn(
    //         `Skipping material: missing TruckingLog (id: ${tl.id || ""})`
    //       );
    //       continue;
    //     }
    //   }
    //   try {
    //     const newMaterial = await prisma.material.create({ data: material });
    //     //console.log("Created material with id:", newMaterial.id);
    //   } catch (error) {
    //     console.error(
    //       "Error creating material (check referenced IDs):",
    //       material,
    //       error instanceof Error ? error.stack || error : error
    //     );
    //     continue;
    //   }
    // }
    // console.log("Materials inserted successfully.");

    // // 24. Insert Refuel Logs
    // for (const refuel of initialRefueled) {
    //   if (refuel.TruckingLog && refuel.TruckingLog.connect) {
    //     const tl = refuel.TruckingLog.connect;
    //     let exists = null;
    //     if (tl.id) {
    //       exists = await prisma.truckingLog.findUnique({
    //         where: { id: tl.id },
    //       });
    //     }
    //     if (!exists) {
    //       console.warn(
    //         `Skipping refuelLog: missing TruckingLog (id: ${tl.id || ""})`
    //       );
    //       continue;
    //     }
    //   }
    //   if (refuel.TascoLog && refuel.TascoLog.connect) {
    //     const tlog = refuel.TascoLog.connect;
    //     let exists = null;
    //     if (tlog.id) {
    //       exists = await prisma.tascoLog.findUnique({
    //         where: { id: tlog.id },
    //       });
    //     }
    //     if (!exists) {
    //       console.warn(
    //         `Skipping refuelLog: missing TascoLog (id: ${tlog.id || ""})`
    //       );
    //       continue;
    //     }
    //   }
    //   try {
    //     const newRefuel = await prisma.refuelLog.create({ data: refuel });
    //     //console.log("Created refuel log with id:", newRefuel.id);
    //   } catch (error) {
    //     console.error(
    //       "Error creating refuel log (check referenced IDs):",
    //       refuel,
    //       error instanceof Error ? error.stack || error : error
    //     );
    //     continue;
    //   }
    // }
    // console.log("Refuel logs inserted successfully.");

    // // 25. Insert State Mileage
    // for (const stateMileage of initialStateMileage) {
    //   if (stateMileage.TruckingLog && stateMileage.TruckingLog.connect) {
    //     const tl = stateMileage.TruckingLog.connect;
    //     let exists = null;
    //     if (tl.id) {
    //       exists = await prisma.truckingLog.findUnique({
    //         where: { id: tl.id },
    //       });
    //     }
    //     if (!exists) {
    //       console.warn(
    //         `Skipping stateMileage: missing TruckingLog (id: ${tl.id || ""})`
    //       );
    //       continue;
    //     }
    //   }
    //   try {
    //     const newStateMileage = await prisma.stateMileage.create({
    //       data: stateMileage,
    //     });
    //     //console.log("Created state mileage with id:", newStateMileage.id);
    //   } catch (error) {
    //     console.log("Error creating state mileage:", error);
    //     continue;
    //   }
    // }
    // console.log("State mileage inserted successfully.");
    console.log("---------------------------------");
    console.log("Seeding completed successfully.");
    console.log("---------------------------------");
  } catch (e) {
    console.error("Seeding failed:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
