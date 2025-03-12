"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate the user
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate the ID parameter
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "Invalid or missing maintenance ID" }, { status: 400 });
    }

    // Fetch maintenance project details
    const project = await prisma.maintenance.findUnique({
      where: { id },
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
        repaired: true,
        equipment: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Check if the maintenance project exists
    if (!project) {
      return NextResponse.json(
        { error: "Maintenance project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error fetching maintenance project details:", error);

    let errorMessage = "Failed to fetch maintenance project details";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
