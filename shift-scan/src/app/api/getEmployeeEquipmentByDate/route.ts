"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(req: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  const url = new URL(req.url);
  const dateString = url.searchParams.get("date");

  if (!dateString) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Convert dateString (in YYYY-MM-DD format) to a Date object
  const date = new Date(dateString); // Automatically interprets the string as YYYY-MM-DD
  if (isNaN(date.getTime())) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Include the date filter with the ISO date (optional: only keep the date part if time is not needed)
  const equipmentData = await prisma.employeeEquipmentLogs.findMany({
    where: {
      date: {
        gte: new Date(`${dateString}T00:00:00.000Z`), // Start of the day
        lt: new Date(`${dateString}T23:59:59.999Z`), // End of the day
      },
    },
    include: {
      Equipment: {
        select: {
          id: true,
          qrId: true,
          name: true,
        },
      },
    },
  });

  return NextResponse.json(equipmentData);
}
