import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { formatInTimeZone } from "date-fns-tz";

export const dynamic = "force-dynamic"; // ✅ Ensures this API is dynamic and never pre-rendered

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get("employeeId");
    const date = searchParams.get("date");
    const type = searchParams.get("type");

    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!employeeId) {
      return NextResponse.json(
        { error: "Missing employeeId" },
        { status: 400 }
      );
    }

    if (!date) {
      return NextResponse.json({ error: "Missing date" }, { status: 400 });
    }

    const startOfDay = new Date(date);
    if (isNaN(startOfDay.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(startOfDay);
    endOfDay.setUTCHours(23, 59, 59, 999);

    let result;

    if (type === "timesheetHighlights") {
      const timeSheets = await prisma.timeSheet.findMany({
        where: {
          userId: employeeId,
          date: {
            gte: startOfDay.toISOString(), // Start of the day in UTC
            lte: endOfDay.toISOString(), // End of the day in UTC
          },
        },
        orderBy: {
          startTime: "asc",
        },
        include: {
          Jobsite: {
            select: {
              name: true,
            },
          },
          TascoLogs: true,
          TruckingLogs: true,
          MaintenanceLogs: true,
          EmployeeEquipmentLogs: true,
        },
      });

      if (!timeSheets || timeSheets.length === 0) {
        return NextResponse.json(
          { message: "No timesheets found for the specified date." },
          { status: 404 }
        );
      }

      // Just send the raw data:
      result = timeSheets;
    }
    if (type === "truckingMileage") {
      const timeSheets = await prisma.timeSheet.findMany({
        where: {
          userId: employeeId,
          date: {
            gte: startOfDay.toISOString(), // Start of the day in UTC
            lte: endOfDay.toISOString(), // End of the day in UTC
          },
        },
        orderBy: {
          startTime: "asc",
        },
        select: {
          TruckingLogs: {
            select: {
              id: true,
              timeSheetId: true,
              equipmentId: true,
              Equipment: {
                select: {
                  name: true,
                },
              },
              startingMileage: true,
              endingMileage: true,
            },
          },
        },
      });

      result = timeSheets;
    }
    if (type === "truckingEquipmentHaulLogs") {
      const timeSheets = await prisma.timeSheet.findMany({
        where: {
          userId: employeeId,
          date: {
            gte: startOfDay.toISOString(),
            lte: endOfDay.toISOString(),
          },
        },
        orderBy: {
          startTime: "asc",
        },
        select: {
          TruckingLogs: {
            select: {
              id: true,
              Equipment: {
                select: {
                  name: true,
                },
              },
              EquipmentHauled: {
                select: {
                  id: true,
                  Equipment: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                  JobSite: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      // Filter out timesheets with empty TruckingLogs arrays
      result = timeSheets;
    }
    if (type === "truckingMaterialHaulLogs") {
      const timeSheets = await prisma.timeSheet.findMany({
        where: {
          userId: employeeId,
          date: {
            gte: startOfDay.toISOString(),
            lte: endOfDay.toISOString(),
          },
        },
        orderBy: {
          startTime: "asc",
        },
        select: {
          TruckingLogs: {
            select: {
              id: true,
              Materials: {
                select: {
                  id: true,
                  name: true,
                  LocationOfMaterial: true,
                  materialWeight: true,
                  lightWeight: true,
                  grossWeight: true,
                },
              },
            },
          },
        },
      });

      // Filter out timesheets with empty TruckingLogs arrays
      result = timeSheets;
    }
    if (type === "truckingRefuelLogs") {
      const timeSheets = await prisma.timeSheet.findMany({
        where: {
          userId: employeeId,
          date: {
            gte: startOfDay.toISOString(), // Start of the day in UTC
            lte: endOfDay.toISOString(), // End of the day in UTC
          },
        },
        orderBy: {
          startTime: "asc",
        },
        select: {
          TruckingLogs: {
            select: {
              id: true,
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
                  milesAtFueling: true,
                },
              },
            },
          },
        },
      });

      result = timeSheets;
    }
    if (type === "truckingStateLogs") {
      const timeSheets = await prisma.timeSheet.findMany({
        where: {
          userId: employeeId,
          date: {
            gte: startOfDay.toISOString(), // Start of the day in UTC
            lte: endOfDay.toISOString(), // End of the day in UTC
          },
        },
        orderBy: {
          startTime: "asc",
        },
        select: {
          TruckingLogs: {
            select: {
              Equipment: {
                select: {
                  id: true,
                  name: true,
                },
              },
              StateMileages: {
                select: {
                  id: true,
                  truckingLogId: true,
                  state: true,
                  stateLineMileage: true,
                },
              },
            },
          },
        },
      });

      result = timeSheets;
    }
    if (type === "tascoHaulLogs") {
      const timeSheets = await prisma.timeSheet.findMany({
        where: {
          userId: employeeId,
          date: {
            gte: startOfDay.toISOString(), // Start of the day in UTC
            lte: endOfDay.toISOString(), // End of the day in UTC
          },
        },
        orderBy: {
          startTime: "asc",
        },
        select: {
          TascoLogs: {
            select: {
              id: true,
              timeSheetId: true,
              shiftType: true,
              equipmentId: true,
              laborType: true,
              materialType: true,
              LoadQuantity: true,
            },
          },
        },
      });

      result = timeSheets;
    }

    if (type === "tascoRefuelLogs") {
      const timeSheets = await prisma.timeSheet.findMany({
        where: {
          userId: employeeId,
          date: {
            gte: startOfDay.toISOString(), // Start of the day in UTC
            lte: endOfDay.toISOString(), // End of the day in UTC
          },
        },
        orderBy: {
          startTime: "asc",
        },
        select: {
          TascoLogs: {
            select: {
              id: true,
              Equipment: {
                select: {
                  id: true,
                  name: true,
                },
              },
              RefuelLogs: {
                select: {
                  id: true,
                  tascoLogId: true,
                  gallonsRefueled: true,
                },
              },
            },
          },
        },
      });

      result = timeSheets;
    }

    if (type === "equipmentLogs") {
      const timeSheets = await prisma.timeSheet.findMany({
        where: {
          userId: employeeId,
          date: {
            gte: startOfDay.toISOString(), // Start of the day in UTC
            lte: endOfDay.toISOString(), // End of the day in UTC
          },
        },
        orderBy: {
          startTime: "asc",
        },
        select: {
          EmployeeEquipmentLogs: {
            select: {
              id: true,
              employeeId: true,
              Equipment: {
                select: {
                  id: true,
                  name: true,
                },
              },
              Jobsite: {
                select: {
                  id: true,
                  name: true,
                },
              },
              startTime: true,
              endTime: true,
            },
          },
        },
      });

      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const adjustedTimeSheets = timeSheets.map((sheet) => {
        const baseData = {
          ...sheet,
        };

        // Process each equipment log's times
        const adjustedLogs = sheet.EmployeeEquipmentLogs.map((log) => ({
          ...log,
          startTime: log.startTime
            ? formatInTimeZone(log.startTime, timeZone, "yyyy-MM-dd HH:mm:ss")
            : "",
          endTime: log.endTime
            ? formatInTimeZone(log.endTime, timeZone, "yyyy-MM-dd HH:mm:ss")
            : "",
        }));

        return {
          ...baseData,
          EmployeeEquipmentLogs: adjustedLogs,
        };
      });

      result = adjustedTimeSheets;
    }

    if (type === "equipmentRefuelLogs") {
      const timeSheets = await prisma.timeSheet.findMany({
        where: {
          userId: employeeId,
          date: {
            gte: startOfDay.toISOString(),
            lte: endOfDay.toISOString(),
          },
        },
        orderBy: {
          startTime: "asc",
        },
        select: {
          EmployeeEquipmentLogs: {
            include: {
              Equipment: {
                select: {
                  id: true,
                  name: true,
                },
              },
              RefuelLogs: true,
            },
          },
        },
      });

      // Filter logs that have refuel logs
      result = timeSheets
        .flatMap((sheet) => sheet.EmployeeEquipmentLogs)
        .filter(
          (log) => Array.isArray(log.RefuelLogs) && log.RefuelLogs.length > 0
        );
    }

    return NextResponse.json(result, {
      headers: {
        "Cache-Control":
          "public, max-age=60, s-maxage=60, stale-while-revalidate=30",
      },
    });
  } catch (error) {
    console.error("Error fetching timesheets:", error);

    let errorMessage = "Failed to fetch timesheets";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
