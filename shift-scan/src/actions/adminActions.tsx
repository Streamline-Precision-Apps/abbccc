"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


export async function timecardData(formData: FormData) {
    const startDate = formData.get("start") as string;
    const endDate = formData.get("end") as string;

    const startOfDay = new Date(startDate);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(endDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const timeSheets = await prisma.timeSheet.findMany({
        where: {
            date: {
                gte: startOfDay.toISOString(),
                lte: endOfDay.toISOString(),
            },
        },
    });

    console.log("\n\n\nTimeSheets:", timeSheets);
    return timeSheets;
}

// Create jobsite admin
export async function createJobsite(formData: FormData) {
try {
    console.log("Creating jobsite...");
    console.log(formData);

    await prisma.jobsite.create({
    data: {
        jobsite_name: formData.get("jobsite_name") as string,
        street_number: (formData.get("street_number") as string) || null,
        street_name: formData.get("street_name") as string,
        city: formData.get("city") as string,
        state: (formData.get("state") as string) || null,
        country: formData.get("country") as string,
        jobsite_description: formData.get("jobsite_description") as string,
        comments: (formData.get("jobsite_comments") as string) || null,
        jobsite_active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    });
    console.log("Jobsite created successfully.");

    // Revalidate the path
    revalidatePath(`/admin/assets`);

} catch (error) {
    console.error("Error creating jobsite:", error);
    throw error;
}
}

export async function updateJobsite(formData: FormData) {

    try {
        console.log("Updating jobsite...");
        console.log(formData);
        const jobsite_name = formData.get("jobsite_name") as string;
        const street_number = formData.get("street_number") as string;
        const street_name = formData.get("street_name") as string;
        const city = formData.get("city") as string;
        const state = formData.get("state") as string;
        const country = formData.get("country") as string;
        const jobsite_description = formData.get("jobsite_description") as string;
        const comments = formData.get("jobsite_comments") as string;
        const jobsite_active = Boolean(formData.get("jobsite_active") as string);
        const jobsite_id = Number(formData.get("id") as string);
        const jobsite = await prisma.jobsite.update({
            where: {
                id: jobsite_id
            },
            data: {
                jobsite_name: jobsite_name,
                street_number: street_number,
                street_name: street_name,
                city: city,
                state: state,
                country: country,
                jobsite_description: jobsite_description,
                comments: comments,
                jobsite_active: jobsite_active
            }
        })
        revalidatePath(`/admin/assets`);

    } catch (error) {
        console.error("Error updating jobsite:", error);
        throw error;
    }

}

// Fetch first jobsite
export async function fetchByNameJobsite( jobsite_name: string ) {

    const jobsite = await prisma.jobsite.findFirst({
        where: {
            jobsite_name: jobsite_name
        }
    })
    revalidatePath(`/admin/assets`);
    return jobsite
}

// Delete jobsite by id
export async function deleteJobsite(formData: FormData) {
    const id = Number(formData.get("id") as string);
    try {
        await prisma.jobsite.delete({
        where: { id: id },
        });
        revalidatePath(`/admin/assets`);
        return true;
    } catch (error) {
        console.error("Error deleting jobsite:", error);
        throw error;
    }
    }

export async function editGeneratedJobsite( formData: FormData ) {
    try {
        const id = Number(formData.get("id") as string);
        const jobsite_name = formData.get("jobsite_name") as string;
        const jobsite_id = formData.get("jobsite_id") as string;

        await prisma.jobsite.update({
            where: {
                id: id
            },
            data: {
                jobsite_name: jobsite_name,
                jobsite_id: jobsite_id
            }
        })

        revalidatePath(`/admin/assets`);

        return;

    } catch (error) {
        console.error("Error editing generated jobsite:", error);
        throw error;
    }
}