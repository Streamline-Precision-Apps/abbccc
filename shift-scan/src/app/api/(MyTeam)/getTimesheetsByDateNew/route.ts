import prisma from "@/lib/prisma";
import * as Sentry from "@sentry/nextjs";
// import { TimesheetFilter } from "@/lib/types";
import { NextRequest } from "next/server";

/**
 * GET /api/getTimesheetsByDate?employeeId=...&date=...&type=...&pendingOnly=...
 * Returns timesheet data for a given employee, date, and filter type.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get("employeeId");
    const dateParam = searchParams.get("date");

    if (!employeeId) {
      return new Response(
        JSON.stringify({ error: "Missing required query parameters." }),
        { status: 400 },
      );
    }

    // Convert date string to a range for the day (midnight to 23:59:59.999)
    let start: Date | undefined = undefined;
    let end: Date | undefined = undefined;
    if (dateParam) {
      start = new Date(dateParam + "T00:00:00.000Z");
      end = new Date(dateParam + "T23:59:59.999Z");
    }

    // Unified response: always return all relevant timesheet and related log data

    const timesheetData = await prisma.timeSheet.findMany({
      where: {
        userId: employeeId,
        status: {
          not: "DRAFT",
        },
        ...(dateParam ? { date: { gte: start, lte: end } } : {}),
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        status: true,
        workType: true,
        Jobsite: {
          select: {
            name: true,
          },
        },
        CostCode: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { date: "desc" },
    });

    const data = {
      timesheetData,
    };

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    Sentry.captureException(error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: String(error),
      }),
      { status: 500 },
    );
  }
}
