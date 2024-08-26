"use server";

import { Bases } from '@/components/(reusable)/bases';
import SignOutModal from './signOutModal';
import EmployeeInfo from './employeeInfo';
import prisma from "@/lib/prisma";
import { cookies } from 'next/headers';
import Base64Encoder from '@/components/(inputs)/Base64Encoder';
import { auth } from '@/auth';

type Employee = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
};

type Contact = {
    phone_number: string;
    email: string;
    emergency_contact: string;
    emergency_contact_no: string;
};

type Training = {
    id: number;
    user_id: string;
    completed_trainings: number;
    assigned_trainings: number;
    completion: boolean;
    trainings: JSON;
};

export default async function EmployeeProfile() {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return (
            <Bases >
                <div>Error: User not found</div>
            </Bases>
        );
    }

    const employee = await prisma.user.findUnique({
        where: {
            id: userId.toString(),
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            image: true,
        },
    });

    if (!employee) {
        return (
            <Bases >
                <div>Error: Employee not found</div>
            </Bases>
        );
    }

    const contacts = await prisma.contact.findUnique({
        where: {
            employee_id: userId.toString(),
        },
        select: {
            phone_number: true,
            email: true,
            emergency_contact: true,
            emergency_contact_no: true,
        },
    });

    if (!contacts) {
        return (
            <Bases>
                <div>Error: Contacts not found</div>
            </Bases>
        );
    }

    const training = await prisma.userTrainings.findUnique({
        where: {
            user_id: userId.toString(),
        },
        select: {
            id: true,
            user_id: true,
            completed_trainings: true,
            assigned_trainings: true,
            completion: true,
        },
    });

    return (
        <Bases>
            <EmployeeInfo employee={employee} contacts={contacts} training={training}/>
            <SignOutModal userid={userId} />
        </Bases>
    );
}