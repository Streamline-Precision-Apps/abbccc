"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Calculate the start date of the current pay period
    const calculatePayPeriodStart = () => {
        const startDate = new Date(2024, 7, 5); // August 5, 2024
        const now = new Date();
        const diff = now.getTime() - startDate.getTime();
        const diffWeeks = Math.floor(diff / (2 * 7 * 24 * 60 * 60 * 1000)); // Two-week intervals
        return new Date(startDate.getTime() + diffWeeks * 2 * 7 * 24 * 60 * 60 * 1000);
    };

    // Calculate the start date of the current pay period
    const payPeriodStart = calculatePayPeriodStart();

    // Get the current date/time (right now)
    const currentDate = new Date();

    try {
        // Fetch timesheets for the current pay period and filter out entries without duration
        const payPeriodSheets = await prisma.timeSheets.findMany({
            where: {
                userId: userId,
                startTime: {
                    gte: payPeriodStart, // Start of the pay period
                    lte: currentDate,    // Up until the current date/time
                },
            },
            select: {
                startTime: true,
                duration: true,
            },
        });
    // Filter out sheets where duration is null
const validSheets = payPeriodSheets.filter((sheet) => sheet.duration !== null);

        // Return the filtered timesheets
        return NextResponse.json(validSheets);

    } catch (error) {
        console.error("Error fetching pay period sheets:", error);
        return NextResponse.json({ error: "Failed to fetch pay period sheets" }, { status: 500 });
    }
}