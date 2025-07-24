import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/truckingLogDetails/[truckingLogId]
 * Returns all relevant trucking log details in one response for batching.
 * @param request - The incoming request object
 * @param params - The route parameters containing truckingLogId
 */
export async function GET(
  request: Request,
  { params }: { params: { truckingLogId: string } }
) {
  // Authenticate user
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { truckingLogId } = params;

  if (!truckingLogId || typeof truckingLogId !== "string") {
    return NextResponse.json(
      { error: "Invalid or missing truckingLogId" },
      { status: 400 }
    );
  }

  try {
    // Fetch all related trucking log data in one query
    const truckingLogDetails = await prisma.truckingLog.findUnique({
      where: { id: truckingLogId },
      include: {
        Equipment: {
          select: { id: true, name: true, qrId: true },
        },
        EquipmentHauled: {
          include: {
            Equipment: { select: { id: true, name: true } },
          },
        },
        Materials: true,
        RefuelLogs: true,
        StateMileages: true,
        TimeSheet: {
          select: {
            id: true,
            startTime: true,
            endTime: true,
            User: { select: { firstName: true, lastName: true } },
          },
        },
      },
    });

    if (!truckingLogDetails) {
      return NextResponse.json(
        { error: "No trucking log found" },
        { status: 404 }
      );
    }

    return NextResponse.json(truckingLogDetails);
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error fetching trucking log details:", error);
    return NextResponse.json(
      { error: "Failed to fetch trucking log details" },
      { status: 500 }
    );
  }
}
