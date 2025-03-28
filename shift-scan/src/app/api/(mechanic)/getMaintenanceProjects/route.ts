"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  try {
    // Authenticate the user
    const session = await auth();
    const userId = session?.user?.id;

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
        repaired: true,
        createdAt: true,
        createdBy: true,
        maintenanceLogs: {
          select: {
            id: true,
            startTime: true,
            endTime: true,
            userId: true,
            timeSheetId: true,
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

    return NextResponse.json(projects, {
      headers: {
        "Cache-Control": "public, max-age=60, stale-while-revalidate=30",
      },
    });
  } catch (error) {
    console.error("Error fetching maintenance projects:", error);

    let errorMessage = "Failed to fetch maintenance project data";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
