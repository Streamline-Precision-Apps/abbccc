"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await prisma.maintenance.findMany({
    select: {
      id: true,
      equipmentId: true,
      selected: true,
      priority: true,
      delay: true,
      equipmentIssue: true,
      additionalInfo: true,
      maintenanceLogs: {
        select: {
          id: true,
          startTime: true,
          endTime: true,
          userId: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
              image: true,
            },
          },
        },
      },
      equipment: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return NextResponse.json(projects);
}
