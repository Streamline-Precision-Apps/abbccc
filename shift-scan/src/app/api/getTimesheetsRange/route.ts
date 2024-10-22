"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(request: Request) {
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const startDateParam = url.searchParams.get('start');
    const endDateParam = url.searchParams.get('end');

    try {
        let timesheets;

        if (startDateParam && endDateParam) {
            // Fetch timesheets only for the specified date
            const startDate = new Date(startDateParam);
            startDate.setUTCHours(0, 0, 0, 0);
            const endDate = new Date(endDateParam);
            endDate.setUTCHours(23, 59, 59, 999);

            timesheets = await prisma.timeSheets.findMany({ 
                where: { 
                    userId: userId,
                    date: {
                        gte: startDate,
                        lt: endDate
                    }
                },
                orderBy: { date: 'desc' }
            });
        } else {
            // Fetch all timesheets if no date is provided
            timesheets = await prisma.timeSheets.findMany({ 
                where: { 
                    userId: userId,
                },
                orderBy: { date: 'desc' }
            });
        }

        return NextResponse.json(timesheets);

    } catch (error) {
        console.error("Error fetching Time Sheets:", error);
        return NextResponse.json({ error: "Failed to fetch pay period sheets" }, { status: 500 });
    }
}