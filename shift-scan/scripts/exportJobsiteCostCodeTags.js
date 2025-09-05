// import { PrismaClient } from "../../../../../prisma/generated/prisma/client";
// const fs = require("fs");
// const path = require("path");

// async function exportJobsiteCostCodeTags() {
//   const prisma = new PrismaClient();

//   try {
//     console.log("Starting export of jobsites, cost codes, and tags data...");

//     // Export Jobsites with relations
//     const jobsites = await prisma.jobsite.findMany({
//       include: {
//         Address: true,
//         createdBy: true,
//         TimeSheets: false, // Excluding to avoid large data volumes
//         CCTags: true,
//       },
//     });

//     console.log(`Found ${jobsites.length} jobsites to export`);

//     // Export CostCodes with relations
//     const costCodes = await prisma.costCode.findMany({
//       include: {
//         CCTags: true,
//         Timesheets: false, // Excluding to avoid large data volumes
//       },
//     });

//     console.log(`Found ${costCodes.length} cost codes to export`);

//     // Export CCTags with relations
//     const ccTags = await prisma.cCTag.findMany({
//       include: {
//         CostCodes: true,
//         Jobsites: true,
//       },
//     });

//     console.log(`Found ${ccTags.length} CC tags to export`);

//     // Create export directory if it doesn't exist
//     const exportDir = path.join(__dirname, "../prisma/data-backup");
//     if (!fs.existsSync(exportDir)) {
//       fs.mkdirSync(exportDir, { recursive: true });
//     }

//     // Write data to JSON files
//     const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

//     // Export jobsite data
//     fs.writeFileSync(
//       path.join(exportDir, `jobsites-${timestamp}.json`),
//       JSON.stringify(jobsites, null, 2),
//     );

//     // Export cost code data
//     fs.writeFileSync(
//       path.join(exportDir, `costcodes-${timestamp}.json`),
//       JSON.stringify(costCodes, null, 2),
//     );

//     // Export CC tag data
//     fs.writeFileSync(
//       path.join(exportDir, `cctags-${timestamp}.json`),
//       JSON.stringify(ccTags, null, 2),
//     );

//     console.log(`Data exported successfully to ${exportDir}`);
//   } catch (error) {
//     console.error("Error exporting data:", error);
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// exportJobsiteCostCodeTags();
