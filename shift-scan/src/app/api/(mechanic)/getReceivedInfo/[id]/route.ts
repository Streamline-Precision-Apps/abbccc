"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate the user
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate the ID parameter
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "Invalid or missing maintenance ID" }, { status: 400 });
    }

    // Fetch maintenance details
    const receivedInfo = await prisma.maintenance.findUnique({
      where: { id },
      select: {
        id: true,
        equipmentIssue: true,
        additionalInfo: true,
        delay: true,
        hasBeenDelayed: true,
        delayReasoning: true,
        Equipment: {
          select: {
            name: true,
          },
        },
        MaintenanceLogs: {
          select: {
            id: true,
            startTime: true,
            endTime: true,
            userId: true,
            comment: true,
          },
        },
      },
    });

    // Check if the maintenance record exists
    if (!receivedInfo) {
      return NextResponse.json(
        { error: "Maintenance record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(receivedInfo);
  } catch (error) {
    console.error("Error fetching maintenance details:", error);

    let errorMessage = "Failed to fetch maintenance details";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
