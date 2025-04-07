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

    // Fetch equipment details
    const equipment = await prisma.equipment.findMany({
      select: {
        id: true,
        qrId: true,
        name: true,
        description: true,
        equipmentTag: true,
        status: true,
        isActive: true,
        inUse: true,
      },
    });

    if (!equipment || equipment.length === 0) {
      return NextResponse.json(
        { message: "No equipment found." },
        { status: 404 }
      );
    }

    return NextResponse.json(equipment);
  } catch (error) {
    console.error("Error fetching equipment:", error);

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
