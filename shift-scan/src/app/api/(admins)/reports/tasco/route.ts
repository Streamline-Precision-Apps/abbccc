import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  let session;
  try {
    session = await auth();
  } catch (error) {
    console.error("Error during authentication:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
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
            LoadQuantity: true,
            materialType: true,
          },
        },
      },
    });

    // Filter out timesheets with empty TascoLogs arrays
    const filteredReport = report.filter(
      (item) => Array.isArray(item.TascoLogs) && item.TascoLogs.length > 0
    );

    if (!filteredReport.length) {
      return NextResponse.json(
        { error: "No timesheets with TascoLogs found" },
        { status: 404 }
      );
    }
    return NextResponse.json(filteredReport);
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error fetching timesheet by id:", error);
    return NextResponse.json(
      { error: "Failed to fetch timesheet" },
      { status: 500 }
    );
  }
}
