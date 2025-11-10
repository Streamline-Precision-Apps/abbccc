import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { LoadType, Prisma } from "../../../../../../prisma/generated/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  let session;
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

  try {
    // Parse URL parameters for filtering
    const url = new URL(req.url);
    const jobsiteIds = url.searchParams.get("jobsiteIds")?.split(",").filter(Boolean) || [];
    const shiftTypes = url.searchParams.get("shiftTypes")?.split(",").filter(Boolean) || [];
    const employeeIds = url.searchParams.get("employeeIds")?.split(",").filter(Boolean) || [];
    const laborTypes = url.searchParams.get("laborTypes")?.split(",").filter(Boolean) || [];
    const equipmentIds = url.searchParams.get("equipmentIds")?.split(",").filter(Boolean) || [];
    const materialTypes = url.searchParams.get("materialTypes")?.split(",").filter(Boolean) || [];
    const dateFrom = url.searchParams.get("dateFrom");
    const dateTo = url.searchParams.get("dateTo");

    // Build where clause for filtering
    const whereClause: Prisma.TimeSheetWhereInput = {
      TascoLogs: {
        some: {} // At least one TascoLog must exist
      }
    };

    // Add filters to where clause
    if (jobsiteIds.length > 0) {
      whereClause.jobsiteId = { in: jobsiteIds };
    }

    if (employeeIds.length > 0) {
      whereClause.userId = { in: employeeIds };
    }

    if (dateFrom || dateTo) {
      whereClause.date = {};
      if (dateFrom) whereClause.date.gte = new Date(dateFrom);
      if (dateTo) whereClause.date.lte = new Date(dateTo);
    }

    // Build TascoLogs where clause
    const tascoLogsWhere: Prisma.TascoLogWhereInput = {};
    if (shiftTypes.length > 0) {
      tascoLogsWhere.shiftType = { in: shiftTypes };
    }
    if (laborTypes.length > 0) {
      tascoLogsWhere.laborType = { in: laborTypes };
    }
    if (equipmentIds.length > 0) {
      tascoLogsWhere.equipmentId = { in: equipmentIds };
    }
    if (materialTypes.length > 0) {
      tascoLogsWhere.materialType = { in: materialTypes };
    }

    const report = await prisma.timeSheet.findMany({
      where: whereClause,
      select: {
        date: true,
        startTime: true,
        endTime: true,
        User: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        Jobsite: {
          select: {
            id: true,
            name: true,
          },
        },
        TascoLogs: {
          where: Object.keys(tascoLogsWhere).length > 0 ? tascoLogsWhere : undefined,
          select: {
            id: true,
            shiftType: true,
            laborType: true,
            Equipment: {
              select: {
                id: true,
                name: true,
              },
            },
            screenType: true,
            LoadQuantity: true,
            materialType: true,
          },
        },
      },
    });

    // Filter out timesheets with empty TascoLogs arrays
    const filteredReport = report.filter(
      (item) => Array.isArray(item.TascoLogs) && item.TascoLogs.length > 0,
    );

    const tascoReport = filteredReport.map((log) => {
      const shiftType = log.TascoLogs[0].shiftType;
      const laborType = log.TascoLogs[0].laborType;
      const loadQuantity = log.TascoLogs[0].LoadQuantity ?? 0; // Default to 0 if null/undefined
      
      // Determine loads based on shiftType instead of laborType
      const loadsABCDE = (shiftType === "ABCD Shift" || shiftType === "E Shift") 
        ? loadQuantity : null;
          
      const loadsF = (shiftType === "F Shift") 
        ? loadQuantity : null;
      
      return {
        id: log.TascoLogs[0].id, // Assuming you want the first log's ID
        shiftType: shiftType,
        submittedDate: log.date,
        employee: `${log.User.firstName} ${log.User.lastName}`,
        employeeId: log.User.id, // Add employee ID for filtering
        dateWorked: log.date,
        laborType: laborType,
        equipment: log.TascoLogs[0].Equipment?.name ?? "",
        equipmentId: log.TascoLogs[0].Equipment?.id ?? "", // Add equipment ID for filtering
        profitId: log.Jobsite?.name ?? "", // Add jobsite name as Profit ID
        jobsiteId: log.Jobsite?.id ?? "", // Add jobsite ID for filtering
        loadsABCDE: loadsABCDE,
        loadsF: loadsF,
        materials: log.TascoLogs[0].materialType ?? "",
        startTime: log.startTime,
        endTime: log.endTime,
        LoadType:
          log.TascoLogs[0].screenType === "SCREENED"
            ? LoadType.SCREENED
            : LoadType.UNSCREENED,
      };
    });

    if (!tascoReport.length) {
      return NextResponse.json(
        { error: "No timesheets with TascoLogs found" },
        { status: 404 },
      );
    }
    return NextResponse.json(tascoReport);
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error fetching timesheet by id:", error);
    return NextResponse.json(
      { error: "Failed to fetch timesheet" },
      { status: 500 },
    );
  }
}

// Get filter options for Tasco reports
export async function POST(req: Request) {
  let session;
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

  try {
    // Get all jobsites
    const jobsites = await prisma.jobsite.findMany({
      where: { status: "ACTIVE" },
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: "asc" },
    });

    // Get all employees who have Tasco logs
    const employees = await prisma.user.findMany({
      where: {
        TimeSheets: {
          some: {
            TascoLogs: {
              some: {}
            }
          }
        }
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
      orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
    });

    // Get all equipment used in Tasco logs
    const equipment = await prisma.equipment.findMany({
      where: {
        TascoLogs: {
          some: {}
        }
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: "asc" },
    });

    // Get all material types from Tasco logs
    const materialTypes = await prisma.tascoMaterialTypes.findMany({
      select: {
        name: true,
      },
      orderBy: { name: "asc" },
    });

    const filterOptions = {
      jobsites,
      employees: employees.map(emp => ({
        id: emp.id,
        name: `${emp.firstName} ${emp.lastName}`,
      })),
      equipment,
      materialTypes,
    };

    return NextResponse.json(filterOptions);
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error fetching filter options:", error);
    return NextResponse.json(
      { error: "Failed to fetch filter options" },
      { status: 500 },
    );
  }
}
