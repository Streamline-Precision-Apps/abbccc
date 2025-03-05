import { PrismaClient } from "@prisma/client";
//intialEmployeeEquipment
import {
  initialUserSettings,
  intialEquipment,
  initialUsers,
  initialContacts,
  initialJobsites,
  initialCrews,
  initialCostCodes,
  initialCCTags,
  initialCompany,
} from "@/data/dataValues";
// import { hash } from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding...");
  try {
    for (const company of initialCompany) {
      try {
        // const hashed = await hash(user.password, 10);
        const newUser = await prisma.company.create({
          // TODO Come back to add the hash back in.
          // data: { ...user, password: hashed },
          data: company,
        });
        console.log("Created company with id: ", newUser.id);
      } catch (error) {
        console.log("Error creating company:", error);
        continue; // Skip to the next user
      }
    }

    // Insert users
    for (const user of initialUsers) {
      try {
        // const hashed = await hash(user.password, 10);
        const newUser = await prisma.user.create({
          // TODO Come back to add the hash back in.
          // data: { ...user, password: hashed },
          data: user,
        });
        console.log("Created user with id: ", newUser.id);
      } catch (error) {
        console.log("Error creating user:", error);
        continue; // Skip to the next user
      }
    }

    /*
    #Todo: Add Templates to the seed for initial forms
    - Injury Form
    - Time Off Request
    - Report App Bug
     */

    // Insert contacts
    for (const contact of initialContacts) {
      try {
        const newContact = await prisma.contacts.create({ data: contact });
        console.log("Created contact with id: ", newContact.id);
      } catch (error) {
        console.log("Error creating contact:", error);
        continue; // Skip to the next contact
      }
    }

    // Insert jobsites
    for (const jobsite of initialJobsites) {
      try {
        const newJobsite = await prisma.jobsite.create({ data: jobsite });
        console.log("Created jobsite with id: ", newJobsite.id);
      } catch (error) {
        console.log("Error creating jobsite:", error);
        continue; // Skip to the next jobsite
      }
    }

    // Insert cost codes
    for (const costCode of initialCostCodes) {
      try {
        const newCostCode = await prisma.costCode.create({ data: costCode });
        console.log("Created cost code with id: ", newCostCode.id);
      } catch (error) {
        console.log("Error creating cost code:", error);
        continue; // Skip to the next cost code
      }
    }

    for (const cctag of initialCCTags) {
      try {
        const newCCTag = await prisma.cCTag.create({ data: cctag });
        console.log("Created CCTag with id: ", newCCTag.id);
      } catch (error) {
        console.log("Error creating CCTag:", error);
        continue; // Skip to the next cost code
      }
    }

    // Insert equipment
    for (const equip of intialEquipment) {
      try {
        const newEquipment = await prisma.equipment.create({ data: equip });
        console.log("Created equipment with id: ", newEquipment.id);
      } catch (error) {
        console.log("Error creating equipment:", error);
        continue; // Skip to the next equipment
      }
    }

    // Insert crews
    for (const crew of initialCrews) {
      try {
        const newCrew = await prisma.crew.create({ data: crew });
        console.log("Created crew with id: ", newCrew.id);
      } catch (error) {
        console.log("Error creating crew:", error);
        continue; // Skip to the next crew
      }
    }

    // Insert user settings
    for (const settings of initialUserSettings) {
      try {
        const newSettings = await prisma.userSettings.create({
          data: settings,
        });
        console.log("Created user settings with id: ", newSettings.id);
      } catch (error) {
        console.log("Error creating user settings:", error);
        continue; // Skip to the next user setting
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
