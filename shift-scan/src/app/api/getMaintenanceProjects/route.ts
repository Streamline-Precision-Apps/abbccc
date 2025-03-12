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

    // Fetch maintenance projects
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

    if (!projects || projects.length === 0) {
      return NextResponse.json(
        { message: "No maintenance projects found." },
        { status: 404 }
      );
    }

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching maintenance projects:", error);

    let errorMessage = "Failed to fetch maintenance project data";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
