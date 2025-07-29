// src/app/api/getTruckingLogs/StateMileage/[timeSheetId]/route.ts
"use server";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Missing or invalid timeSheetId parameter" },
        { status: 400 }
      );
    }

    const stateMileage = await prisma.refuelLog.findMany({
      where: {
        employeeEquipmentLogId: id,
      },
    });

    if (!stateMileage || stateMileage.length === 0) {
      return NextResponse.json(
        { message: "No state mileage records found." },
        { status: 404 }
      );
    }

    return NextResponse.json(stateMileage);
  } catch (error) {
    console.error("Error fetching state mileage records:", error);

    let errorMessage = "Failed to fetch state mileage records";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
