"use server";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(request: Request) {
  let session;
  try {
    session = await auth();
  } catch (error) {
    console.error("Error during authentication:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  console.log("userId: " + userId);

  try {
    const tascoId = await prisma.timeSheet.findFirst({
      where: {
        userId,
        endTime: null,
      },
      select: {
        tascoLogs: {
          select: {
            id: true,
          },
        },
      },
    });

    // Handle case where no tascoId is found
    if (!tascoId || !tascoId.tascoLogs || tascoId.tascoLogs.length === 0) {
      return NextResponse.json({ error: "No active tasco logs found for the user" }, { status: 404 });
    }

    const tascoLogs = tascoId.tascoLogs[0].id;

    return NextResponse.json(tascoLogs);
  } catch (error) {
    console.error("Error fetching tasco logs:", error);
    return NextResponse.json({ error: "Failed to fetch tasco logs" }, { status: 500 });
  }
}
