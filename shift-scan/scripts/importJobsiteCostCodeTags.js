// const { PrismaClient } = require("@prisma/client");
// const fs = require("fs");
// const path = require("path");
// const readline = require("readline");

// const prisma = new PrismaClient();

// // Create readline interface for user prompts
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// // Prompt for confirmation
// const confirm = (question) => {
//   return new Promise((resolve) => {
//     rl.question(`${question} (y/n): `, (answer) => {
//       resolve(answer.toLowerCase() === "y");
//     });
//   });
// };

// // Prompt for file path
// const promptForFilePath = (entityName) => {
//   return new Promise((resolve) => {
//     rl.question(
//       `Enter the path to the ${entityName} JSON file: `,
//       (filePath) => {
//         resolve(filePath);
//       },
//     );
//   });
// };

// // Calculate and display time estimates
// const calculateTimeEstimate = (count, operationTimeMs = 150) => {
//   const totalTimeMs = count * operationTimeMs;
//   const seconds = Math.floor(totalTimeMs / 1000);
//   const minutes = Math.floor(seconds / 60);

//   if (minutes > 0) {
//     return `approximately ${minutes} minute(s) and ${seconds % 60} second(s)`;
//   } else {
//     return `approximately ${seconds} second(s)`;
//   }
// };

// async function importJobsiteCostCodeTags() {
//   try {
//     console.log("Starting import of jobsites, cost codes, and tags data...");

//     // First ask if user wants to import everything
//     const importAll = await confirm(
//       "Do you want to import all categories (CCTags, CostCodes, and Jobsites)?",
//     );

//     // Determine which categories to import
//     let importCCTags = importAll;
//     let importCostCodes = importAll;
//     let importJobsites = importAll;

//     // If not importing all, ask for each category individually
//     if (!importAll) {
//       importCCTags = await confirm("Do you want to import CC Tags?");
//       importCostCodes = await confirm("Do you want to import Cost Codes?");
//       importJobsites = await confirm("Do you want to import Jobsites?");
//     }

//     // Import CCTags if selected
//     if (importCCTags) {
//       const ccTagsFilePath = await promptForFilePath("CC Tags");
//       if (ccTagsFilePath) {
//         const ccTagsData = JSON.parse(fs.readFileSync(ccTagsFilePath, "utf8"));
//         console.log(`Found ${ccTagsData.length} CC tags to import`);
//         console.log(
//           `Estimated import time: ${calculateTimeEstimate(ccTagsData.length)}`,
//         );

//         const shouldImportTags = await confirm(
//           "Proceed with importing CC tags?",
//         );
//         if (shouldImportTags) {
//           const startTime = Date.now();
//           let processed = 0;

//           for (const tag of ccTagsData) {
//             // Need to handle the many-to-many relations separately
//             const { CostCodes, Jobsites, ...tagData } = tag;

//             // Use upsert instead of separate find/create/update
//             await prisma.cCTag.upsert({
//               where: { id: tagData.id },
//               update: tagData,
//               create: tagData,
//             });

//             processed++;
//             if (processed % 10 === 0) {
//               console.log(
//                 `Processed ${processed}/${ccTagsData.length} CC tags...`,
//               );
//             }
//           }

//           const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
//           console.log(`CC tags import completed in ${elapsedTime} seconds`);
//         }
//       }
//     } else {
//       console.log("Skipping CC Tags import");
//     }

//     // Import CostCodes if selected
//     if (importCostCodes) {
//       const costCodesFilePath = await promptForFilePath("Cost Codes");
//       if (costCodesFilePath) {
//         const costCodesData = JSON.parse(
//           fs.readFileSync(costCodesFilePath, "utf8"),
//         );
//         console.log(`Found ${costCodesData.length} cost codes to import`);
//         console.log(
//           `Estimated import time: ${calculateTimeEstimate(costCodesData.length, 200)}`,
//         );

//         const shouldImportCostCodes = await confirm(
//           "Proceed with importing cost codes?",
//         );
//         if (shouldImportCostCodes) {
//           const startTime = Date.now();
//           let processed = 0;

//           for (const costCode of costCodesData) {
//             // Handle the many-to-many relation separately
//             const { CCTags, Timesheets, ...costCodeData } = costCode;

//             // Use upsert with connect for the relations
//             await prisma.costCode.upsert({
//               where: { id: costCodeData.id },
//               update: {
//                 ...costCodeData,
//                 CCTags: {
//                   connect: CCTags?.map((tag) => ({ id: tag.id })) || [],
//                 },
//               },
//               create: {
//                 ...costCodeData,
//                 CCTags: {
//                   connect: CCTags?.map((tag) => ({ id: tag.id })) || [],
//                 },
//               },
//             });

//             processed++;
//             if (processed % 10 === 0) {
//               console.log(
//                 `Processed ${processed}/${costCodesData.length} cost codes...`,
//               );
//             }
//           }

//           const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
//           console.log(`Cost codes import completed in ${elapsedTime} seconds`);
//         }
//       }
//     } else {
//       console.log("Skipping Cost Codes import");
//     }

//     // Import Jobsites if selected
//     if (importJobsites) {
//       const jobsitesFilePath = await promptForFilePath("Jobsites");
//       if (jobsitesFilePath) {
//         const jobsitesData = JSON.parse(
//           fs.readFileSync(jobsitesFilePath, "utf8"),
//         ).map((jobsite) => {
//           // Create a new object without clientId
//           const { clientId, ...jobsiteWithoutClientId } = jobsite;
//           return jobsiteWithoutClientId;
//         });
//         console.log(`Found ${jobsitesData.length} jobsites to import`);
//         console.log(
//           `Estimated import time: ${calculateTimeEstimate(jobsitesData.length, 250)}`,
//         );

