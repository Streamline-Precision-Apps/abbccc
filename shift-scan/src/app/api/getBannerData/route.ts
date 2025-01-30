import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic"; // ✅ Ensures this API is dynamic and never pre-rendered

export async function GET(req: Request) {
  try {
    // Authenticate the user and retrieve the session
    const session = await auth();
    const userId = session?.user?.id;
    // Check if the user is authenticated

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "No ID provided" }, { status: 401 });
    }

    // Fetch the active timesheet for the user
    const jobCode = await prisma.timeSheet.findFirst({
      where: { userId, id },
      select: {
        id: true,
        jobsite: {
          select: { id: true, qrId: true, name: true },
        },
        costCode: {
          select: { id: true, name: true, description: true },
        },
      },
    });

    if (!jobCode) {
      return NextResponse.json(
        { error: "No active timesheet found." },
        { status: 404 }
      );
    }

    // ------------------------- Fetch Tasco Logs -------------------------
    const tascoLogs = await prisma.tascoLog.findMany({
      where: { timeSheetId: id },
      select: {
        laborType: true,
        equipment: { select: { qrId: true, name: true } },
      },
    });

    const formattedTascoLogs = tascoLogs.map((log) => ({
      laborType: log.laborType,
      equipment: log.equipment || { qrId: null, name: "Unknown" },
    }));

    // ------------------------- Fetch Trucking Logs -------------------------
    const truckingLogs = await prisma.truckingLog.findMany({
      where: { timeSheetId: id },
      select: {
        laborType: true,
        equipment: { select: { qrId: true, name: true } },
      },
    });

    const formattedTruckingLogs = truckingLogs.map((log) => ({
      laborType: log.laborType,
      equipment: log.equipment || { qrId: null, name: "Unknown" },
    }));

    // ------------------------- Fetch Equipment Logs -------------------------
    const eqLogs = await prisma.employeeEquipmentLog.findMany({
      where: { timeSheetId: id, endTime: null },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        Equipment: { select: { id: true, name: true } },
      },
    });

    const formattedEmployeeEquipmentLogs = eqLogs.map((log) => ({
      id: log.id,
      startTime: log.startTime,
      endTime: log.endTime,
      equipment: log.Equipment || { id: null, name: "Unknown" },
    }));

    // ------------------------- Structure the response -------------------------
    const responseData = {
      id: jobCode.id,
      jobsite: {
        id: jobCode.jobsite?.id,
        qrId: jobCode.jobsite?.qrId,
        name: jobCode.jobsite?.name,
      },
      costCode: {
        id: jobCode.costCode?.id,
        name: jobCode.costCode?.name,
        description: jobCode.costCode?.description,
      },
      tascoLogs: formattedTascoLogs,
      truckingLogs: formattedTruckingLogs,
      employeeEquipmentLogs: formattedEmployeeEquipmentLogs,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error in GET /api/getTimeSheetLogs:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
