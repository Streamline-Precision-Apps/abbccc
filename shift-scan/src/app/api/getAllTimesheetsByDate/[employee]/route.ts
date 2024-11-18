"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  request: Request,
  { params }: { params: { employee: string } }
) {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { employee } = params;
  const url = new URL(request.url);
  const dateQuery = url.searchParams.get("date");

  if (!dateQuery) {
    return;
  }
  const date = new Date(dateQuery);

  const targetDate = new Date(dateQuery);
  // Lower bound: Start of the day
  const startOfDay = new Date(
    Date.UTC(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      targetDate.getDate() + 1,
      0,
      0,
      0,
      0
    )
  );

  // End of the day in UTC
  const endOfDay = new Date(
    Date.UTC(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      targetDate.getDate() + 1,
      23,
      59,
      59,
      999
    )
  );
  console.log("date:", date, "startOfDay:", startOfDay, "endOfDay:", endOfDay);

  try {
    const eqSheets = await prisma.employeeEquipmentLogs.findMany({
      where: {
        employeeId: employee,
        createdAt: {
          gte: startOfDay.toISOString(), // Start of the day (earlier)
          lte: endOfDay.toISOString(), // End of the day (later)
        },
      },
      include: {
        Equipment: {
          select: {
            name: true,
            qrId: true,
          },
        },
      },
    });

    console.log("eqSheets:", eqSheets[0]?.startTime);

    const timesheets = await prisma.timeSheets.findMany({
      where: {
        userId: employee,
        date: {
          equals: date,
        },
      },
      orderBy: { date: "desc" },
    });

    const combinedResponse = {
      equipmentLogs: eqSheets,
      timesheets: timesheets,
    };

    return NextResponse.json(combinedResponse);
  } catch (error) {
    console.error("Error fetching Time Sheets:", error);
    return NextResponse.json(
      { error: "Failed to fetch timesheets" },
      { status: 500 }
    );
  }
}
