import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
export const dynamic = "force-dynamic"; // ✅ Ensures this API is dynamic and never pre-rendered
export async function GET(request: Request) {
  let session;

  // Handle authentication errors
  try {
    session = await auth();
  } catch (error) {
    console.error("Authentication failed:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    // Query the timeSheet for the current user with an active trucking log (endTime is null)
    const truckingId = await prisma.timeSheet.findFirst({
      where: {
        userId,
        endTime: null, // Looking for active timesheets
      },
      select: {
        TruckingLogs: {
          select: {
            id: true, // Select the truckingLog ID
          },
        },
      },
    });

    // If no trucking log is found, return a 404 response
    if (
      !truckingId ||
      !truckingId.TruckingLogs ||
      truckingId.TruckingLogs.length === 0
    ) {
      return NextResponse.json(
        { error: "No active trucking log found for the user" },
        { status: 404 }
      );
    }

    const truckingLogs = truckingId.TruckingLogs[0].id;

    // Return the trucking log ID
    return NextResponse.json(truckingLogs);
  } catch (error) {
    console.error("Error fetching trucking log:", error);
    return NextResponse.json(
      { error: "Failed to fetch trucking log" },
      { status: 500 }
    );
  }
}
