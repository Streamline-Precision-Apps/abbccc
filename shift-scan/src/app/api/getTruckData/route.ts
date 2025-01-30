"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { equal } from "assert";

export async function GET() {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const equipment = await prisma.equipment.findMany({
      where: { equipmentTag: "TRUCK" },
      select: {
        id: true,
        qrId: true,
        name: true,
      },
    });
    return NextResponse.json(equipment);
  } catch (error) {
    console.error("Error fetching equipment:", error);
    return NextResponse.json(
      { error: "Error fetching equipment" },
      { status: 500 }
    );
  }
}
