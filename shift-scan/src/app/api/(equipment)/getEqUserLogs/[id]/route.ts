"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

type Params = { id: string };

/**
 * Get equipment usage log details for a specific user within the last 24 hours
 * @param request - The incoming request
 * @param params - Route parameters containing the log ID
 * @returns Equipment log details or error response
 */
export async function GET(request: Request, { params }: { params: Params }) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formId = params.id;

    if (!formId) {
      return NextResponse.json({ error: "Invalid form ID" }, { status: 400 });
    }

    const usersLog = await prisma.employeeEquipmentLog.findFirst({
      where: {
        id: formId,
      },
      select: {
        id: true,
        equipmentId: true,
        startTime: true,
        endTime: true,
        comment: true,
        Equipment: {
          select: {
            id: true,
            name: true,
            state: true,
            equipmentTag: true,
            equipmentVehicleInfo: {
              select: {
                make: true,
                model: true,
                year: true,
                licensePlate: true,
                mileage: true,
              },
            },
          },
        },
        RefuelLog: {
          select: {
            id: true,
            gallonsRefueled: true,
          },
        },
        Maintenance: {
          select: {
            id: true,
            equipmentIssue: true,
            additionalInfo: true,
          },
        },
      },
    });

    if (!usersLog) {
      return NextResponse.json(
        { error: "No log found for the given ID" },
        { status: 404 }
      );
    }

    return NextResponse.json(usersLog);
  } catch (error) {
    console.error("Error fetching user's log:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch user's log";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
