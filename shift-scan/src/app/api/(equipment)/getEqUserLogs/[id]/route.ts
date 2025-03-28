"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

type Params = { id: string };

export async function GET(request: Request, { params }: { params: Params }) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formId = params.id;

    if (!formId) {
      return NextResponse.json({ error: "Invalid form ID" }, { status: 400 });
    }

    const currentDate = new Date();
    const past24Hours = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);

    const usersLog = await prisma.employeeEquipmentLog.findUnique({
      where: {
        id: formId,
        employeeId: userId,
        createdAt: {
          lte: currentDate,
          gte: past24Hours,
        },
      },
      include: {
        equipment: {
          select: {
            name: true,
            status: true,
          },
        },
        refueled: {
          select: {
            milesAtfueling: true,
            gallonsRefueled: true,
          },
        },
        maintenanceId: {
          select: {
            id: true,
            equipmentIssue: true,
            additionalInfo: true,
          },
        },
      },
    });

    if (!usersLog) {
      return NextResponse.json(
        { error: "No log found for the given ID and timeframe" },
        { status: 404 }
      );
    }

    console.log("usersLog: ", usersLog);
    return NextResponse.json(usersLog);
  } catch (error) {
    console.error("Error fetching user's log:", error);

    let errorMessage = "Failed to fetch user's log";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
