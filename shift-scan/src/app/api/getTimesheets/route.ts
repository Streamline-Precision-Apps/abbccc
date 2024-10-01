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
    const dateParam = url.searchParams.get('date');

    try {
        let timesheets;

        if (dateParam) {
            // Fetch timesheets only for the specified date
            const date = new Date(dateParam);
            const nextDay = new Date(date);
            nextDay.setDate(date.getDate() + 1); // Set to the next day for range filtering

            timesheets = await prisma.timeSheets.findMany({ 
                where: { 
                    userId: userId,
                    date: {
                        gte: date,
                        lt: nextDay
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