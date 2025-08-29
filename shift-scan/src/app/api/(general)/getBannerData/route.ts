import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic"; // ✅ Ensures this API is dynamic and never pre-rendered

export async function GET(req: Request) {
  try {
    // Authenticate the user and retrieve the session
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));

    if (!id) {
      return NextResponse.json({ error: "No ID provided" }, { status: 400 });
    }

    // Fetch the active timesheet for the user
    const jobCode = await prisma.timeSheet.findFirst({
      where: { userId, id },
      select: {
        id: true,
        startTime: true,
        Jobsite: {
          select: { id: true, qrId: true, name: true },
        },
        CostCode: {
          select: { id: true, name: true },
        },
      },
    });

    if (!jobCode) {
      return NextResponse.json(
        { error: "No active timesheet found." },
        { status: 404 },
      );
    }

    // ------------------------- Fetch Logs -------------------------

    // Parallelize queries for performance
    const [tascoLogs, truckingLogs, eqLogs] = await Promise.all([
      prisma.tascoLog.findMany({
        where: { timeSheetId: id },
        select: {
          laborType: true,
          Equipment: { select: { qrId: true, name: true } },
        },
      }),
      prisma.truckingLog.findMany({
        where: { timeSheetId: id },
        select: {
          laborType: true,
          Equipment: { select: { qrId: true, name: true } },
        },
      }),
      prisma.employeeEquipmentLog.findMany({
        where: { timeSheetId: id, endTime: null },
        select: {
          id: true,
          startTime: true,
          endTime: true,
          Equipment: { select: { id: true, name: true } },
        },
      }),
    ]);

    // ------------------------- Format Logs -------------------------

    const formattedTascoLogs = tascoLogs.map((log) => ({
      laborType: log.laborType,
      equipment: log.Equipment || { qrId: null, name: "Unknown" },
    }));

    const formattedTruckingLogs = truckingLogs.map((log) => ({
      laborType: log.laborType,
      equipment: log.Equipment || { qrId: null, name: "Unknown" },
    }));

    const formattedEmployeeEquipmentLogs = eqLogs.map((log) => ({
      id: log.id,
      startTime: log.startTime,
      endTime: log.endTime,
      equipment: log.Equipment || { id: null, name: "Unknown" },
    }));

    // ------------------------- Structure the response -------------------------

    const responseData = {
      id: jobCode.id,
      startTime: jobCode.startTime,
      jobsite: jobCode.Jobsite
        ? {
            id: jobCode.Jobsite.id,
            qrId: jobCode.Jobsite.qrId,
            name: jobCode.Jobsite.name,
          }
        : null,
      costCode: jobCode.CostCode
        ? {
            id: jobCode.CostCode.id,
            name: jobCode.CostCode.name,
          }
        : null,
      tascoLogs: formattedTascoLogs,
      truckingLogs: formattedTruckingLogs,
      employeeEquipmentLogs: formattedEmployeeEquipmentLogs,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error in GET /api/getTimeSheetLogs:", error);

    let errorMessage = "Internal Server Error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
