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

    if (!userCrewData || userCrewData.length === 0) {
      return NextResponse.json({ message: "No crews found" }, { status: 404 });
    }

    // Revalidate cache for crews
    revalidateTag("crews");

    return NextResponse.json(userCrewData);
  } catch (error) {
    console.error("Error fetching crews:", error);

    let errorMessage = "Failed to fetch crews";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
