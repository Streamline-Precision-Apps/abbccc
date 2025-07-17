import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic"; // Ensures API is always dynamic and not cached

/**
 * Get summary information of all equipment (just id and name)
 * Used for lightweight equipment listing in admin assets page
 */
export async function GET() {
  try {
    // Authenticate the user
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const clockedInUsers = await prisma.user.count({
      where: {
        clockedIn: true,
      },
    });

    const totalPendingTimesheets = await prisma.timeSheet.count({
      where: {
        status: "PENDING",
      },
    });

    const pendingForms = await prisma.formSubmission.count({
      where: {
        status: "PENDING",
      },
    });

    const equipmentAwaitingApproval = await prisma.equipment.count({
      where: {
        approvalStatus: "PENDING",
      },
    });

    const jobsitesAwaitingApproval = await prisma.jobsite.count({
      where: {
        approvalStatus: "PENDING",
      },
    });

    return NextResponse.json({
      clockedInUsers,
      totalPendingTimesheets,
      pendingForms,
      equipmentAwaitingApproval,
      jobsitesAwaitingApproval,
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error fetching equipment summary:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to fetch equipment summary";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
