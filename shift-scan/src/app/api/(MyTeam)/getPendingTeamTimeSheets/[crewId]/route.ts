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
        Crews: {
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
        TimeSheets: {
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
            CostCode: {
              select: {
                name: true,
              },
            },
            TascoLogs: {
              select: {
                id: true,
                shiftType: true,
                materialType: true,
                LoadQuantity: true,
                Equipment: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                RefuelLogs: {
                  select: {
                    id: true,
                    gallonsRefueled: true,
                  },
                },
              },
            },
            TruckingLogs: {
              select: {
                id: true,
                laborType: true,
                Equipment: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                startingMileage: true,
                endingMileage: true,
                Materials: {
                  select: {
                    id: true,
                    name: true,
                    quantity: true,
                    loadType: true,
                    grossWeight: true,
                    lightWeight: true,
                    materialWeight: true,
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
                    JobSite: {
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
            EmployeeEquipmentLogs: {
              select: {
                id: true,
                startTime: true,
                endTime: true,
                Equipment: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                RefuelLogs: {
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
