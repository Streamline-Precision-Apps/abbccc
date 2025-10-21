import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { LoadType } from "../../../../../../prisma/generated/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  let session;
  try {
    session = await auth();
  } catch (error) {
    console.error("Error during authentication:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 },
    );
  }

  const userId = session?.user.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const report = await prisma.timeSheet.findMany({
      select: {
        date: true,
        startTime: true,
        endTime: true,
        User: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        TascoLogs: {
          select: {
            id: true,
            shiftType: true,
            laborType: true,
            Equipment: {
              select: {
                name: true,
              },
            },
            screenType: true,
            LoadQuantity: true,
            materialType: true,
          },
        },
      },
    });

    // Filter out timesheets with empty TascoLogs arrays
    const filteredReport = report.filter(
      (item) => Array.isArray(item.TascoLogs) && item.TascoLogs.length > 0,
    );

    const tascoReport = filteredReport.map((log) => {
      const shiftType = log.TascoLogs[0].shiftType;
      const laborType = log.TascoLogs[0].laborType;
      const loadQuantity = log.TascoLogs[0].LoadQuantity ?? 0; // Default to 0 if null/undefined
      
      // Determine loads based on shiftType instead of laborType
      const loadsABCDE = (shiftType === "ABCD Shift" || shiftType === "E Shift") 
        ? loadQuantity : null;
          
      const loadsF = (shiftType === "F Shift") 
        ? loadQuantity : null;
      
      return {
        id: log.TascoLogs[0].id, // Assuming you want the first log's ID
        shiftType: shiftType,
        submittedDate: log.date,
        employee: `${log.User.firstName} ${log.User.lastName}`,
        dateWorked: log.date,
        laborType: laborType,
        equipment: log.TascoLogs[0].Equipment?.name ?? "",
        loadsABCDE: loadsABCDE,
        loadsF: loadsF,
        materials: log.TascoLogs[0].materialType ?? "",
        startTime: log.startTime,
        endTime: log.endTime,
        LoadType:
          log.TascoLogs[0].screenType === "SCREENED"
            ? LoadType.SCREENED
            : LoadType.UNSCREENED,
      };
    });

    if (!tascoReport.length) {
      return NextResponse.json(
        { error: "No timesheets with TascoLogs found" },
        { status: 404 },
      );
    }
    return NextResponse.json(tascoReport);
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error fetching timesheet by id:", error);
    return NextResponse.json(
      { error: "Failed to fetch timesheet" },
      { status: 500 },
    );
  }
}
