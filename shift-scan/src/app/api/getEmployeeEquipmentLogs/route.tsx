"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  try {
    // Authenticate the user
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch employee equipment logs with related equipment details
    const equipmentData = await prisma.employeeEquipmentLog.findMany({
      include: {
        equipment: {
          select: {
            id: true,
            qrId: true,
            name: true,
            description: true,
            status: true,
          },
        },
      },
    });

    if (!equipmentData || equipmentData.length === 0) {
      return NextResponse.json(
        { message: "No equipment logs found." },
        { status: 404 }
      );
    }

    return NextResponse.json(equipmentData);
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
