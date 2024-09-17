"use server";

import prisma from "@/lib/prisma";
import { FormStatus} from "@prisma/client";
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation";

export async function getUserSentContent(user_id: string | undefined) {
    if (!user_id) return
    const sentContent = await prisma.timeoffRequestForms.findMany({
        where: {
            employeeId: user_id,
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
        const result = await prisma.timeoffRequestForms.create({
        data: {
            date: new Date(formData.get("date") as string),
            requestedStartDate: new Date(formData.get("startDate") as string),
            requestedEndDate: new Date(formData.get("endDate") as string),
            requestType: requestType,
            comment: formData.get("description") as string,
            managerComment : null,
            status: status as FormStatus,
            employeeId: user_id,
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
            const result = await prisma.timeoffRequestForms.update({
            where: { id: Number(formData.get("id") as string) },
            data: {
            date: new Date(formData.get("date") as string),
            requestedStartDate: new Date(formData.get("startDate") as string),
            requestedEndDate: new Date(formData.get("endDate") as string),
            requestType: requestType,
            comment: formData.get("description") as string,
            managerComment : null,
            status: status as FormStatus,
            employeeId: user_id,
            }
            })
            console.log(result)
            revalidatePath("/hamburger/inbox/recieved");
        }
    } catch (error) {
        console.log(error)
    }

}
export async function ManagerLeaveRequest(formData: FormData) {
    try {
        console.log(formData)
        const managerComment = formData.get("managerComment") as string
        const status = formData.get("decision") as string;
        const name = formData.get("decidedBy") as string;
        console.log(managerComment, status, name)
        if (status) {
            const result = await prisma.timeoffRequestForms.update({
            where: { id: Number(formData.get("id") as string) },
            data: {
            managerComment : managerComment,
            status: status as FormStatus,
            decidedBy: name,
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

    const userCheck = await prisma.timeoffRequestForms.findMany({
        where: {
            id: deleteId,
            employeeId: user_id
        }
    })

    if (userCheck.length > 0) {
        await prisma.timeoffRequestForms.delete({
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