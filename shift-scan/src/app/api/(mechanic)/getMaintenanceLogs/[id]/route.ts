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
  const projects = await prisma.maintenance.findMany({
    where: {
      id: id,
    },
    select: {
      id: true,
      maintenanceLogs: {
        select: {
          id: true,
          startTime: true,
          endTime: true,
          comment: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  });
  return NextResponse.json(projects);
}