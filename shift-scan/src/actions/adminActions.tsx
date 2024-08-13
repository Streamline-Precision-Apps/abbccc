"use server";
import prisma from "@/lib/prisma";


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
