import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";

export const dynamic = "force-dynamic"; // ✅ No "use server" needed in API routes

export async function GET() {
  try {
    // Fetch all crews ordered alphabetically by name
    const userCrewData = await prisma.crew.findMany({
      orderBy: {
        name: "asc",
      },
    });

    if (!userCrewData || userCrewData.length === 0) {
      return NextResponse.json(
        { message: "No crews found" },
        { status: 404 }
      );
    }

    // Revalidate cache for crews
    revalidateTag("crews");

    return NextResponse.json(userCrewData, {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=60, stale-while-revalidate=30",
      },
    });
  } catch (error) {
    console.error("Error fetching crews:", error);

    let errorMessage = "Failed to fetch crews";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
