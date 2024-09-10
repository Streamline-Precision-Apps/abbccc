"use server";
import prisma from "@/lib/prisma";
import { Permission } from "@prisma/client";
import { revalidatePath } from "next/cache";
import bcrypt from 'bcryptjs';

export async function createUser(formData: FormData) {
try{
    console.log("Creating user:", formData);
    await prisma.user.create({
        data: {
            firstName: formData.get('firstName') as string,
            lastName: formData.get('lastName') as string,
            username: formData.get('username') as string,
            password: formData.get('password') as string,
            DOB: formData.get('DOB') as string,
            truck_view: (Boolean(formData.get('truck_view')) as unknown as boolean),
            tasco_view: (Boolean(formData.get('tasco_view')) as unknown  as boolean),
            labor_view: (Boolean(formData.get('labor_view')) as unknown  as boolean),
            mechanic_view: (Boolean(formData.get('mechanic_view')) as unknown as boolean),
            permission: formData.get('permission') as Permission,
            email: formData.get('email') as string,
            emailVerified: formData.get('emailVerified') as string,
            phone: formData.get('phone') as string,
            image: formData.get('image') as string,
        }
    });
    console.log("User created successfully.");
} catch(error){
    console.log(error);
}
    revalidatePath('/');
}

export async function updateUser(formData: FormData) {
    await prisma.user.update({
        where: { id: formData.get('id') as string },
        data: {
            firstName: formData.get('firstName') as string,
            lastName: formData.get('lastName') as string,
            username: formData.get('username') as string,
            DOB: formData.get('DOB') as string,
            truck_view: formData.get('truck_view') === 'true',
            tasco_view: formData.get('tasco_view') === 'true',
            labor_view: formData.get('labor_view') === 'true',
            mechanic_view: formData.get('mechanic_view') === 'true',
            permission: formData.get('permission') as Permission,
            email: formData.get('email') as string,
            emailVerified: formData.get('emailVerified') as string,
            phone: formData.get('phone') as string,
            image: formData.get('image') as string,
        }
    });
}


export async function deleteUser(formData: FormData) {
    const id = formData.get('id') as string;
    await prisma.user.delete({
        where: { id },
    });
}



export async function uploadImage(formdata: FormData) {
    console.log(formdata);
    await prisma.user.update({
        where: { id: formdata.get('id') as string },
        data: {
            image: formdata.get('image') as string
        }
    })
    revalidatePath('/hamburger/profile');
}

export async function uploadFirstImage(formdata: FormData) {
    console.log(formdata);
    await prisma.user.update({
        where: { id: formdata.get('id') as string },
        data: {
            image: formdata.get('image') as string
        }
    })
}

export async function uploadFirstSignature(formdata: FormData) {
    console.log(formdata);
    await prisma.user.update({
        where: { id: formdata.get('id') as string },
        data: {
            Signature: formdata.get('Signature') as string
        }
    })
}

export async function setUserSettings(formdata: FormData) {
    console.log(formdata);
    await prisma.userSettings.update({
        where: { userId: formdata.get('id') as string },
        data: {
            approvedRequests: formdata.get('approvedRequests') === 'true',
            timeoffRequests: formdata.get('timeoffRequests') === 'true',
            GeneralReminders: formdata.get('GeneralReminders') === 'true',
        }
    });
}


export async function fetchByNameUser(name: string) {
    try {
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { firstName: { contains: name, mode: 'insensitive' } },
                    { lastName: { contains: name, mode: 'insensitive' } }
                ]
            }
        });
        console.log(user);
        return user;
    } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
    }
}


export async function getUserFromDb(username: string, password: string) {
    const user = await prisma.user.findUnique({
        where: {
            username: username,
            password: password
        }
    })
    if (user) {
        if (await bcrypt.compare(password, user.password)) {
            return user
        }
    }
    return null
}

export async function finishUserSetup(id: string) {
    await prisma.user.update({
        where: { id: id },
        data: {
            accountSetup: true
        }
    })
}

export async function setUserPassword(formData: FormData) {
    await prisma.user.update({
        where: { id: formData.get('id') as string },
        data: {
            password: formData.get('password') as string
        }
    })
}
