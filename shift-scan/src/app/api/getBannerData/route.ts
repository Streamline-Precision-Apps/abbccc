import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic"; // ✅ Ensures this API is dynamic and never pre-rendered

export async function GET() {
  try {
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
        costCode: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    if (!jobCode) {
      return NextResponse.json(
        { error: "No active timesheet found." },
        { status: 404 }
      );
    }

    const eqLog = await prisma.employeeEquipmentLog.findMany({
      where: {
        timeSheetId: jobCode.id,
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

    const employeeEquipmentLog = eqLog.map((log) => ({
      id: log.id,
      startTime: log.startTime,
      endTime: log.endTime,
      Equipment: {
        id: log.Equipment?.id || null, // Provide default value if Equipment is undefined
        name: log.Equipment?.name || "Unknown", // Provide default value
      },
    }));

    const data = {
      id: jobCode.id,
      jobsite: {
        id: jobCode.jobsite.id,
        qrId: jobCode.jobsite.qrId,
        name: jobCode.jobsite.name,
      },
      costcode: {
        id: jobCode.costCode.id,
        name: jobCode.costCode.name,
        description: jobCode.costCode.description,
      },
      employeeEquipmentLog,
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in GET /api/getBannerData:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
