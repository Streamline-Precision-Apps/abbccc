import { NextResponse } from "next/server";
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

    // Fetch jobsite codes
    const jobCodes = await prisma.jobsite.findMany({
      select: {
        id: true,
        qrId: true,
        name: true,
      },
    });

    if (!jobCodes || jobCodes.length === 0) {
      return NextResponse.json(
        { message: "No job codes found." },
        { status: 404 }
      );
    }

    return NextResponse.json(jobCodes);
  } catch (error) {
    console.error("Error fetching job codes:", error);

    let errorMessage = "Failed to fetch job codes";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
