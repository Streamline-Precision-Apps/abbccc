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

    if (!equipment || equipment.length === 0) {
      return NextResponse.json(
        { message: "No equipment found." },
        { status: 404 },
      );
    }

    return NextResponse.json(equipment);
  } catch (error) {
    console.error("Error fetching equipment data:", error);

    let errorMessage = "Failed to fetch equipment data";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
