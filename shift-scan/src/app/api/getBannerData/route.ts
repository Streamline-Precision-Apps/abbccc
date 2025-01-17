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

    const jobCode = await prisma.timeSheet.findFirst({
        where: {
        userId,
        endTime: null,
        },
        select: {
            id: true,
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
        }
    });

    const eqLog = await prisma.employeeEquipmentLog.findMany({
        where: {
            timeSheetId: jobCode?.id,
            endTime: null,
        },
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
    });

    const data = {
        id: jobCode?.id,
        jobsite: {
            id: jobCode?.jobsite.id,
            qrId: jobCode?.jobsite.qrId,
            name: jobCode?.jobsite.name,
        },
        costcode: jobCode?.costcode,
        employeeEquipmentLog: [{
            id: eqLog[0].id,
            startTime: eqLog[0].startTime,
            endTime: eqLog[0].endTime,
            Equipment: {
                id: eqLog[0]?.Equipment?.id,
                name: eqLog[0]?.Equipment?.name,
            },
        }],
    };
        


    return NextResponse.json(data);
}
