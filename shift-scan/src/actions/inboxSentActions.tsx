"use server"
import { FormStatus, PrismaClient } from "@prisma/client";
import { request } from "http";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
const prisma = new PrismaClient();

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

}

export async function DeleteLeaveRequest(formData: FormData) {
    try {
        console.log(formData);

        const id = Number(formData.get('id') as string);

        await prisma.timeoffRequestForm.delete({
            where: { id: id },
        });

        revalidatePath("/hamburger/inbox");
        redirect("/hamburger/inbox");
    } catch (error) {
        console.error("Failed to delete request:", error);
    }
}