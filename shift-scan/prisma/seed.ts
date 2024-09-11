import { PrismaClient } from "@prisma/client";
//intialEmployeeEquipment
import {initialUserSettings, intialEquipment, initialUsers, initialContacts, 
  initialJobsites, initialTimeSheets, initialCrews, initialCrewMembers, initialTrainings, 
  initialCostCodes,initialCrewJobsites, UserTrainings } from "@/data-access/dataValues";
import {hash} from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding...');
  try {
    // Insert users
    for (const user of initialUsers) {
      const hashed = await hash(user.password, 10);
      const newUser = await prisma.user.create({data: { ...user, password: hashed }});
      console.log("Created user with id: ", newUser.id);
    }

    // Insert contacts
    for (const contact of initialContacts) {
      const newContact = await prisma.contact.create({ data: contact });
      console.log("Created contact with id: ", newContact.id);
    }


    // Insert jobsites
    for (const jobsite of initialJobsites) {
      const newJobsite = await prisma.jobsite.create({ data: jobsite });
      console.log("Created jobsite with id: ", newJobsite.id);
    }

    // Insert cost codes
    for (const costCode of initialCostCodes) {
      const newCostCode = await prisma.costCode.create({ data: costCode });
      console.log("Created cost code with id: ", newCostCode.id);
    }
    for (const equip of intialEquipment) {
      const newEquipment = await prisma.equipment.create({ data: equip });
      console.log("Created equipment with id: ", newEquipment.id);
    }

    // Insert timesheets
    for (const timesheet of initialTimeSheets) {
      const newTimeSheet = await prisma.timeSheet.create({ data: timesheet });
      console.log("Created timesheet with id: ", newTimeSheet.id);
    }

    // Insert crews
    for (const crew of initialCrews) {
      const newCrew = await prisma.crew.create({ data: crew });
      console.log("Created crew with id: ", newCrew.id);
    }

    for (const crewjobsite of initialCrewJobsites) {
      const newCrewJobsite = await prisma.crewJobsite.create({ data: crewjobsite });
      console.log("Created crewjobsite with id: ", newCrewJobsite.id);
    }

    // Insert crew members
    for (const crewMember of initialCrewMembers) {
      const newCrewMember = await prisma.crewMember.create({ data: crewMember });
      console.log("Created crew member with id: ", newCrewMember.id);
    }

    // Insert trainings
    for (const training of initialTrainings) {
      const newTraining = await prisma.trainings.create({ data: training });
      console.log("Created training with id: ", newTraining.id);
    }

    // Insert employee trainings
    for (const training of UserTrainings) {
      const newEmployeeTraining = await prisma.userTrainings.create({ data: training });
      console.log("Created employee training with id: ", newEmployeeTraining.id);
    }


    // for (const equipment of intialEmployeeEquipment) {
    //   const newEmployeeEquipment = await prisma.employeeEquipmentLog.create({ data: equipment });
    //   console.log("Created employee equipment with id: ", newEmployeeEquipment.id);
    // }

    

    for (const settings of initialUserSettings) {
      const newSettings = await prisma.userSettings.create({ data: settings });
      console.log("Created employee equipment with id: ", newSettings.id);
    }

    console.log('Sample data upserted successfully!');
  } catch (error) {
    console.log(error);
    console.log("\n\nKnown Errors to help with debugging: ");
    console.log("--------------------------------------------------------------------------------------------");
    console.log('\n\nSeeding failed! If Error is "Invalid `prisma.jobsite.create()` invocation", be sure to comment out the for loop create function above.\n\n');
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