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

    console.log("Equipment API: Session check - userId:", userId);

    if (!userId) {
      console.log("Equipment API: No userId found, returning 401");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Equipment API: Fetching equipment from database");
    const equipment = await prisma.equipment.findMany({
      select: {
        id: true,
        code: true,
        qrId: true,
        name: true,
        equipmentTag: true,
        status: true,
      },
    });

    console.log("Equipment API: Found", equipment.length, "equipment items");

    if (!equipment || equipment.length === 0) {
      console.log("Equipment API: No equipment found, returning 404");
      return NextResponse.json(
        { message: "No equipment found." },
        { status: 404 },
      );
    }

    console.log("Equipment API: Returning equipment data");
    return NextResponse.json(equipment);
  } catch (error) {
    console.error("Equipment API: Error fetching equipment data:", error);

    let errorMessage = "Failed to fetch equipment data";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
