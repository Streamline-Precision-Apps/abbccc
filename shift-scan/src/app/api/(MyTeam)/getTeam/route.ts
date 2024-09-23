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

  const team = await prisma.crewMembers.findMany({
    where: { employeeId:  userId }
  });

  // Set Cache-Control header for caching
  return NextResponse.json(team, {
    headers: {
      'Cache-Control': 'public, max-age=60, s-maxage=60, stale-while-revalidate=30',
    },
  });
}