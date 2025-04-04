"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  request: Request,
  { params }: { params: { crewId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { crewId } = params;

    if (!crewId) {
      return NextResponse.json(
        { error: "Missing or invalid crew ID" },
        { status: 400 }
      );
    }

    const crew = await prisma.user.findMany({
      where: {
        crews: {
          some: {
            id: crewId,
          },
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        clockedIn: true,
        timeSheets: {
          where: {
            status: "PENDING",
            endTime: { not: null },
          },
          select: {
            id: true,
            date: true,
            startTime: true,
            endTime: true,
            jobsiteId: true,
            costCode: {
              select: {
                name: true,
                description: true,
              },
            },
            tascoLogs: {
              select: {
                id: true,
                shiftType: true,
                materialType: true,
                LoadQuantity: true,
                comment: true,
                equipment: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                refueled: {
                  select: {
                    id: true,
                    gallonsRefueled: true,
                  },
                },
              },
            },
            truckingLogs: {
              select: {
                id: true,
                laborType: true,
                equipment: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                startingMileage: true,
                endingMileage: true,
                Material: {
                  select: {
                    id: true,
                    name: true,
                    quantity: true,
                    loadType: true,
                    LoadWeight: true,
                  },
                },
                EquipmentHauled: {
                  select: {
                    id: true,
                    equipment: {
                      select: {
                        name: true,
                      },
                    },
                    jobSite: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
                Refueled: {
                  select: {
                    id: true,
                    gallonsRefueled: true,
                    milesAtfueling: true,
                  },
                },
                stateMileage: {
                  select: {
                    id: true,
                    state: true,
                    stateLineMileage: true,
                  },
                },
              },
            },
            employeeEquipmentLogs: {
              select: {
                id: true,
                startTime: true,
                endTime: true,
                equipment: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                refueled: {
                  select: {
                    id: true,
                    gallonsRefueled: true,
                  },
                },
              },
            },
            status: true,
          },
        },
      },
    });

    if (!crew) {
      return NextResponse.json({ error: "Crew not found" }, { status: 404 });
    }

    return NextResponse.json(crew);
  } catch (error) {
    console.error("Error fetching crew data:", error);

    let errorMessage = "Failed to fetch crew data";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
