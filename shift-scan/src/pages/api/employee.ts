import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const employee = await prisma.employee.findUnique({
                where: { employee_id: 1 }, // Adjust the ID as needed
            });

            if (employee) {
                const response = {
                    firstName: employee.employee_first_name,
                    lastName: employee.employee_last_name,
                    payPeriodHours: "40.00",
                    date: "05-03-2024",
                };
                res.status(200).json(response);
            } else {
                res.status(404).json({ error: 'Employee not found' });
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            res.status(500).json({ error: 'Error fetching data' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}