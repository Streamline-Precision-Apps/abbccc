import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const projects = await prisma.maintenance.findMany({
      where: {
        id: id,
      },
      select: {
        id: true,
        MaintenanceLogs: {
          select: {
            id: true,
            startTime: true,
            endTime: true,
            comment: true,
            User: {
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
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error fetching maintenance logs:", error);
    let errorMessage = "Failed to fetch maintenance logs";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
