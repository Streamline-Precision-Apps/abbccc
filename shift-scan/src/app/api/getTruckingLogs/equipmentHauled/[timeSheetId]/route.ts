// src/app/api/getTruckingLogs/StateMileage/[timeSheetId]/route.ts
"use server";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { timeSheetId: string } }
) {
  const { timeSheetId } = params;

  const stateMileage = await prisma.equipmentHauled.findMany({
    where: {
      truckingLogId: timeSheetId,
    },
    include: {
      equipment: {
        select: {
          name: true,
        },
      },
      jobSite: {
        select: {
          name: true,
        },
      },
    },
  });

  return NextResponse.json(stateMileage);
}
