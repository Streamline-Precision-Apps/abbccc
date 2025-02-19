"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = params;

  const receivedInfo = await prisma.maintenance.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      equipmentIssue: true,
      additionalInfo: true,
      delay: true,
      delayReasoning: true,
      equipment: {
        select: {
          name: true,
        },
      },
      maintenanceLogs: {
        select: {
          id: true,
          startTime: true,
          endTime: true,
          userId: true,
          comment: true,
        },
      },
    },
  });

  return NextResponse.json(receivedInfo);
}
