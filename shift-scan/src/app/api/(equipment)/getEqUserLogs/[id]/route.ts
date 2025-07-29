"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

type Params = Promise<{ id: string }>;

/**
 * Get equipment usage log details for a specific user and log ID
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

    const formId = (await params).id;

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
    console.error("Error fetching log:", error);
    let errorMessage = "Failed to fetch log";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
