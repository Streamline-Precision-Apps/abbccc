import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic"; // ✅ Ensures this API is dynamic and never pre-rendered

/**
 * GET /api/getAllTimesheetInfo?page=1&pageSize=25
 * Returns paginated timesheets for admins.
 */
export async function GET(req: Request) {
  let session;

  // Handle authentication errors
  try {
    session = await auth();
  } catch (error) {
    console.error("Error during authentication:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 },
    );
  }

  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Parse pagination params
  const { searchParams } = new URL(req.url);

  const status = searchParams.get("status") || "all";
  const search = searchParams.get("search")?.trim() || "";
  // Optional filters
  const jobsiteId = searchParams.get("jobsiteId");
  const costCode = searchParams.get("costCode");
  const userIdFilter = searchParams.get("userId");
  const dateFromParam = searchParams.get("dateFrom");
  const dateToParam = searchParams.get("dateTo");
  const changes = searchParams.get("changes");

  let timesheets, total, pageSize, page, skip, totalPages;

  const pendingTimesheetsCount = await prisma.timeSheet.count({
    where: { status: "PENDING" },
  });

  try {
    // Build filter object for Prisma where
    const filter: Record<string, unknown> = {};
    if (jobsiteId) filter.Jobsite = { code: jobsiteId };
    if (costCode) filter.CostCode = { code: costCode };
    if (userIdFilter) filter.User = { id: userIdFilter };
    // Date range filter
    if (dateFromParam || dateToParam) {
      const dateFilter: Record<string, Date> = {};
      if (dateFromParam) dateFilter.gte = new Date(dateFromParam);
      if (dateToParam) dateFilter.lte = new Date(dateToParam);
      filter.date = dateFilter;
    }
    // Status filter
    if (status === "APPROVED") {
      filter.status = "APPROVED";
    } else if (status === "REJECTED") {
      filter.status = "REJECTED";
    } else if (status === "PENDING") {
      filter.status = "PENDING";
    }

    // Show changes filter: only timesheets with matching ChangeLogs
    if (changes === "HAS_CHANGES") {
      filter.ChangeLogs = {
        some: {
          OR: [
            { numberOfChanges: { gt: 1 } },
            {
              numberOfChanges: 1,
              wasStatusChange: false,
            },
          ],
        },
      };
    }

    page = undefined;
    pageSize = undefined;
    skip = undefined;
    totalPages = 1;
    if (status === "pending") {
      // Return all pending timesheets, no pagination
      timesheets = await prisma.timeSheet.findMany({
        where: {
          status: "PENDING",
          ...filter,
        },
        select: {
          id: true,
          date: true,
          User: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          Jobsite: {
            select: {
              name: true,
              code: true,
            },
          },
          CostCode: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
          nu: true,
          Fp: true,
          startTime: true,
          endTime: true,
          comment: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          workType: true,
          EmployeeEquipmentLogs: {
            select: {
              id: true,
              equipmentId: true,
              Equipment: {
                select: {
                  id: true,
                  name: true,
                },
              },
              startTime: true,
              endTime: true,
            },
          },
          TruckingLogs: {
            select: {
              truckNumber: true,
              startingMileage: true,
              endingMileage: true,
              RefuelLogs: {
                select: {
                  milesAtFueling: true,
                },
              },
            },
          },
          TascoLogs: {
            select: {
              shiftType: true,
              LoadQuantity: true,
            },
          },
          _count: {
            select: {
              ChangeLogs: {
                where: {
                  OR: [
                    { numberOfChanges: { gt: 1 } }, // more than one change
                    {
                      numberOfChanges: 1,
                      wasStatusChange: false, // single change, but not status
                    },
                  ],
                },
              }, // Count the number of ChangeLogs
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      total = timesheets.length;
    } else if (search !== "") {
      page = undefined;
      pageSize = undefined;
      skip = undefined;
      totalPages = 1;
      // Query the database for paginated timesheets
      timesheets = await prisma.timeSheet.findMany({
        where: {
          ...filter,
        },
        select: {
          id: true,
          date: true,
          User: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          Jobsite: {
            select: {
              name: true,
              code: true,
            },
          },
          CostCode: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
          nu: true,
          Fp: true,
          startTime: true,
          endTime: true,
          comment: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          workType: true,
          EmployeeEquipmentLogs: {
            select: {
              id: true,
              equipmentId: true,
              Equipment: {
                select: {
                  id: true,
                  name: true,
                },
              },
              startTime: true,
              endTime: true,
            },
          },
          TruckingLogs: {
            select: {
              truckNumber: true,
              startingMileage: true,
              endingMileage: true,
              RefuelLogs: {
                select: {
                  milesAtFueling: true,
                },
              },
            },
          },
          TascoLogs: {
            select: {
              shiftType: true,
              LoadQuantity: true,
            },
          },
          _count: {
            select: {
              ChangeLogs: {
                where: {
                  OR: [
                    { numberOfChanges: { gt: 1 } }, // more than one change
                    {
                      numberOfChanges: 1,
                      wasStatusChange: false, // single change, but not status
                    },
                  ],
                },
              }, // Count the number of ChangeLogs
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      page = parseInt(searchParams.get("page") || "1", 10);
      pageSize = parseInt(searchParams.get("pageSize") || "25", 10);
      skip = (page - 1) * pageSize;
      total = await prisma.timeSheet.count({ where: { ...filter } });
      totalPages = Math.ceil(total / pageSize);

      // Query the database for paginated timesheets
      timesheets = await prisma.timeSheet.findMany({
        skip,
        take: pageSize,
        where: {
          ...filter,
        },
        select: {
          id: true,
          date: true,
          User: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          Jobsite: {
            select: {
              name: true,
              code: true,
            },
          },
          CostCode: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
          nu: true,
          Fp: true,
          startTime: true,
          endTime: true,
          comment: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          workType: true,
          EmployeeEquipmentLogs: {
            select: {
              id: true,
              equipmentId: true,
              Equipment: {
                select: {
                  id: true,
                  name: true,
                },
              },
              startTime: true,
              endTime: true,
            },
          },
          TruckingLogs: {
            select: {
              truckNumber: true,
              startingMileage: true,
              endingMileage: true,
              RefuelLogs: {
                select: {
                  milesAtFueling: true,
                },
              },
            },
          },
          TascoLogs: {
            select: {
              shiftType: true,
              LoadQuantity: true,
            },
          },
          _count: {
            select: {
              ChangeLogs: {
                where: {
                  OR: [
                    { numberOfChanges: { gt: 1 } }, // more than one change
                    {
                      numberOfChanges: 1,
                      wasStatusChange: false, // single change, but not status
                    },
                  ],
                },
              }, // Count the number of ChangeLogs
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json({
      timesheets,
      total,
      page,
      pageSize,
      totalPages,
      pendingTimesheets: pendingTimesheetsCount,
    });
  } catch (error) {
    console.error("Error fetching Time Sheets:", error);
    return NextResponse.json(
      { error: "Failed to fetch pay period sheets" },
      { status: 500 },
    );
  }
}
