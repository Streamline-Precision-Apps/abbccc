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

    // Fetch the 5 most recent unique cost codes for the authenticated user
    const recentCostCodes = await prisma.timeSheets.groupBy({
        by: ['costcode'], // Group by costCodeId to ensure uniqueness
        where: {
            userId: userId, // Filter by the authenticated user
        },
        orderBy: {
            _max: {
                date: 'desc', // Order by the most recent log entry for each cost code
            },
        },
        take: 5, // Limit the result to 5 unique cost codes
        _max: {
            date: true, // Get the most recent date for each cost code
        },
    });

    // Fetch full cost code details based on the grouped costCode IDs
    const costCodeDetails = await Promise.all(
        recentCostCodes.map(async (log) => {
            return prisma.costCodes.findUnique({
                where: {
                    name: log.costcode,
                },
                select: {
                    id: true,
                    name: true,
                    description: true,
                },
            });
        })
    );

    return NextResponse.json(costCodeDetails);
}