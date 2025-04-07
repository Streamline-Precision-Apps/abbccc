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

    // Fetch the 5 most recent unique jobsites used by the authenticated user
    const jobsiteDetails = await prisma.timeSheet.findMany({
      where: { userId },
      select: {
        Jobsite: {
          select: {
            id: true,
            qrId: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    // Extract unique jobsites (filter out duplicates)
    const uniqueJobsites = new Map();
    jobsiteDetails.forEach((log) => {
      if (log.Jobsite) {
        uniqueJobsites.set(log.Jobsite.id, log.Jobsite);
      }
    });

    const jobsitesList = Array.from(uniqueJobsites.values());

    if (jobsitesList.length === 0) {
      return NextResponse.json(
        { message: "No recent jobsites found." },
        { status: 404 }
      );
    }

    return NextResponse.json(jobsitesList);
  } catch (error) {
    console.error("Error fetching recent jobsites:", error);

    let errorMessage = "Failed to fetch recent jobsites";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
