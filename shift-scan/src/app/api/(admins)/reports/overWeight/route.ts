import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

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
    const overWeightReport = await prisma.truckingLog.findMany({
      where: {
        endingMileage: { not: null },
      },
      select: {
        startingMileage: true,
        endingMileage: true,
        truckNumber: true,
        trailerNumber: true,
        TimeSheet: {
          select: {
            date: true,
            comment: true,
            Jobsite: {
              select: { name: true },
            },
          },
        },
        EquipmentHauled: {
          select: {
            Equipment: { select: { name: true, id: true } },
            startMileage: true,
            endMileage: true,
          },
        },
        Materials: {
          select: {
            id: true,
            name: true,
            LocationOfMaterial: true,
            quantity: true,
            unit: true,
          },
        },
        RefuelLogs: {
          select: {
            milesAtFueling: true,
            gallonsRefueled: true,
          },
        },
        StateMileages: {
          select: {
            state: true,
            stateLineMileage: true,
          },
        },
      },
    });

    const formattedReport = overWeightReport.map((log) => ({
      truckId: log.truckNumber,
      trailerId: log.trailerNumber,
      date: log.TimeSheet?.date ?? null,
      jobId: log.TimeSheet?.Jobsite?.name ?? null,
      Equipment: log.EquipmentHauled.map((equipment) => ({
        name: equipment.Equipment?.name || "",
        id: equipment.Equipment?.id || null,
        startMileage: equipment.startMileage,
        endMileage: equipment.endMileage,
      })),
      Materials: log.Materials.map((material) => ({
        id: material.id,
        name: material.name,
        location: material.LocationOfMaterial,
        quantity: material.quantity,
        unit: material.unit,
      })),
      StartingMileage: log.startingMileage,
      Fuel: log.RefuelLogs.map((fuel) => ({
        milesAtFueling: fuel.milesAtFueling,
        gallonsRefueled: fuel.gallonsRefueled,
      })),
      StateMileages: log.StateMileages.map((state) => ({
        state: state.state,
        stateLineMileage: state.stateLineMileage,
      })),
      EndingMileage: log.endingMileage,
      notes: log.TimeSheet?.comment ?? null,
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
