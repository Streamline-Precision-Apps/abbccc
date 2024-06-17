import { PrismaClient} from "@prisma/client";
import workerData from "../json/worker-data.json";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function upsertWorkerData(worker: any) {
  const { user, employee, employeeAccount, employeePosition, position, contact, contactJoin, address, addressAssigner } = worker;

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
    where: { position_id: position.position_id },
    update: {
      position_name: position.position_name,
      createdAt: new Date(position.createdAt),
      updatedAt: new Date(position.updatedAt),
    },
    create: {
      position_id: position.position_id,
      position_name: position.position_name,
      createdAt: new Date(position.createdAt),
      updatedAt: new Date(position.updatedAt),
    },
  });

  // Upsert employee
  await prisma.employee.upsert({
    where: { employee_id: employee.employee_id },
    update: {
      employee_first_name: employee.employee_first_name,
      employee_middle_name: employee.employee_middle_name || null,
      employee_last_name: employee.employee_last_name,
      employee_dob: new Date(employee.employee_dob),
      employee_availability: employee.employee_availability,
      employee_start_date: new Date(employee.employee_start_date),
      employee_termination_date: employee.employee_termination_date ? new Date(employee.employee_termination_date) : null,
      createdAt: new Date(employee.createdAt),
      updatedAt: new Date(employee.updatedAt),
    },
    create: {
      employee_id: employee.employee_id,
      employee_first_name: employee.employee_first_name,
      employee_middle_name: employee.employee_middle_name || null,
      employee_last_name: employee.employee_last_name,
      employee_dob: new Date(employee.employee_dob),
      employee_availability: employee.employee_availability,
      employee_start_date: new Date(employee.employee_start_date),
      employee_termination_date: employee.employee_termination_date ? new Date(employee.employee_termination_date) : null,
      createdAt: new Date(employee.createdAt),
      updatedAt: new Date(employee.updatedAt),
    },
  });


  // Upsert employee position
  await prisma.employeePosition.upsert({
    where: { employee_positions_id: employeePosition.employee_positions_id },
    update: {
      employee_id: employeePosition.employee_id,
      position_id: employeePosition.position_id,
      createdAt: new Date(employeePosition.createdAt),
      updatedAt: new Date(employeePosition.updatedAt),
    },
    create: {
      employee_positions_id: employeePosition.employee_positions_id,
      employee_id: employeePosition.employee_id,
      position_id: employeePosition.position_id,
      createdAt: new Date(employeePosition.createdAt),
      updatedAt: new Date(employeePosition.updatedAt),
    },
  });

  // Upsert contact
  await prisma.contact.upsert({
    where: { contact_id: contact.contact_id },
    update: {
      phone_number: contact.phone_number,
      email: contact.email,
      emergency_contact: contact.emergency_contact,
      emergency_contact_no: contact.emergency_contact_no,
      createdAt: new Date(contact.createdAt),
      updatedAt: new Date(contact.updatedAt),
    },
    create: {
      contact_id: contact.contact_id,
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
    where: { contact_join_id: contactJoin.contact_join_id },
    update: {
      contact_id: contactJoin.contact_id,
      employee_id: contactJoin.employee_id,
      createdAt: new Date(contactJoin.createdAt),
      updatedAt: new Date(contactJoin.updatedAt),
    },
    create: {
      contact_join_id: contactJoin.contact_join_id,
      contact_id: contactJoin.contact_id,
      employee_id: contactJoin.employee_id,
      createdAt: new Date(contactJoin.createdAt),
      updatedAt: new Date(contactJoin.updatedAt),
    },
  });

  // Upsert address
  await prisma.address.upsert({
    where: { address_id: address.address_id },
    update: {
      street_no: address.street_no,
      street_name: address.street_name,
      city: address.city,
      state: address.state,
      zipcode: address.zipcode,
      country: address.country,
      createdAt: new Date(address.createdAt),
      updatedAt: new Date(address.updatedAt),
    },
    create: {
      address_id: address.address_id,
      street_no: address.street_no,
      street_name: address.street_name,
      city: address.city,
      state: address.state,
      zipcode: address.zipcode,
      country: address.country,
      createdAt: new Date(address.createdAt),
      updatedAt: new Date(address.updatedAt),
    },
  });

  // Upsert address assigner
  await prisma.addressAssigner.upsert({
    where: { address_assigner_id: addressAssigner.address_assigner_id },
    update: {
      address_id: addressAssigner.address_id,
      employee_id: addressAssigner.employee_id,
      jobsite_id: addressAssigner.jobsite_id,
      createdAt: new Date(addressAssigner.createdAt),
      updatedAt: new Date(addressAssigner.updatedAt),
    },
    create: {
      address_assigner_id: addressAssigner.address_assigner_id,
      address_id: addressAssigner.address_id,
      employee_id: addressAssigner.employee_id,
      jobsite_id: addressAssigner.jobsite_id,
      createdAt: new Date(addressAssigner.createdAt),
      updatedAt: new Date(addressAssigner.updatedAt),
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