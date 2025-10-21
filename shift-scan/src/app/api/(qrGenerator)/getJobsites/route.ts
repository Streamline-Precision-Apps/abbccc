import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic"; // ✅ Ensures this API is dynamic and never pre-rendered

export async function GET() {
  try {
    // Authenticate the user
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all jobsites (filtering will be done in components as needed)
    const jobsites = await prisma.jobsite.findMany({
      select: {
        id: true,
        qrId: true,
        name: true,
        status: true,
      },
    });

    if (!jobsites || jobsites.length === 0) {
      return NextResponse.json(
        { message: "No jobsites found." },
        { status: 404 },
      );
    }

    return NextResponse.json(jobsites);
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error fetching jobsites:", error);

    let errorMessage = "Failed to fetch jobsites";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
