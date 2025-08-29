// const { PrismaClient } = require("@prisma/client");
// const fs = require("fs");
// const path = require("path");

// async function exportUserData() {
//   const prisma = new PrismaClient();

//   try {
//     console.log("Starting export of user-related data...");

//     // Export User data with correct relation field names
//     const users = await prisma.user.findMany({
//       include: {
//         accountSetupToken: true, // lowercase first letter
//         Contact: true, // maintain case as in schema
//         PasswordResetTokens: true, // maintain case as in schema
//         UserSettings: true, // maintain case as in schema
//         Crews: true,
//         // Include other relations if needed
//         // Company: true,
//         // Equipment: true,
//         // FormApprovals: true,
//         // FormSubmissions: true,
//         // Jobsite: true,
//         // MaintenanceLogs: true,
//         // TimeSheets: true,
//       },
//     });

//     console.log(`Found ${users.length} users to export`);

//     // Create export directory if it doesn't exist
//     const exportDir = path.join(__dirname, "../prisma/data-backup");
//     if (!fs.existsSync(exportDir)) {
//       fs.mkdirSync(exportDir, { recursive: true });
//     }

//     // Write data to JSON files
//     const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

//     // Export user data
//     fs.writeFileSync(
//       path.join(exportDir, `users-${timestamp}.json`),
//       JSON.stringify(users, null, 2),
//     );

//     console.log(`Data exported successfully to ${exportDir}`);
//   } catch (error) {
//     console.error("Error exporting data:", error);
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// exportUserData();
