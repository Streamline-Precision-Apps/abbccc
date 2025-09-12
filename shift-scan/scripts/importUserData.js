// const { PrismaClient } = require("@prisma/client");
// const fs = require("fs");
// const path = require("path");

// async function importUserData(filename) {
//   if (!filename) {
//     console.error("Please provide a filename to import");
//     console.log("Usage: node importUserData.js <filename>");
//     return;
//   }

//   const prisma = new PrismaClient();

//   try {
//     console.log("Starting import of user data...");

//     const importPath = path.join(__dirname, "../prisma/data-backup", filename);

//     if (!fs.existsSync(importPath)) {
//       console.error(`File ${importPath} does not exist`);
//       return;
//     }

//     const userData = JSON.parse(fs.readFileSync(importPath, "utf8"));
//     const totalUsers = userData.length;
//     console.log(`Loaded ${totalUsers} users to import`);

//     // Setup progress tracking
//     const startTime = Date.now();
//     let lastProgressTime = startTime;
//     let processedUsers = 0;

//     // Estimate total operations (rough estimate)
//     const estimatedTotalOps = totalUsers * 2; // User + related entities

//     // Statistics to track operations
//     const stats = {
//       users: { created: 0, updated: 0, skipped: 0 },
//       settings: { created: 0, updated: 0, skipped: 0 },
//       contacts: { created: 0, updated: 0, skipped: 0 },
//       resetTokens: { created: 0, updated: 0, skipped: 0 },
//       setupTokens: { created: 0, updated: 0, skipped: 0 },
//       crews: { created: 0, updated: 0, skipped: 0, userAssociations: 0 },
//     };

//     // Track crews we've already processed to avoid duplicates
//     const processedCrewIds = new Set();

//     // Progress update function
//     const updateProgress = () => {
//       processedUsers++;

//       // Only update every 1% or every 2 seconds
//       const currentTime = Date.now();
//       const elapsedSecs = (currentTime - startTime) / 1000;
//       const percentComplete = Math.floor((processedUsers / totalUsers) * 100);

//       if (percentComplete % 5 === 0 || currentTime - lastProgressTime > 2000) {
//         lastProgressTime = currentTime;
//         const usersPerSecond = processedUsers / elapsedSecs;
//         const remainingUsers = totalUsers - processedUsers;
//         const estimatedRemainingTime = remainingUsers / usersPerSecond;

//         process.stdout.clearLine();
//         process.stdout.cursorTo(0);
//         process.stdout.write(
//           `Progress: ${percentComplete}% (${processedUsers}/${totalUsers}) | ` +
//             `Est. remaining: ${Math.ceil(estimatedRemainingTime)}s | ` +
//             `Speed: ${usersPerSecond.toFixed(1)} users/sec`,
//         );
//       }
//     };

//     // Import each user and related data
//     for (const user of userData) {
//       const {
//         accountSetupToken,
//         Contact,
//         PasswordResetTokens,
//         UserSettings,
//         Crews,
//         ...userDataOnly
//       } = user;

//       // Check if user exists
//       const existingUser = await prisma.user.findUnique({
//         where: { id: userDataOnly.id },
//       });

//       if (existingUser) {
//         // Update user if it exists
//         await prisma.user.update({
//           where: { id: userDataOnly.id },
//           data: userDataOnly,
//         });
//         stats.users.updated++;
//       } else {
//         // Create user if it doesn't exist
//         await prisma.user.create({
//           data: userDataOnly,
//         });
//         stats.users.created++;
//       }

//       // Handle UserSettings
//       if (UserSettings) {
//         const existingSettings = await prisma.userSettings.findUnique({
//           where: { userId: userDataOnly.id },
//         });

//         if (existingSettings) {
//           await prisma.userSettings.update({
//             where: { userId: userDataOnly.id },
//             data: UserSettings,
//           });
//           stats.settings.updated++;
//         } else {
//           await prisma.userSettings.create({
//             data: { ...UserSettings, userId: userDataOnly.id },
//           });
//           stats.settings.created++;
//         }
//       }

