// src/app/api/getTruckingLogs/StateMileage/[timeSheetId]/route.ts
"use server";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const truckingId = await prisma.timeSheet.findFirst({
    where: {
      userId,
      endTime: null,
    },
    select: {
      truckingLogs: {
        select: {
          id: true,
        },
      },
    },
  });

  const truckingLogs = truckingId?.truckingLogs?.[0]?.id || null;

  return NextResponse.json(truckingLogs);
}
