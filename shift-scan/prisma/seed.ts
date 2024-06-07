import { PrismaClient } from "@prisma/client";
import workerData from "../json/worker-data.json";

const prisma = new PrismaClient();

async function main() {
    const employees = [
        {
            employee_first_name: 'Jessica',
            employee_last_name: 'Rabbit',
            employee_id: 1,
            employee_last_name_2: 'Bunny',
            employee_dob: new Date('1990-01-01'),
            employee_availability: 'MTWRF 6am - 10pm',
            employee_start_date: new Date('2022-01-01'),
            createdAt: new Date('2022-01-01'),
            updatedAt: new Date('2022-01-01')
        },
        {
            employee_first_name: 'Rodger',
            employee_last_name: 'Rabbit',
            employee_id: 2,
            employee_last_name_2: 'Bunny',
            employee_dob: new Date('1990-01-01'),
            employee_availability: 'MTWRF 6am - 10pm',
            employee_start_date: new Date('2022-01-01'),
            createdAt: new Date('2022-01-01'),
            updatedAt: new Date('2022-01-01')
        },
        {
            employee_first_name: 'Buggs',
            employee_last_name: 'Bunny',
            employee_id: 3,
            employee_last_name_2: null,
            employee_dob: new Date('1990-01-01'),
            employee_availability: 'MTWRF 6am - 10pm',
            employee_start_date: new Date('2022-01-01'),
            createdAt: new Date('2022-01-01'),
            updatedAt: new Date('2022-01-01')
        },
        {
            employee_first_name: 'Lola',
            employee_last_name: 'Bunny',
            employee_id: 4,
            employee_last_name_2: null,
            employee_dob: new Date('1990-01-01'),
            employee_availability: 'MTWRF 6am - 10pm',
            employee_start_date: new Date('2022-01-01'),
            createdAt: new Date('2022-01-01'),
            updatedAt: new Date('2022-01-01')
        },
        {
            employee_first_name: 'Devun',
            employee_last_name: 'Durst',
            employee_id: 5,
            employee_last_name_2: null,
            employee_dob: new Date('1990-01-01'),
            employee_availability: 'MTWRF 6am - 10pm',
            employee_start_date: new Date('2022-01-01'),
            createdAt: new Date('2022-01-01'),
            updatedAt: new Date('2022-01-01')
        }
    ];

    for (const employeeData of employees) {
        const employee = await prisma.employee.upsert({
            where: { employee_id: employeeData.employee_id },
            update: {},
            create: employeeData
        });
        console.log({ employee });
    }
    const employeeAccounts = [
        {
            employee_id: 1,
            employee_username: 'jessica_rabbit',
            employee_password: 'password123',
            employee_privilege_level: 'USER'
        },
        {
            employee_id: 2,
            employee_username: 'rodger_rabbit',
            employee_password: 'password123',
            employee_privilege_level: 'USER'
        },
        {
            employee_id: 3,
            employee_username: 'buggs_bunny',
            employee_password: 'password123',
            employee_privilege_level: 'USER'
        },
        {
            employee_id: 4,
            employee_username: 'lola_bunny',
            employee_password: 'password123',
            employee_privilege_level: 'USER'
        },
        {
            employee_id: 5,
            employee_username: 'devun_durst',
            employee_password: 'password123',
            employee_privilege_level: 'USER'
        }
    ];

    for (const accountData of employeeAccounts) {
        const employeeAccount = await prisma.employeeAccount.upsert({
            where: { employee_id: accountData.employee_id },
            update: {},
            create: accountData
        });
        console.log({ employeeAccount });
    }

    // Add more seeding logic for other models
    // Jobsite, TimeSheet, Vehicle, Trailer, EmployeeEquipmentLog, Equipment, JobsiteEquipmentLog, CostCodeJobsite, CostCode, CrewMember, Crew, EmployeePosition, Position, Contact, ContactJoin, AddressPeople, Address, AddressJobsite, JobLocation, FormData, EmployeeView, View

    const jobsites = [
        {
            jobsite_name: 'Downtown Construction',
            jobsite_active: true
        },
        {
            jobsite_name: 'Eastside Renovation',
            jobsite_active: true
        }
    ];

    for (const jobsiteData of jobsites) {
        const jobsite = await prisma.jobsite.create({
            data: jobsiteData
        });
        console.log({ jobsite });
    }

    const timesheets = [
        {
            employee_id: 1,
            jobsite_id: 1,
            costcode: 'CC101',
            start_time: new Date('2023-06-01T08:00:00Z'),
            end_time: new Date('2023-06-01T17:00:00Z'),
            duration: 8,
            timesheet_comments: 'Worked on foundation',
            app_comment: 'Good progress'
        },
        {
            employee_id: 2,
            jobsite_id: 1,
            costcode: 'CC102',
            start_time: new Date('2023-06-01T09:00:00Z'),
            end_time: new Date('2023-06-01T18:00:00Z'),
            duration: 8,
            timesheet_comments: 'Worked on plumbing',
            app_comment: 'Completed plumbing work'
        }
    ];

    for (const timesheetData of timesheets) {
        const timesheet = await prisma.timeSheet.create({
            data: timesheetData
        });
        console.log({ timesheet });
    }
    // Vehicles
    const vehicles = [
        {
            name: 'Truck A',
            vehicle_mileage: 12000,
            createdAt: new Date('2022-01-01'),
            updatedAt: new Date('2022-01-01')
        },
        {
            name: 'Truck B',
            vehicle_mileage: 15000,
            createdAt: new Date('2022-01-01'),
            updatedAt: new Date('2022-01-01')
        }
    ];

    for (const vehicleData of vehicles) {
        const vehicle = await prisma.vehicle.create({
            data: vehicleData
        });
        console.log({ vehicle });
    }

    // Trailers
    const trailers = [
        {
            name: 'Trailer 1',
            vehicle_mileage: 5000,
            createdAt: new Date('2022-01-01'),
            updatedAt: new Date('2022-01-01')
        },
        {
            name: 'Trailer 2',
            vehicle_mileage: 8000,
            createdAt: new Date('2022-01-01'),
            updatedAt: new Date('2022-01-01')
        }
    ];

    for (const trailerData of trailers) {
        const trailer = await prisma.trailer.create({
            data: trailerData
        });
        console.log({ trailer });
    }

    // Equipment
    const equipment = [
        {
            equipment_name: 'Excavator',
            equipment_description: 'Used for digging',
            equipment_status: true,
            equipment_tag: 'EXC-001',
            last_inspection: new Date('2023-06-01'),
            createdAt: new Date('2022-01-01'),
            updatedAt: new Date('2022-01-01')
        },
        {
            equipment_name: 'Bulldozer',
            equipment_description: 'Used for pushing soil',
            equipment_status: true,
            equipment_tag: 'BULL-001',
            last_inspection: new Date('2023-06-01'),
            createdAt: new Date('2022-01-01'),
            updatedAt: new Date('2022-01-01')
        }
    ];

    for (const equipmentData of equipment) {
        const equipmentItem = await prisma.equipment.create({
            data: equipmentData
        });
        console.log({ equipmentItem });
    }

    // Cost Codes
    const costCodes = [
        {
            cost_code: 'CC101',
            cost_code_description: 'Foundation work',
            cost_code_type: 'Labor',
            createdAt: new Date('2022-01-01'),
            updatedAt: new Date('2022-01-01')
        },
        {
            cost_code: 'CC102',
            cost_code_description: 'Plumbing work',
            cost_code_type: 'Labor',
            createdAt: new Date('2022-01-01'),
            updatedAt: new Date('2022-01-01')
        }
    ];

    for (const costCodeData of costCodes) {
        const costCode = await prisma.costCode.create({
            data: costCodeData
        });
        console.log({ costCode });
    }

    // Crew
    const crews = [
        {
            crew_name: 'Foundation Crew',
            crew_description: 'Responsible for foundation',
            jobsite_id: 1, // Make sure the jobsite_id exists in the Jobsite table
            createdAt: new Date('2022-01-01'),
            updatedAt: new Date('2022-01-01')
        },
        {
            crew_name: 'Plumbing Crew',
            crew_description: 'Responsible for plumbing',
            jobsite_id: 2, // Make sure the jobsite_id exists in the Jobsite table
            createdAt: new Date('2022-01-01'),
            updatedAt: new Date('2022-01-01')
        }
    ];

    for (const crewData of crews) {
        const crew = await prisma.crew.create({
            data: crewData
        });
        console.log({ crew });
    }

    // Positions
    const positions = [
        {
            position_name: 'Foreman',
            createdAt: new Date('2022-01-01'),
            updatedAt: new Date('2022-01-01')
        },
        {
            position_name: 'Laborer',
            createdAt: new Date('2022-01-01'),
            updatedAt: new Date('2022-01-01')
        }
    ];

    for (const positionData of positions) {
        const position = await prisma.position.create({
            data: positionData
        });
        console.log({ position });
    }

    // Contacts
    const contacts = [
        {
            phone_number: '123-456-7890',
            email: 'jessica@example.com',
            emergency_contact: 'Rodger Rabbit',
            emergency_contact_no: '098-765-4321',
            createdAt: new Date('2022-01-01'),
            updatedAt: new Date('2022-01-01')
        },
        {
            phone_number: '234-567-8901',
            email: 'rodger@example.com',
            emergency_contact: 'Jessica Rabbit',
            emergency_contact_no: '123-456-7890',
            createdAt: new Date('2022-01-01'),
            updatedAt: new Date('2022-01-01')
        }
    ];

    for (const contactData of contacts) {
        const contact = await prisma.contact.create({
            data: contactData
        });
        console.log({ contact });
    }

    // Addresses
    const addresses = [
        {
            street_no: 123,
            street_name: 'Main St',
            city: 'Anytown',
            state: 'CA',
            zipcode: 12345,
            country: 'USA',
            createdAt: new Date('2022-01-01'),
            updatedAt: new Date('2022-01-01')
        },
        {
            street_no: 456,
            street_name: 'Elm St',
            city: 'Othertown',
            state: 'TX',
            zipcode: 67890,
            country: 'USA',
            createdAt: new Date('2022-01-01'),
            updatedAt: new Date('2022-01-01')
        }
    ];

    for (const addressData of addresses) {
        const address = await prisma.address.create({
            data: addressData
        });
        console.log({ address });
    }

    // AddressPeople
    const addressPeople = [
        {
            address_id: 1, // Ensure this address_id exists in the Address table
            employee_id: 1, // Ensure this employee_id exists in the Employee table
            createdAt: new Date('2022-01-01'),
            updatedAt: new Date('2022-01-01')
        },
        {
            address_id: 2, // Ensure this address_id exists in the Address table
            employee_id: 2, // Ensure this employee_id exists in the Employee table
            createdAt: new Date('2022-01-01'),
            updatedAt: new Date('2022-01-01')
        }
    ];

    for (const addressPersonData of addressPeople) {
        const addressPerson = await prisma.addressPeople.create({
            data: addressPersonData
        });
        console.log({ addressPerson });
    }

    // AddressJobsite
    const addressJobsites = [
        {
            address_id: 1, // Ensure this address_id exists in the JobLocation table
            jobsite_id: 1, // Ensure this jobsite_id exists in the Jobsite table
            createdAt: new Date('2022-01-01'),
            updatedAt: new Date('2022-01-01')
        },
        {
            address_id: 2, // Ensure this address_id exists in the JobLocation table
            jobsite_id: 2, // Ensure this jobsite_id exists in the Jobsite table
            createdAt: new Date('2022-01-01'),
            updatedAt: new Date('2022-01-01')
        }
    ];

    for (const addressJobsiteData of addressJobsites) {
        const addressJobsite = await prisma.addressJobsite.create({
            data: addressJobsiteData
        });
        console.log({ addressJobsite });
    }

    // JobLocation
    const jobLocations = [
        {
            street_no: 789,
            street_name: 'Industrial Rd',
            city: 'Bigcity',
            state: 'NY',
            zipcode: 10112,
            country: 'USA',
            createdAt: new Date('2022-01-01'),
            updatedAt: new Date('2022-01-01')
        },
        {
            street_no: 101,
            street_name: 'Ocean Ave',
            city: 'Seaside',
            state: 'FL',
            zipcode: 20234,
            country: 'USA',
            createdAt: new Date('2022-01-01'),
            updatedAt: new Date('2022-01-01')
        }
    ];

    for (const jobLocationData of jobLocations) {
        const jobLocation = await prisma.jobLocation.create({
            data: jobLocationData
        });
        console.log({ jobLocation });
    }

    // EmployeeView
    const employeeViews = [
        {
            employee_id: 1, // Ensure this employee_id exists in the EmployeeAccount table
            view_id: 1, // Ensure this view_id exists in the View table
            createdAt: new Date('2022-01-01'),
            updatedAt: new Date('2022-01-01')
        },
        {
            employee_id: 2, // Ensure this employee_id exists in the EmployeeAccount table
            view_id: 2, // Ensure this view_id exists in the View table
            createdAt: new Date('2022-01-01'),
            updatedAt: new Date('2022-01-01')
        }
    ];

    for (const employeeViewData of employeeViews) {
        const employeeView = await prisma.employeeView.create({
            data: employeeViewData
        });
        console.log({ employeeView });
    }


    // Add additional data seeding as needed
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