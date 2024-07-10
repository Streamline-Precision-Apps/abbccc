import { Prisma, PrismaClient } from "@prisma/client";
import workerData from "../src/data/worker-data.json";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function upsertWorkerData(worker: any) {
  const { user, employee, employeePosition, position, contact, contactJoin, address, addressEmployee } = worker;

  // Hash user password
  const hashedUserPassword = await hash(user.password, 10);
  await prisma.user.upsert({
    where: { id: user.id },
    update: {},
    create: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      password: hashedUserPassword,
      permission: user.permission,
      truck_view: user.truck_view,
      tasco_view: user.tasco_view,
      labor_view: user.labor_view,
      mechanic_view: user.mechanic_view,
      email: user.email,
      emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
      phone: user.phone,
      image: user.image,
    },
  });

  // Upsert position
  await prisma.position.upsert({
    where: { id: position.id },
    update: {
      name: position.name,
      createdAt: new Date(position.createdAt),
      updatedAt: new Date(position.updatedAt),
    },
    create: {
      id: position.id,
      name: position.name,
      createdAt: new Date(position.createdAt),
      updatedAt: new Date(position.updatedAt),
    },
  });

  // Upsert employee
  await prisma.employee.upsert({
    where: { id: employee.id },
    update: {
      first_name: employee.first_name,
      middle_name: employee.middle_name || null,
      last_name: employee.last_name,
      dob: employee.dob,
      availability: employee.availability,
      start_date: new Date(employee.start_date),
      termination_date: employee.termination_date ? new Date(employee.termination_date) : null,
      createdAt: new Date(employee.createdAt),
      updatedAt: new Date(employee.updatedAt),
    },
    create: {
      id: employee.id,
      first_name: employee.first_name,
      middle_name: employee.middle_name || null,
      last_name: employee.last_name,
      dob: employee.dob,
      availability: employee.availability,
      start_date: new Date(employee.start_date),
      termination_date: employee.termination_date ? new Date(employee.termination_date) : null,
      createdAt: new Date(employee.createdAt),
      updatedAt: new Date(employee.updatedAt),
    },
  });

  // Upsert employee position
  await prisma.employeePosition.upsert({
    where: { id: employeePosition.id },
    update: {
      employee_id: employeePosition.employee_id,
      position_id: employeePosition.position_id,
      createdAt: new Date(employeePosition.createdAt),
      updatedAt: new Date(employeePosition.updatedAt),
    },
    create: {
      id: employeePosition.id,
      employee_id: employeePosition.employee_id,
      position_id: employeePosition.position_id,
      createdAt: new Date(employeePosition.createdAt),
      updatedAt: new Date(employeePosition.updatedAt),
    },
  });

  // Upsert contact
  await prisma.contact.upsert({
    where: { id: contact.id },
    update: {
      phone_number: contact.phone_number,
      email: contact.email,
      emergency_contact: contact.emergency_contact,
      emergency_contact_no: contact.emergency_contact_no,
      createdAt: new Date(contact.createdAt),
      updatedAt: new Date(contact.updatedAt),
    },
    create: {
      id: contact.id,
      phone_number: contact.phone_number,
      email: contact.email,
      emergency_contact: contact.emergency_contact,
      emergency_contact_no: contact.emergency_contact_no,
      createdAt: new Date(contact.createdAt),
      updatedAt: new Date(contact.updatedAt),
    },
  });

  // Upsert contact join
  // await prisma.contactJoin.upsert({
  //   where: { id: contactJoin.id },
  //   update: {
  //     contact_id: contactJoin.contact_id,
  //     employee_id: contactJoin.employee_id,
  //     createdAt: new Date(contactJoin.createdAt),
  //     updatedAt: new Date(contactJoin.updatedAt),
  //   },
  //   create: {
  //     id: contactJoin.id,
  //     contact_id: contactJoin.contact_id,
  //     employee_id: contactJoin.employee_id,
  //     createdAt: new Date(contactJoin.createdAt),
  //     updatedAt: new Date(contactJoin.updatedAt),
  //   },
  // });

  // Upsert address
  await prisma.address.upsert({
    where: { id: address.id },
    update: {
      address: address.address,
      city: address.city,
      state: address.state,
      zipcode: address.zipcode,
      country: address.country,
      createdAt: new Date(address.createdAt),
      updatedAt: new Date(address.updatedAt),
    },
    create: {
      id: address.id,
      address: address.address,
      city: address.city,
      state: address.state,
      zipcode: address.zipcode,
      country: address.country,
      createdAt: new Date(address.createdAt),
      updatedAt: new Date(address.updatedAt),
    },
  });

  // Upsert address assigner
  await prisma.addressEmployee.upsert({
    where: {
      id: addressEmployee.id,
    },
    update: {
      address_id: addressEmployee.address_id,
      employee_id: addressEmployee.employee_id,
      createdAt: new Date(addressEmployee.createdAt),
      updatedAt: new Date(addressEmployee.updatedAt),
    },
    create: {
      id: addressEmployee.id,
      address_id: addressEmployee.address_id,
      employee_id: addressEmployee.employee_id,
      createdAt: new Date(addressEmployee.createdAt),
      updatedAt: new Date(addressEmployee.updatedAt),
    },
  });
}
// sample of how we can create seeds for now on 
// look into the node module folder click -> prisma -> client -> index.d.ts
// C:\Users\19362\Streamline-Precision-Timecard\shift-scan\node_modules\.prisma\client\index.d.ts
// we can see that the format below allows us to create seeds for our database with ease due to codeium auto filling it
const initaialJobsites: Prisma.JobsiteCreateInput[]  = [
  {
    qr_id : "12345",
    jobsite_name: "First Site",
    jobsite_active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    qr_id : "23456",
    jobsite_name: "Second Site",
    jobsite_active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    qr_id : "34567",
    jobsite_name: "Third Site",
    jobsite_active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    qr_id : "45678",
    jobsite_name: "Fourth Site",
    jobsite_active: true,
    createdAt: new Date(),

}
];



