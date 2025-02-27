// src/app/api/getTruckingLogs/StateMileage/[timeSheetId]/route.ts
"use server";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { timeSheetId: string } }
) {
  const { timeSheetId } = params;

  const endingMileage = await prisma.truckingLog.findFirst({
    where: {
      id: timeSheetId,
    },
    select: {
      endingMileage: true,
    },
  });

  return NextResponse.json(endingMileage);
}
