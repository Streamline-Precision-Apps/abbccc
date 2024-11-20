"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;
  const manager = `${session?.user?.firstName} ${session?.user?.lastName}`;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get today's date in UTC and set the start and end boundaries for today's date
  const startOfToday = new Date();
  startOfToday.setUTCHours(0, 0, 0, 0);
  const endOfToday = new Date();
  endOfToday.setUTCHours(23, 59, 59, 999);

  try {
    // Fetch received requests based on `id`, `userId`, and today's date
    const receivedContent = await prisma.timeSheets.findMany({
      where: {
        userId: userId,
        startTime: {
          gte: startOfToday,
          lte: endOfToday,
        },
        vehicleId: {
          not: null,
        },
      },
    });

    const receivedContentWManager = receivedContent.map((request) => ({
      manager: manager,
      ...request,
    }));

    return NextResponse.json(receivedContentWManager);
  } catch (error) {
    console.error("Error fetching drives:", error);
    return NextResponse.json(
      { error: "Failed to fetch drives" },
      { status: 500 }
    );
  }
}
