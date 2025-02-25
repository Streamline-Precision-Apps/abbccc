// src/app/api/getTruckingLogs/StateMileage/[timeSheetId]/route.ts
"use server";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { timeSheetId: string } }
) {
  const { timeSheetId } = params;

  const truckingId = await prisma.timeSheet.findUnique({
    where: {
      id: timeSheetId,
    },
    include: {
      truckingLogs: {
        include: {
          Material: true,
        },
      },
    },
  });

  return NextResponse.json(truckingId);
}
