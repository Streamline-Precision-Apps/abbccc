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

    // Fetch the 5 most recent unique job sites for the authenticated user
    const recentJobSites = await prisma.timeSheets.groupBy({
        by: ['jobsiteId'], // Group by jobsiteId to ensure uniqueness
        where: {
            userId: userId, // Filter by the authenticated user
        },
        orderBy: {
            _max: {
                date: 'desc', // Order by the most recent log entry for each job site
            },
        },
        take: 5, // Limit the result to 5 unique job sites
        _max: {
            date: true, // Get the most recent date for each job site
        },
    });

    // Fetch full jobsite details based on the grouped jobsite IDs
    const jobsiteDetails = await Promise.all(
        recentJobSites.map(async (log) => {
            return prisma.jobsites.findUnique({
                where: {
                    id: log.jobsiteId,
                },
                select: {
                    id: true,
                    qrId: true,
                    description: true,
                },
            });
        })
    );

    return NextResponse.json(jobsiteDetails);
}