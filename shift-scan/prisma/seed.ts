import { PrismaClient } from "@prisma/client";
import { initialEmployees, initialUsers, initialContacts, initialAddresses, initialAddressEmployees, initialJobsites, initialTimeSheets, initialCrews, initialCrewMembers, initialTrainings, employeeTrainings, initialCostCodes,initialCrewJobsites } from "../src/data/dataValues";

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding...');
  try {
    // Insert employees
    for (const employee of initialEmployees) {
      const newEmployee = await prisma.employee.create({ data: employee });
      console.log("Created employee with id: ", newEmployee.id);
    }

    // Insert users
    for (const user of initialUsers) {
      const newUser = await prisma.user.create({ data: user });
      console.log("Created user with id: ", newUser.id);
    }

    // Insert contacts
    for (const contact of initialContacts) {
      const newContact = await prisma.contact.create({ data: contact });
      console.log("Created contact with id: ", newContact.id);
    }

    // Insert addresses
    for (const address of initialAddresses) {
      const newAddress = await prisma.address.create({ data: address });
      console.log("Created address with id: ", newAddress.id);
    }

    // Insert address employees
    for (const addressEmployee of initialAddressEmployees) {
      const newAddressEmployee = await prisma.addressEmployee.create({ data: addressEmployee });
      console.log("Created addressEmployee with id: ", newAddressEmployee.id);
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
    for (const training of employeeTrainings) {
      const newEmployeeTraining = await prisma.employeeTrainings.create({ data: training });
      console.log("Created employee training with id: ", newEmployeeTraining.id);
    }

    console.log('Sample data upserted successfully!');
  } catch (error) {
    console.log(error);
    console.log("Known Errors to help with debugging: ");
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