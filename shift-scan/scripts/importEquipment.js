// import { PrismaClient } from "../prisma/generated/prisma/client.js";
// import { promises as fsPromises, existsSync } from "fs";
// import path from "path";
// import { fileURLToPath } from "url";

// // Emulate __dirname in ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// async function importEquipmentData(filename) {
//   if (!filename) {
//     console.error("Please provide a filename to import");
//     console.log("Usage: node importEquipmentWithProgress.mjs <filename>");
//     return;
//   }

//   const prisma = new PrismaClient();

//   try {
//     console.log("Starting import of equipment data...");

//     const importPath = path.join(__dirname, filename);

//     if (!existsSync(importPath)) {
//       console.error(`File ${importPath} does not exist`);
//       return;
//     }

//     const fileData = await fsPromises.readFile(importPath, "utf8");
//     const equipmentData = JSON.parse(fileData);
//     const totalEquip = equipmentData.length;
//     console.log(`Loaded ${totalEquip} equipment records to import`);

//     // Progress tracking
//     const startTime = Date.now();
//     let lastProgressTime = startTime;
//     let processedEquip = 0;

//     const stats = {
//       created: 0,
//       updated: 0,
//       skipped: 0,
//       errors: 0,
//     };

//     // Progress update function
//     const updateProgress = () => {
//       processedEquip++;
//       const currentTime = Date.now();
//       const elapsedSecs = (currentTime - startTime) / 1000;
//       const percentComplete = Math.floor((processedEquip / totalEquip) * 100);

//       if (percentComplete % 5 === 0 || currentTime - lastProgressTime > 2000) {
//         lastProgressTime = currentTime;
//         const itemsPerSecond = processedEquip / elapsedSecs;
//         const remainingItems = totalEquip - processedEquip;
//         const estimatedRemainingTime = remainingItems / (itemsPerSecond || 1);

//         process.stdout.clearLine();
//         process.stdout.cursorTo(0);
//         process.stdout.write(
//           `Progress: ${percentComplete}% (${processedEquip}/${totalEquip}) | ` +
//             `Est. remaining: ${Math.ceil(estimatedRemainingTime)}s | ` +
//             `Speed: ${itemsPerSecond.toFixed(1)} items/sec`,
//         );
//       }
//     };

//     // Import each equipment record
//     for (const item of equipmentData) {
//       try {
//         // Create a clean data object without DocumentTags or any other non-schema properties
//         const cleanData = {
//           qrId: item.qrId,
//           code: item.code,
//           name: item.name,
//           description: item.description || "",
//           memo: item.memo || "",
//           ownershipType: item.ownershipType || null,
//           make: item.make || "",
//           model: item.model || "",
//           year: item.year || "",
//           color: item.color || "",
//           serialNumber: item.serialNumber || "",
//           acquiredDate: item.acquiredDate || null,
//           acquiredCondition: item.acquiredCondition || null,
//           licensePlate: item.licensePlate || "",
//           licenseState: item.licenseState || "",
//           equipmentTag: item.equipmentTag || "EQUIPMENT",
//           overWeight: item.overWeight === true,
//           currentWeight: item.currentWeight || 0,
//           state: item.state || "AVAILABLE",
//           isDisabledByAdmin: item.isDisabledByAdmin === true,
//           creationReason: item.creationReason || null,
//           approvalStatus: "APPROVED",
//           createdAt: item.createdAt || new Date().toISOString(),
//           updatedAt: item.updatedAt || new Date().toISOString(),
//           createdVia: item.createdVia || "ADMIN",
//           createdById: item.createdById || "7",
//         };

//         let existing = await prisma.equipment.findUnique({
//           where: { qrId: item.qrId },
//         });

//         if (existing) {
//           await prisma.equipment.update({
//             where: { qrId: item.qrId },
//             data: cleanData,
//           });
//           stats.updated++;
//         } else {
//           await prisma.equipment.create({
//             data: cleanData,
//           });
//           stats.created++;
//         }
//       } catch (error) {
//         stats.errors++;
//         console.error(`\nError importing ${item.code}:`, error.message);
//       }

//       updateProgress();
//     }

//     // Newline after last progress update
//     console.log("\n");

//     const totalTimeSeconds = (Date.now() - startTime) / 1000;
//     console.log("Data import summary:");
//     console.log("Created:", stats.created);
//     console.log("Updated:", stats.updated);
//     console.log("Skipped:", stats.skipped);
//     console.log("Errors:", stats.errors);
//     console.log(`Total time: ${totalTimeSeconds.toFixed(2)} seconds`);
//     console.log(
//       `Average speed: ${(totalEquip / totalTimeSeconds).toFixed(2)} items/second`,
//     );
//   } catch (error) {
//     console.error("Error importing data:", error);
//   } finally {
//     await prisma.$disconnect();
//   }
// }
// importEquipmentData("/Equipment_DB_Format.json");
