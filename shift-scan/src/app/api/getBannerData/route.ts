"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
    const session = await auth();
    const userId = session?.user.id as string;

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bannerData = await prisma.timeSheet.findFirst({
        where: {
        userId,
        endTime: null,
        },
        select: {
            jobsite: {
            select: {
                id: true,
                qrId: true,
                name: true,
            },
            },
            costcode: true,
            // costcode: { --------------- need to link 
            // select: {
            //     id: true,
            //     name: true,
            //     description: true,
            // },
            // },
            employeeEquipmentLogs: {
            select: {
                id: true,
                startTime: true,
                endTime: true,
                Equipment: {
                select: {
                    id: true,
                    name: true,
                },
                },
            },
            },
        }
    });

    return NextResponse.json(bannerData);
}
