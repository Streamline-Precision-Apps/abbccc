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

  const jobsiteDetails = await prisma.timeSheet.findMany({
    where: {
      userId: userId,
    },
    select: {
      jobsite: {
        select: {
          id: true,
          qrId: true,
          name: true,
        },
      },
    },
    orderBy: {
      submitDate: "desc",
    },
    take: 5,
    distinct: ["jobsiteId"],
  });

  return NextResponse.json(jobsiteDetails.map((log) => log.jobsite));
}