const initialTimeSheets: Prisma.TimeSheetCreateInput[] = [
  {
    submit_date: new Date(),
    form_id: 123,
    date:new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
    jobsite_id: 789,
    costcode: 'CC-101',
    start_time: new Date(new Date().setHours(8, 0, 0, 0)).toISOString(),
    end_time: new Date(new Date().setHours(12, 0, 0, 0)).toISOString(),
    total_break_time: 0,
    duration: 4.00,
    timesheet_comments: 'No issues during the shift.',
    app_comment: 'H>8-J>789>CC-101>T>6.',
    employee: {
      connect: {
        id: 2
      }
    }
  },
  {
    submit_date: new Date(),
    form_id: 124,
    date: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
    jobsite_id: 719,
    costcode: 'CC-101',
    start_time: new Date(new Date().setHours(12, 0, 0, 0)).toISOString(),
    end_time: new Date(new Date().setHours(17, 0, 0, 0)).toISOString(),
    total_break_time: 1.00,
    duration: 4.00,
    timesheet_comments: 'No issues during the shift.',
    app_comment: 'H>8-J>789>CC-101>T>6.',
    employee: {
      connect: {
        id: 2
      }
    }
  },
  {
    submit_date: new Date(),
    form_id: 125,
    date: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
    jobsite_id: 789,
    costcode: 'CC-101',
    start_time: new Date(new Date().setHours(8, 0, 0, 0)).toISOString(),
    end_time: new Date(new Date().setHours(15, 0, 0, 0)).toISOString(),
    total_break_time: 60,
    duration: 6.00,
    timesheet_comments: 'No issues during the shift.',
    app_comment: 'Submitted on time.',
    employee: {
      connect: {
        id: 1
      }
    }
  },
  {
    submit_date: new Date(),
    form_id: 126,
    date: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
    jobsite_id: 789,
    costcode: 'CC-101',
    start_time: new Date(new Date().setHours(15, 0, 0, 0)).toISOString(),
    end_time: new Date(new Date().setHours(19, 0, 0, 0)).toISOString(),
    total_break_time: 0,
    duration: 4.00,
    timesheet_comments: 'No issues during the shift.',
    app_comment: 'Submitted on time.',
    employee: {
      connect: {
        id: 1
      }
    }
  }
];

const initialCrews: Prisma.CrewCreateInput[] = [
  {
    name: "Jessica's Crew",
    description: "General Contrator Crew",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Devun's Crew",
    description: "A Computer Science and App development Crew",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Dustin's Crew",
    description: "Trucking Crew",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Seth's Crew",
    description: "Fabrication Crew",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];


const initialCrewMembers: Prisma.CrewMemberCreateInput[] = [

  {
    createdAt: new Date(),
    updatedAt: new Date(),
    employee: {
      connect: {id: 1}},
      crew: {connect: {id: 1}}
  },

  {
    createdAt: new Date(),
    updatedAt: new Date(),
    employee: { connect: {id: 2}},
    crew: {connect: {id: 1}}
  },
  
];



async function main() {
  console.log('Seeding...');
  const { workers } = workerData;
try{

  for (const worker of workers) {
    await upsertWorkerData(worker);
  }
  
  for (const jobsite of initaialJobsites) {
    const newJobsite = await prisma.jobsite.create({
      data: jobsite,
    });

    console.log("created jobsite with id: ", newJobsite.id);
  } 

// inserting data for timesheet testing, be sure to comment out if data exists
  for (const TimeSheet of initialTimeSheets) {
    const newTimeSheet = await prisma.timeSheet.create({
      data: TimeSheet,  
    });
    console.log("created timesheet with id: ", newTimeSheet.id);
  }

  // inserting general crew data
  for (const crew of initialCrews)  {
    const newCrew = await prisma.crew.create({
      data: crew,  
    });
    console.log("created crew with id: ", newCrew.id);
  }


// inserting data for my team testing
  for (const CrewMember of initialCrewMembers)  {
    const newCrewMember = await prisma.crewMember.create({
      data: CrewMember,  
    });
    console.log("created crew member with id: ", newCrewMember.id);
  }
  // general message for ending data seeding
  console.log('Sample data upserted successfully!');


  //safety training 


  //inbox look to see if other data is needed


  // 


}
catch (error) {
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