//         const shouldImportJobsites = await confirm(
//           "Proceed with importing jobsites?",
//         );
//         if (shouldImportJobsites) {
//           const startTime = Date.now();
//           let processed = 0;

//           for (const jobsite of jobsitesData) {
//             // Handle the relations separately and extract only the fields we need
//             const {
//               id,
//               qrId,
//               code,
//               name,
//               description,
//               creationReason,
//               approvalStatus,
//               isActive,
//               addressId: originalAddressId,
//               comment,
//               createdAt,
//               updatedAt,
//               archiveDate,
//               createdById: originalCreatedById,
//               latitude,
//               longitude,
//               radiusMeters,
//               createdVia,
//               Address,
//               createdBy,
//               CCTags,
//               // Explicitly exclude these fields
//               TimeSheets,
//               // Any other fields to exclude...
//             } = jobsite;

//             // Create a clean object with only the fields we know exist in the database
//             const jobsiteImportData = {
//               id,
//               qrId,
//               code,
//               name,
//               description: description || "",
//               creationReason: creationReason || null,
//               approvalStatus,
//               isActive,
//               comment,
//               createdAt,
//               updatedAt,
//               archiveDate,
//               latitude,
//               longitude,
//               radiusMeters,
//               createdVia,
//             };

//             // Only add addressId if Address exists
//             if (Address && Address.id) {
//               jobsiteImportData.addressId = Address.id;
//             } else if (originalAddressId) {
//               jobsiteImportData.addressId = originalAddressId;
//             }

//             // Only add createdById if createdBy exists
//             if (createdBy && createdBy.id) {
//               jobsiteImportData.createdById = createdBy.id;
//             } else if (originalCreatedById) {
//               jobsiteImportData.createdById = originalCreatedById;
//             }

//             // Add CCTags connection if they exist
//             if (CCTags && CCTags.length > 0) {
//               jobsiteImportData.CCTags = {
//                 connect: CCTags.map((tag) => ({ id: tag.id })),
//               };
//             }

//             console.log(
//               "Importing jobsite with data:",
//               JSON.stringify(jobsiteImportData, null, 2),
//             );

//             // Use upsert
//             await prisma.jobsite.upsert({
//               where: { id },
//               update: {
//                 qrId: jobsiteImportData.qrId,
//                 code: jobsiteImportData.code,
//                 name: jobsiteImportData.name,
//                 description: jobsiteImportData.description,
//                 creationReason: jobsiteImportData.creationReason,
//                 approvalStatus: jobsiteImportData.approvalStatus,
//                 isActive: jobsiteImportData.isActive,
//                 comment: jobsiteImportData.comment,
//                 updatedAt: jobsiteImportData.updatedAt,
//                 archiveDate: jobsiteImportData.archiveDate,
//                 latitude: jobsiteImportData.latitude,
//                 longitude: jobsiteImportData.longitude,
//                 radiusMeters: jobsiteImportData.radiusMeters,
//                 createdVia: jobsiteImportData.createdVia,
//                 ...(jobsiteImportData.addressId
//                   ? { addressId: jobsiteImportData.addressId }
//                   : {}),
//                 ...(jobsiteImportData.createdById
//                   ? { createdById: jobsiteImportData.createdById }
//                   : {}),
//                 ...(jobsiteImportData.CCTags
//                   ? { CCTags: jobsiteImportData.CCTags }
//                   : {}),
//               },
//               create: {
//                 qrId: jobsiteImportData.qrId,
//                 code: jobsiteImportData.code,
//                 name: jobsiteImportData.name,
//                 description: jobsiteImportData.description,
//                 creationReason: jobsiteImportData.creationReason,
//                 approvalStatus: jobsiteImportData.approvalStatus,
//                 isActive: jobsiteImportData.isActive,
//                 comment: jobsiteImportData.comment,
//                 createdAt: jobsiteImportData.createdAt,
//                 updatedAt: jobsiteImportData.updatedAt,
//                 archiveDate: jobsiteImportData.archiveDate,
//                 latitude: jobsiteImportData.latitude,
//                 longitude: jobsiteImportData.longitude,
//                 radiusMeters: jobsiteImportData.radiusMeters,
//                 createdVia: jobsiteImportData.createdVia,
//                 ...(jobsiteImportData.addressId
//                   ? { addressId: jobsiteImportData.addressId }
//                   : {}),
//                 ...(jobsiteImportData.createdById
//                   ? { createdById: jobsiteImportData.createdById }
//                   : {}),
//                 ...(jobsiteImportData.CCTags
//                   ? { CCTags: jobsiteImportData.CCTags }
//                   : {}),
//               },
//             });

//             processed++;
//             if (processed % 10 === 0) {
//               console.log(
//                 `Processed ${processed}/${jobsitesData.length} jobsites...`,
//               );
//             }
//           }

//           const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
//           console.log(`Jobsites import completed in ${elapsedTime} seconds`);
//         }
//       }
//     } else {
//       console.log("Skipping Jobsites import");
//     }

//     console.log("Import process completed successfully");
//   } catch (error) {
//     console.error("Error importing data:", error);
//   } finally {
//     rl.close();
//     await prisma.$disconnect();
//   }
// }

// importJobsiteCostCodeTags();
