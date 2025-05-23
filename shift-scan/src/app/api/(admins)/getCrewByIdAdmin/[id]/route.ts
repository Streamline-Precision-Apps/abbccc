import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";

export const dynamic = "force-dynamic"; // ✅ No "use server" needed in API routes

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Fetch all crews ordered alphabetically by name
    const userCrewData = await prisma.crew.findUnique({
      where: {
        id: params.id,
      },

      include: {
        Users: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json(userCrewData, {
      headers: {
        "Cache-Control":
          "public, max-age=60, s-maxage=60, stale-while-revalidate=30",
      },
    });
  } catch (error) {
    console.error("Error fetching crews:", error);

    let errorMessage = "Failed to fetch crews";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
