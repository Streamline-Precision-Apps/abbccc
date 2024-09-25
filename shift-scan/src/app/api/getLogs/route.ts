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

    const currentDate = new Date();
    const past24Hours = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);

    const getlogs = await prisma.employeeEquipmentLogs.findMany({
      where: {
        employeeId: userId,
        createdAt: { lte: currentDate, gte: past24Hours },
        isSubmitted: false,
      },
      include: {
        Equipment: {
          select: {
            id: true,
            qrId: true,
            name: true,
          },
        },
      },
    });

    const logs = getlogs.map(log => ({
      id: log.id.toString(),
      userId: log.employeeId,
      equipment: log.Equipment ? {
        id: log.Equipment.id,
        qrId: log.Equipment.qrId,
        name: log.Equipment.name,
      } : null,
      submitted: log.isSubmitted,
    }));


   return NextResponse.json(logs);
}