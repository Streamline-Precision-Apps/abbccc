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
      return NextResponse.json({ error: "Invalid or missing ID" }, { status: 400 });
    }

    // Fetch maintenance project and its logs
    const project = await prisma.maintenance.findUnique({
      where: { id: id },
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

    if (!project) {
      return NextResponse.json({ error: "Maintenance project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error fetching maintenance project:", error);

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
