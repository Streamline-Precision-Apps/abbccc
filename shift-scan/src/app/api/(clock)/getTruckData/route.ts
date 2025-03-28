"use server";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  let session;

  // Handle authentication
  try {
    session = await auth();
  } catch (error) {
    console.error("Authentication failed:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }

  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch equipment based on equipmentTag = "TRUCK"
    const equipment = await prisma.equipment.findMany({
      where: { equipmentTag: "TRUCK" },
      select: {
        id: true,
        qrId: true,
        name: true,
      },
    });

    // Return the equipment data
    return NextResponse.json(equipment);
  } catch (error) {
    console.error("Error fetching equipment:", error);
    return NextResponse.json(
      { error: "Error fetching equipment" },
      { status: 500 }
    );
  }
}
