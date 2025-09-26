import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic"; // ✅ Ensures this API is dynamic and never pre-rendered

export async function GET() {
  let session;

  // Handle authentication
  try {
    session = await auth();
  } catch (error) {
    console.error("Authentication failed:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }

  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Create a cached function for fetching equipment IDs and QR codes
    const getCachedEquipmentIds = unstable_cache(
      async () => {
        return await prisma.equipment.findMany({
          select: {
            id: true,
            qrId: true,
            name: true,
          },
        });
      },
      ["equipment-ids-qrids"],
      {
        tags: ["equipment"],
        revalidate: 3600, // Cache for 1 hour
      }
    );

    // Fetch all equipment
    const equipment = await getCachedEquipmentIds();

    // Return the equipment data
    return NextResponse.json(equipment);
  } catch (error) {
    console.error("Error fetching equipment:", error);
    return NextResponse.json(
      { error: "Error fetching equipment" },
      { status: 500 }
    );
  }
}
