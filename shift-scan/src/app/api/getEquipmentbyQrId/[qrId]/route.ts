"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  request: Request,
  { params }: { params: { qrId: string } }
) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const equipmentId = String(params.qrId);
  if (!equipmentId) {
    return NextResponse.json(
      { error: "Invalid equipment ID" },
      { status: 400 }
    );
  }

  try {
    const equipment = await prisma.equipment.findUnique({
      where: { qrId: equipmentId },
      select: {
        id: true,
        qrId: true,
        name: true,
        lastInspection: true,
        lastRepair: true,
        mileage: true,
      },
    });

    console.log("fetched equipment:", equipment);

    return NextResponse.json(equipment);
  } catch (error) {
    console.error("Error fetching equipment data:", error);
    return NextResponse.json(
      { error: "Failed to fetch equipment data" },
      { status: 500 }
    );
  }
}
