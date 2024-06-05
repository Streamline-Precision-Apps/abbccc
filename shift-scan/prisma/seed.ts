import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    const employee = await prisma.employee.upsert({
        where: { employee_id: 1 },
        update: {},
        create: {
            employee_first_name: 'John',
            employee_last_name: 'Doe',
            employee_id: 1,
            employee_last_name_2: 'Doe',
            employee_dob: new Date('1990-01-01'),
            employee_availability: 'MTWRF 6am - 10pm',
            employee_start_date: new Date('2022-01-01'),
            createdAt: new Date('2022-01-01'),
            updatedAt: new Date('2022-01-01'),
            
        },
    });
    console.log({employee});
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