//       // Handle Contact
//       if (Contact) {
//         const existingContact = await prisma.contacts.findUnique({
//           where: { userId: userDataOnly.id },
//         });

//         if (existingContact) {
//           await prisma.contacts.update({
//             where: { userId: userDataOnly.id },
//             data: Contact,
//           });
//           stats.contacts.updated++;
//         } else {
//           await prisma.contacts.create({
//             data: { ...Contact, userId: userDataOnly.id },
//           });
//           stats.contacts.created++;
//         }
//       }

//       // Handle password reset tokens
//       if (PasswordResetTokens && PasswordResetTokens.length > 0) {
//         for (const token of PasswordResetTokens) {
//           const existingToken = await prisma.passwordResetToken.findUnique({
//             where: { id: token.id },
//           });

//           if (existingToken) {
//             await prisma.passwordResetToken.update({
//               where: { id: token.id },
//               data: token,
//             });
//             stats.resetTokens.updated++;
//           } else {
//             await prisma.passwordResetToken.create({
//               data: token,
//             });
//             stats.resetTokens.created++;
//           }
//         }
//       }

//       // Handle account setup token
//       if (accountSetupToken) {
//         const existingToken = await prisma.accountSetupToken.findUnique({
//           where: { userId: userDataOnly.id },
//         });

//         if (existingToken) {
//           await prisma.accountSetupToken.update({
//             where: { userId: userDataOnly.id },
//             data: accountSetupToken,
//           });
//           stats.setupTokens.updated++;
//         } else {
//           await prisma.accountSetupToken.create({
//             data: { ...accountSetupToken, userId: userDataOnly.id },
//           });
//           stats.setupTokens.created++;
//         }
//       }

//       // Handle Crews - first process the crew entities
//       if (Crews && Crews.length > 0) {
//         for (const crew of Crews) {
//           // Skip if we've already processed this crew
//           if (processedCrewIds.has(crew.id)) {
//             continue;
//           }

//           processedCrewIds.add(crew.id);

//           // Check if crew exists
//           const existingCrew = await prisma.crew.findUnique({
//             where: { id: crew.id },
//           });

//           // Only import core crew data here
//           const { Users, ...crewData } = crew;

//           if (existingCrew) {
//             await prisma.crew.update({
//               where: { id: crew.id },
//               data: crewData,
//             });
//             stats.crews.updated++;
//           } else {
//             await prisma.crew.create({
//               data: crewData,
//             });
//             stats.crews.created++;
//           }
//         }
//       }

//       // Handle crew associations for this user
//       if (Crews && Crews.length > 0) {
//         // Connect this user to each crew they belong to
//         for (const crew of Crews) {
//           try {
//             // Connect user to crew - this updates the many-to-many relation
//             await prisma.crew.update({
//               where: { id: crew.id },
//               data: {
//                 Users: {
//                   connect: { id: userDataOnly.id },
//                 },
//               },
//             });
//             stats.crews.userAssociations++;
//           } catch (error) {
//             console.error(
//               `Error connecting user ${userDataOnly.id} to crew ${crew.id}:`,
//               error.message,
//             );
//           }
//         }
//       }

//       // Update progress after each user
//       updateProgress();
//     }

//     // Ensure a newline after progress output
//     console.log("\n");

//     // Calculate total elapsed time
//     const totalTimeSeconds = (Date.now() - startTime) / 1000;

//     console.log("Data import summary:");
//     console.log("Users:", stats.users);
//     console.log("User Settings:", stats.settings);
//     console.log("Contacts:", stats.contacts);
//     console.log("Password Reset Tokens:", stats.resetTokens);
//     console.log("Account Setup Tokens:", stats.setupTokens);
//     console.log("Crews:", stats.crews);
//     console.log(`Total time: ${totalTimeSeconds.toFixed(2)} seconds`);
//     console.log(
//       `Average speed: ${(totalUsers / totalTimeSeconds).toFixed(2)} users/second`,
//     );
//   } catch (error) {
//     console.error("Error importing data:", error);
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// importUserData(process.argv[2]);
