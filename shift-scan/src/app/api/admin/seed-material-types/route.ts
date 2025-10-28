import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    // Authenticate user (optional - you might want to restrict this)
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Material types that need to exist for E-shift and F-shift
    const requiredMaterialTypes = [
      "Mud Conditioning",
      "Lime Rock",
      "Coal",
      "Lime Kiln", 
      "Ag Waste",
      "Belt Mud",
      "End Of Campaign Clean Up",
      "Dust Control",
      "Push PCC",
      "Rip West",
      "Rip Center", 
      "Rip East"
    ];

    const results = [];

    for (const materialName of requiredMaterialTypes) {
      try {
        // Use upsert to create if doesn't exist, or do nothing if it does
        const material = await prisma.tascoMaterialTypes.upsert({
          where: { name: materialName },
          update: {}, // Don't update anything if it exists
          create: { name: materialName },
        });
        results.push({ name: materialName, status: "created/verified", id: material.id });
      } catch (error) {
        console.error(`Error creating material type ${materialName}:`, error);
        results.push({ 
          name: materialName, 
          status: "error", 
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }

    return NextResponse.json({ 
      message: "Material types seeded successfully",
      results
    });

  } catch (error) {
    Sentry.captureException(error);
    console.error("Error seeding material types:", error);
    return NextResponse.json(
      { error: "Error seeding material types" },
      { status: 500 }
    );
  }
}