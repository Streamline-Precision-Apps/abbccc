import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";
export async function GET() {
  try {
    // Authenticate user
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch employee details
    const ClockOutComment = await prisma.timeSheet.findFirst({
      where: {
        userId: userId,
        endTime: null,
      },
      select: {
        comment: true,
      },
    });

    return NextResponse.json(ClockOutComment);
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error fetching profile data:", error);
    return NextResponse.json(
      { error: "Error fetching profile data:" },
      { status: 500 }
    );
  }
}
