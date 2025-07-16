import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { LoadType } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  let session;
  try {
    session = await auth();
  } catch (error) {
    console.error("Error during authentication:", error);
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
    const overWeightReport = await prisma.equipment.findMany({
      where: {
        overWeight: true,
      },
      select: {
        id: true,
        name: true,
        overWeight: true,
        currentWeight: true,
        equipmentVehicleInfo: {
          select: {
            mileage: true,
          },
        },
      },
    });

    const formattedReport = overWeightReport.map((equipment) => ({
      date: new Date().toISOString().split("T")[0], // Assuming today's date for the report
      equipmentId: equipment.id,
      name: equipment.name,
      overWeightAmount: equipment.currentWeight,
      totalMileage: equipment.equipmentVehicleInfo?.mileage || 0,
    }));

    if (!formattedReport.length) {
      return NextResponse.json(
        { error: "No equipment with OverWeight found" },
        { status: 404 }
      );
    }
    return NextResponse.json(formattedReport);
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error fetching equipment by id:", error);
    return NextResponse.json(
      { error: "Failed to fetch equipment" },
      { status: 500 }
    );
  }
}
