"use server";
import prisma from "@/lib/prisma";
import { permission } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createUser(formData: FormData) {
try{
    await prisma.user.create({
        data: {
            firstName: formData.get('firstName') as string,
            lastName: formData.get('lastName') as string,
            username: formData.get('username') as string,
            password: formData.get('password') as string,
            truck_view: (formData.get('truck_view') as unknown as boolean),
            tasco_view: (formData.get('tasco_view')as unknown  as boolean),
            labor_view: (formData.get('labor_view')as unknown  as boolean),
            mechanic_view: (formData.get('mechanic_view') as unknown as boolean),
            permission: formData.get('permission') as permission,
            email: formData.get('email') as string,
            emailVerified: formData.get('emailVerified') as string,
            phone: formData.get('phone') as string,
            image: formData.get('image') as string,
        }
    });
} catch(error){
    console.log(error);
}
    revalidatePath('/');
}

export async function updateUser(formData: FormData, id: string) {
    await prisma.user.update({
        where: { id },
        data: {
            firstName: formData.get('firstName') as string,
            lastName: formData.get('lastName') as string,
            username: formData.get('username') as string,
            password: formData.get('password') as string,
            truck_view: (formData.get('truck_view') as unknown as boolean),
            tasco_view: (formData.get('tasco_view')as unknown  as boolean),
            labor_view: (formData.get('labor_view')as unknown  as boolean),
            mechanic_view: (formData.get('mechanic_view') as unknown as boolean),
            permission: formData.get('permission') as permission,
            email: formData.get('email') as string,
            emailVerified: formData.get('emailVerified') as string,
            phone: formData.get('phone') as string,
            image: formData.get('image') as string,
        }
    });
}

export async function deleteUser(id: string) {
    await prisma.user.delete({
        where: { id },
    });
}


// we call these function by using a form action={...} in the form ... = post, delete, put, patch