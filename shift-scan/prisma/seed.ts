import { PrismaClient, permission } from "@prisma/client";
import workerData from "../json/worker-data.json";

const prisma = new PrismaClient();

async function upsertWorkerData(worker: any) {
  const {
    employee,
    employeeAccount,
    employeePosition,
    position,
    contact,
    contactJoin,
    address,
    addressAssigner
  } = worker;

  await prisma.position.upsert({
    where: { position_id: position.position_id },
    update: {
      position_name: position.position_name,
      createdAt: position.createdAt,
      updatedAt: position.updatedAt,
    },
    create: position,
  });

  await prisma.employee.upsert({
    where: { employee_id: employee.employee_id },
    update: {
      employee_first_name: employee.employee_first_name,
      employee_last_name: employee.employee_last_name,
      employee_last_name_2: employee.employee_last_name_2,
      employee_dob: employee.employee_dob,
      employee_availability: employee.employee_availability,
      employee_start_date: employee.employee_start_date,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
    },
    create: employee,
  });
  // i changed the employeeAccount to user and account for prisma next auth to function.
  await prisma.employeeAccount.upsert({
    where: { account_id: employeeAccount.account_id },
    update: {
      employee_id: employeeAccount.employee_id,
      employee_username: employeeAccount.employee_username,
      employee_password: employeeAccount.employee_password,
      employee_truck_view: employeeAccount.employee_truck_view,
      employee_tasco_view: employeeAccount.employee_tasco_view,
      employee_labor_view: employeeAccount.employee_labor_view,
      employee_privilege_level: permission[employeeAccount.employee_privilege_level as keyof typeof permission],
      createdAt: employeeAccount.createdAt,
      updatedAt: employeeAccount.updatedAt,
    },
    create: {
      ...employeeAccount,
      employee_privilege_level: permission[employeeAccount.employee_privilege_level as keyof typeof permission],
    },
  });

  await prisma.employeePosition.upsert({
    where: { employee_positions_id: employeePosition.employee_positions_id },
    update: {
      employee_id: employeePosition.employee_id,
      position_id: employeePosition.position_id,
      createdAt: employeePosition.createdAt,
      updatedAt: employeePosition.updatedAt,
    },
    create: employeePosition,
  });

  await prisma.contact.upsert({
    where: { contact_id: contact.contact_id },
    update: {
      phone_number: contact.phone_number,
      email: contact.email,
      emergency_contact: contact.emergency_contact,
      emergency_contact_no: contact.emergency_contact_no,
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt,
    },
    create: contact,
  });

  await prisma.contactJoin.upsert({
    where: { contact_join_id: contactJoin.contact_join_id },
    update: {
      contact_id: contactJoin.contact_id,
      employee_id: contactJoin.employee_id,
      createdAt: contactJoin.createdAt,
      updatedAt: contactJoin.updatedAt,
    },
    create: contactJoin,
  });

  await prisma.address.upsert({
    where: { address_id: address.address_id },
    update: {
      street_no: address.street_no,
      street_name: address.street_name,
      city: address.city,
      state: address.state,
      zipcode: address.zipcode,
      country: address.country,
      createdAt: address.createdAt,
      updatedAt: address.updatedAt,
    },
    create: address,
  });

  await prisma.addressAssigner.upsert({
    where: { address_assigner_id: addressAssigner.address_assigner_id },
    update: {
      address_id: addressAssigner.address_id,
      employee_id: addressAssigner.employee_id,
      jobsite_id: addressAssigner.jobsite_id,
      createdAt: addressAssigner.createdAt,
      updatedAt: addressAssigner.updatedAt,
    },
    create: addressAssigner,
  });

}

async function main() {
    const { workers } = workerData;
    
    for (const worker of workers) {
        await upsertWorkerData(worker);
    }

    console.log('Sample data upserted successfully!');
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