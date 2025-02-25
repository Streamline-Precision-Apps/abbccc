// src/app/api/getTruckingLogs/StateMileage/[timeSheetId]/route.ts
"use server";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { timeSheetId: string } }
) {
  const { timeSheetId } = params;

  const stateMileage = await prisma.material.findMany({
    where: {
      truckingLogId: timeSheetId,
    },
  });

  return NextResponse.json(stateMileage);
}
