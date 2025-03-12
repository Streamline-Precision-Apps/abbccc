"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(req: Request) {
  try {
    // Authenticate the user
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract and validate the date parameter
    const url = new URL(req.url);
    const dateString = url.searchParams.get("date");

    if (!dateString) {
      return NextResponse.json({ error: "Missing date parameter" }, { status: 400 });
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
    }

    // Define the start and end of the day in UTC
    const startOfDay = new Date(`${dateString}T00:00:00.000Z`);
    const endOfDay = new Date(`${dateString}T23:59:59.999Z`);

    // Fetch employee equipment logs
    const equipmentData = await prisma.employeeEquipmentLog.findMany({
      where: {
        startTime: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
      include: {
        equipment: {
          select: {
            id: true,
            qrId: true,
            name: true,
          },
        },
      },
    });

    if (!equipmentData || equipmentData.length === 0) {
      return NextResponse.json(
        { message: "No equipment logs found for the given date." },
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
