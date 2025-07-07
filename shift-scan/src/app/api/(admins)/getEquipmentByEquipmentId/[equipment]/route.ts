import { NextResponse } from "next/server";
import * as Sentry from '@sentry/nextjs';
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic"; // Ensures API is always dynamic and not cached

/**
 * Get equipment details by ID
 * @param request - The incoming request
 * @param params - Route parameters containing the equipment ID
 * @returns Equipment details or error response
 */
export async function GET(
  request: Request,
  { params }: { params: { equipment: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const equipmentId = params.equipment;
    if (!equipmentId) {
      return NextResponse.json(
        { error: "Invalid or missing equipment ID" },
        { status: 400 }
      );
    }

    // Fetch all equipment data including relations
    const equipment = await prisma.equipment.findUnique({
      where: { id: equipmentId },
      include: {
        equipmentVehicleInfo: true,
        TruckingLogs: true,
        DocumentTags: true,
      },
    });

    if (!equipment) {
      return NextResponse.json(
        { error: "Equipment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(equipment);
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error fetching equipment data:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch equipment data";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
