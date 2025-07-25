import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic"; // ✅ Ensures this API is dynamic and never pre-rendered

export async function GET() {
  let session;

  // Handle authentication errors
  try {
    session = await auth();
  } catch (error) {
    Sentry.captureException(error);
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
    // Get the start and end of the current day
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Query the database for timesheets for the current day
    const timesheets = await prisma.timeSheet.findMany({
      where: {
        userId: userId,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        Jobsite: {
          select: {
            name: true,
          },
        },
        TascoLogs: {
          select: {
            laborType: true,
            shiftType: true,
          },
        },
        TruckingLogs: {
          select: {
            id: true,
            startingMileage: true,
            endingMileage: true,
            Equipment: {
              select: {
                name: true,
              },
            },
            Materials: {
              select: {
                id: true,
                name: true,
                quantity: true,
                unit: true,
                LocationOfMaterial: true,
                materialWeight: true,
                loadType: true,
                createdAt: true,
              },
            },
            EquipmentHauled: {
              select: {
                id: true,
                Equipment: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            RefuelLogs: {
              select: {
                id: true,
                gallonsRefueled: true,
                milesAtFueling: true,
              },
            },
            StateMileages: {
              select: {
                id: true,
                state: true,
                stateLineMileage: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    // Check if timesheets were found and return appropriate response

    return NextResponse.json(timesheets);
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error fetching Time Sheets:", error);
    return NextResponse.json(
      { error: "Failed to fetch pay period sheets" },
      { status: 500 }
    );
  }
}
