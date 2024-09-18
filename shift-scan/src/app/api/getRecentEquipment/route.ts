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

    const recentEquipment = await prisma.employeeEquipmentLogs.findMany({
        where: {
            employeeId: userId, // Filter by the authenticated user
        },
        orderBy: {
            date: 'desc', // Order by the log date in descending order
        },
        take: 5, // Limit the result to the most recent 5 entries
        select: {
            Equipment: {
                select: {
                    id: true,
                    name: true,
                    description: true,
                },
            },
            date: true,
            startTime: true,
            endTime: true,
        },
    });
return NextResponse.json(recentEquipment);
}