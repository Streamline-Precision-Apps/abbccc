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
        id: true,
        startingMileage: true,
        endingMileage: true,
        Truck: {
          select: {
            id: true,
            name: true,
          },
        },
        Trailer: {
          select: {
            id: true,
            name: true,
          },
        },
        TimeSheet: {
          select: {
            User: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
            date: true,
            comment: true,
            Jobsite: {
              select: { name: true },
            },
          },
        },
        EquipmentHauled: {
          select: {
            truckingLogId: true,
            Equipment: { select: { name: true, id: true } },
            source: true,
            destination: true,
            startMileage: true,
            endMileage: true,
          },
        },
        Materials: {
          select: {
            truckingLogId: true,
            name: true,
            LocationOfMaterial: true,
            quantity: true,
            unit: true,
          },
        },
        RefuelLogs: {
          select: {
            truckingLogId: true,
            milesAtFueling: true,
            gallonsRefueled: true,
          },
        },
        StateMileages: {
          select: {
            truckingLogId: true,
            state: true,
            stateLineMileage: true,
          },
        },
      },
    });

    const formattedReport = overWeightReport.map((log) => ({
      id: log.id,
      driver: `${log.TimeSheet?.User?.firstName} ${log.TimeSheet?.User?.lastName}`,
      truckId: log.Truck?.id ?? null,
      truckName: log.Truck?.name ?? null,
      trailerId: log.Trailer?.id ?? null,
      trailerName: log.Trailer?.name ?? null,
      date: log.TimeSheet?.date ?? null,
      jobId: log.TimeSheet?.Jobsite?.name ?? null,
      Equipment: log.EquipmentHauled.map((equipment) => ({
        name: equipment.Equipment?.name || "",
        id: equipment.Equipment?.id || null,
        source: equipment.source,
        destination: equipment.destination,
        startMileage: equipment.startMileage,
        endMileage: equipment.endMileage,
      })),
      Materials: log.Materials.map((material) => ({
        id: material.truckingLogId,
        name: material.name,
        location: material.LocationOfMaterial,
        quantity: material.quantity,
        unit: material.unit,
      })),
      StartingMileage: log.startingMileage,
      Fuel: log.RefuelLogs.map((fuel) => ({
        id: fuel.truckingLogId,
        milesAtFueling: fuel.milesAtFueling,
        gallonsRefueled: fuel.gallonsRefueled,
      })),
      StateMileages: log.StateMileages.map((state) => ({
        id: state.truckingLogId,
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
