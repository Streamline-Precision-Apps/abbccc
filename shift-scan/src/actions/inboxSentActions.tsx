"use server";

import prisma from "@/lib/prisma";
import { FormStatus, PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation";

export async function getUserSentContent(user_id: string | undefined) {
    if (!user_id) return
    const sentContent = await prisma.timeoffRequestForm.findMany({
        where: {
            employee_id: user_id,
        }
    })
    return sentContent
}
export async function createLeaveRequest(formData: FormData) {
    // do we want to restrict the amount of requests that can be made?
    // do we want  to check if the user has a pending request already that match the dates and type of request
    try {
    console.log(formData)
    const user_id = formData.get("user_id") as string;
    const requestType = formData.get("requestType") as string;
    const status = formData.get("status") as string;
    
    if (status) {
        const result = await prisma.timeoffRequestForm.create({
        data: {
            date: new Date(formData.get("date") as string),
            requestedStartDate: new Date(formData.get("startDate") as string),
            requestedEndDate: new Date(formData.get("endDate") as string),
            requestType: requestType,
            comments: formData.get("description") as string,
            mangerComments : null,
            status: status as FormStatus,
            employee_id: user_id,
        }
        })
        console.log(result)
        revalidatePath("/hamburger/inbox");
    }
} catch (error) {
    console.log(error)
}
}

export async function EditLeaveRequest(formData: FormData) {
    try {
        console.log(formData)
        const user_id = formData.get("user_id") as string;
        const requestType = formData.get("requestType") as string;
        const status = formData.get("status") as string;
        
        if (status) {
            const result = await prisma.timeoffRequestForm.update({
            where: { id: Number(formData.get("id") as string) },
            data: {
            date: new Date(formData.get("date") as string),
            requestedStartDate: new Date(formData.get("startDate") as string),
            requestedEndDate: new Date(formData.get("endDate") as string),
            requestType: requestType,
            comments: formData.get("description") as string,
            mangerComments : null,
            status: status as FormStatus,
            employee_id: user_id,
            }
            })
            console.log(result)
            revalidatePath("/hamburger/inbox");
        }
    } catch (error) {
        console.log(error)
    }

}

export async function DeleteLeaveRequest(id : string, user_id : string | undefined) {
    try {
        const deleteId = Number(id)

    const userCheck = await prisma.timeoffRequestForm.findMany({
        where: {
            id: deleteId,
            employee_id: user_id
        }
    })

    if (userCheck.length > 0) {
        await prisma.timeoffRequestForm.delete({
            where: { id: deleteId },
        });
        revalidatePath("/hamburger/inbox");
        redirect("/hamburger/inbox");
    }
    else {
        throw new Error("You do not have permission to delete this request");
    }

} catch (error) {
    console.error("Failed to delete request:", error);
}
}