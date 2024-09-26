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

  // Fetch the 5 most recent unique cost codes for the authenticated user
  const recentCostCodes = await prisma.timeSheets.groupBy({
    by: ['costcode'], 
    where: {
      userId: userId,
    },
    orderBy: {
      _max: {
        date: 'desc',
      },
    },
    take: 5,
    _max: {
      date: true,
    },
  });

  // Fetch full cost code details based on the grouped costCode IDs
  const costCodeDetails = await Promise.all(
    recentCostCodes.map(async (log) => {
      return prisma.costCodes.findUnique({
        where: {
          name: log.costcode,
        },
        select: {
          id: true,
          name: true,
          description: true,
        },
      });
    })
  );

  return NextResponse.json(costCodeDetails);
}