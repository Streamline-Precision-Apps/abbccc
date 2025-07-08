import { NextResponse } from "next/server";
import * as Sentry from '@sentry/nextjs';
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

    // Fetch employee details
    const employee = await prisma.user.findUnique({
      where: { id: userId.toString() },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        image: true,
        signature: true,
        Contact: {
          select: {
            phoneNumber: true,
            emergencyContact: true,
            emergencyContactNumber: true,
          },
        },
      },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Employee profile not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(employee);
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error fetching profile data:", error);

    let errorMessage = "Failed to fetch profile data";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
