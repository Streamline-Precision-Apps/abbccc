// src/app/api/getTruckingLogs/StateMileage/[timeSheetId]/route.ts
"use server";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const stateMileage = await prisma.refueled.findMany({
    where: {
      employeeEquipmentLogId: id,
    },
  });

  return NextResponse.json(stateMileage);
}
