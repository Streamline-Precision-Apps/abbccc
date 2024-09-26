"use server";

import { Bases } from '@/components/(reusable)/bases';
import EmployeeInfo from './employeeInfo';
import prisma from "@/lib/prisma";
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Employee, Contact, UserTraining } from '@/lib/types';
import { Contents } from '@/components/(reusable)/contents';

export default async function EmployeeProfile() {
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) {
        redirect('/signin');
    }

    const employee = await prisma.users.findUnique({
        where: {
            id: userId.toString(),
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            image: true,
        },
    });

    if (!employee) {
        redirect('/signin');
    }

    const contacts = await prisma.contacts.findUnique({
        where: {
            employeeId: userId.toString(),
        },
        select: {
            phoneNumber: true,
            email: true,
            emergencyContact: true,
            emergencyContactNumber: true,
        },
    });

    if (!contacts) {
        redirect('/signin');
    }

    const userTrainingsWithDetails = await prisma.userTrainings.findMany({
        where: {
          userId: userId,  // Replace with the actual userId
        },
        include: {
          Training: true,  // Include the associated Training details
        },
    });

    return (
        <Bases>
            <EmployeeInfo employee={employee} contacts={contacts} training={userTrainingsWithDetails}/>
        </Bases>
    );
}