import prisma from "@/lib/prisma";
import * as Sentry from "@sentry/nextjs";
// import { TimesheetFilter } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: timesheetId } = await params;
    if (!timesheetId) {
      return new Response(
        JSON.stringify({ error: "Missing timesheet id in URL params." }),
        { status: 400 },
      );
    }

    const timesheet = await prisma.timeSheet.findUnique({
      where: { id: Number(timesheetId) },
      select: {
        id: true,
        comment: true,
        startTime: true,
        endTime: true,
        Jobsite: {
          select: {
            id: true,
            name: true,
          },
        },
        CostCode: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!timesheet) {
      return new Response(JSON.stringify({ error: "Timesheet not found." }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ timesheet }), { status: 200 });
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
