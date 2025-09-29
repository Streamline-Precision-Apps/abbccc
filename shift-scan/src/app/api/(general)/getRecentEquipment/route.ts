import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
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

    // Create a cached function for fetching recent equipment for this user
    const getCachedRecentEquipment = unstable_cache(
      async (userId: string) => {
        const recentEquipment = await prisma.employeeEquipmentLog.findMany({
          where: {
            TimeSheet: {
              userId: userId,
            },
          },
          include: {
            Equipment: true,
          },
        });

        // Extract unique equipment items, sorted by most recent log (using startTime)
        const uniqueEquipment = new Map<string, { id: string; qrId: string; name: string }>();
        recentEquipment
          .sort((a, b) => (b.startTime?.getTime?.() ?? 0) - (a.startTime?.getTime?.() ?? 0))
          .forEach((log) => {
            if (log.Equipment) {
              uniqueEquipment.set(log.Equipment.id, {
                id: log.Equipment.id,
                qrId: log.Equipment.qrId,
                name: log.Equipment.name,
              });
            }
          });

        return Array.from(uniqueEquipment.values()).slice(0, 5);
      },
      [`recent-equipment-${userId}`],
      {
        tags: [`recent-equipment-${userId}`, "equipment"],
        revalidate: 10 * 60, // Cache for 10 minutes
      }
    );

    // Get the cached equipment list
    const equipmentList = await getCachedRecentEquipment(userId);

    if (equipmentList.length === 0) {
      return NextResponse.json(
        { message: "No matching equipment found in database." },
        { status: 404 }
      );
    }

    return NextResponse.json(equipmentList);
  } catch (error) {
    console.error("Error fetching recent equipment:", error);

    let errorMessage = "Failed to fetch recent equipment";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
