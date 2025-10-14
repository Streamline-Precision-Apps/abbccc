import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

// Mark route as dynamic to prevent static generation
export const dynamic = "force-dynamic";

/**
 * Fetch equipment list with their associated document tags
 * Only returns active (not disabled) equipment to maintain data relevance
 */
export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const equipment = await prisma.equipment.findMany({
      where: {
        status: { not: "ARCHIVED" },
        approvalStatus: "APPROVED",
      },
      select: {
        id: true,
        qrId: true,
        name: true,
        equipmentTag: true,
        DocumentTags: {
          select: {
            id: true,
            tagName: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    if (!equipment || equipment.length === 0) {
      return NextResponse.json(
        { message: "No equipment found" },
        { status: 404 },
      );
    }

    return NextResponse.json(equipment);
  } catch (error) {
    console.error("Error fetching equipment:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to fetch document equipment";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
