"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  request: Request,
  { params }: { params: { qrId: string } }
) {
  try {
    // Authenticate the user
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate equipment ID
    const equipmentId = params.qrId;
    if (!equipmentId) {
      return NextResponse.json(
        { error: "Invalid or missing equipment ID" },
        { status: 400 }
      );
    }

    // Fetch equipment details
    const equipment = await prisma.equipment.findUnique({
      where: { qrId: equipmentId },
      select: {
        id: true,
        qrId: true,
        name: true,
        description: true,
        equipmentTag: true,
        lastInspection: true,
        lastRepair: true,
        status: true,
        make: true,
        model: true,
        year: true,
        licensePlate: true,
        registrationExpiration: true,
        mileage: true,
        isActive: true,
        inUse: true,
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

    let errorMessage = "Failed to fetch equipment data";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
