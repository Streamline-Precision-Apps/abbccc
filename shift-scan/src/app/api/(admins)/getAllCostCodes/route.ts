import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidateTag } from "next/cache";

export const dynamic = "force-dynamic"; // ✅ Ensures this API is dynamic and never pre-rendered

export async function GET() {
  try {
    // Authenticate user
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch cost codes from the database
    const costcodeData = await prisma.costCode.findMany();

    if (!costcodeData || costcodeData.length === 0) {
      return NextResponse.json(
        { message: "No cost codes found" },
        { status: 404 }
      );
    }

    // Revalidate cache for cost codes
    revalidateTag("costcodes");

    return NextResponse.json(costcodeData, {
      headers: {
        "Cache-Control":
          "public, max-age=60, s-maxage=60, stale-while-revalidate=30",
      },
    });
  } catch (error) {
    console.error("Error fetching cost codes:", error);

    let errorMessage = "Failed to fetch cost codes";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
