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

    // Fetch the 5 most recent unique equipment used by the authenticated user
    const recentEquipment = await prisma.employeeEquipmentLog.findMany({
      where: {
        employeeId: userId,
      },
      select: {
        Equipment: {
          select: {
            id: true,
            qrId: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    // Extract unique equipment items (filter out duplicates)
    const uniqueEquipment = new Map();
    recentEquipment.forEach((log) => {
      if (log.Equipment) {
        uniqueEquipment.set(log.Equipment.id, log.Equipment);
      }
    });

    const equipmentList = Array.from(uniqueEquipment.values());

    if (equipmentList.length === 0) {
      // return NextResponse.json([], { status: 404 }); // Return an empty array with 200 status
      return NextResponse.json(
        { message: "No matching cost codes found in database." },
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
