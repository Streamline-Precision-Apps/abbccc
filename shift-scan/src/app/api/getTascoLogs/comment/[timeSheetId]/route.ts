// src/app/api/getTruckingLogs/StateMileage/[timeSheetId]/route.ts
"use server";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { timeSheetId: string } }
) {
  const { timeSheetId } = params;

  const notes = await prisma.tascoLog.findFirst({
    where: {
      id: timeSheetId,
    },
    select: {
      comment: true,
    },
  });

  return NextResponse.json(notes);
}
