import { PrismaClient } from "@prisma/client";
import workerData from "@/data/worker-data.json";
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
      dob: new Date(employee.dob),
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
      dob: new Date(employee.dob),
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
  await prisma.contactJoin.upsert({
    where: { id: contactJoin.id },
    update: {
      contact_id: contactJoin.contact_id,
      employee_id: contactJoin.employee_id,
      createdAt: new Date(contactJoin.createdAt),
      updatedAt: new Date(contactJoin.updatedAt),
    },
    create: {
      id: contactJoin.id,
      contact_id: contactJoin.contact_id,
      employee_id: contactJoin.employee_id,
      createdAt: new Date(contactJoin.createdAt),
      updatedAt: new Date(contactJoin.updatedAt),
    },
  });

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