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

  const projects = await prisma.maintenance.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      equipmentId: true,
      equipmentIssue: true,
      additionalInfo: true,
      location: true,
      priority: true,
      createdBy: true,
      createdAt: true,
      hasBeenDelayed: true,
      delay: true,
      delayReasoning: true,
      totalHoursLaboured: true,
      problemDiagnosis: true,
      solution: true,
      repaired: true,
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
