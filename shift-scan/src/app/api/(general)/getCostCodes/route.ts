import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic"; // ✅ Ensures this API is dynamic and never pre-rendered

export async function GET() {
  try {
    // Authenticate user
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch cost codes
    const costCodes = await prisma.costCode.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    if (!costCodes || costCodes.length === 0) {
      return NextResponse.json(
        { message: "No cost codes found." },
        { status: 404 }
      );
    }

    return NextResponse.json(costCodes);
  } catch (error) {
    console.error("Error fetching cost codes:", error);

    let errorMessage = "Failed to fetch cost codes";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
