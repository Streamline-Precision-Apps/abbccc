"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

/**
 * Get equipment details by ID
 * @param request - The incoming request
 * @param params - Route parameters containing the equipment ID
 * @returns Equipment details or error response
 */
export async function GET(
  request: Request,
  { params }: { params: { equipment: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const equipmentId = params.equipment;
    if (!equipmentId) {
      return NextResponse.json(
        { error: "Invalid or missing equipment ID" },
        { status: 400 }
      );
    }

    const equipment = await prisma.equipment.findUnique({
      where: { id: equipmentId },
      select: {
        id: true,
        qrId: true,
        name: true,
        description: true,
        equipmentTag: true,
        state: true,
        isDisabledByAdmin: true,
        approvalStatus: true,
        overWeight: true,
        currentWeight: true,
        equipmentVehicleInfo: {
          select: {
            make: true,
            model: true,
            year: true,
            licensePlate: true,
            registrationExpiration: true,
            mileage: true,
          },
        },
      },
    });

    if (!equipment) {
      return NextResponse.json(
        { error: "Equipment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(equipment);
  } catch (error) {
    console.error("Error fetching equipment data:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch equipment data";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
