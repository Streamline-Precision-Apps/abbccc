import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // Authentication
    const session = await auth();
    if (!session) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    // Get timesheet ID from URL parameters
    const { searchParams } = new URL(request.url);
    const timesheetId = searchParams.get("id");

    if (!timesheetId) {
      console.error("No timesheet ID provided");
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Fetch the timesheet data
    const incompleteTimesheet = await prisma.timeSheet.findFirst({
      where: {
        id: parseInt(timesheetId),
        userId: session.user.id,
        endTime: null, // Ensure it's still incomplete
      },
      include: {
        Jobsite: {
          select: {
            id: true,
            qrId: true,
            name: true,
          },
        },
        CostCode: {
          select: {
            id: true,
            name: true,
          },
        },
        TascoLogs: {
          select: {
            shiftType: true,
            laborType: true,
            materialType: true,
            Equipment: {
              select: {
                qrId: true,
                name: true,
              },
            },
          },
        },
        TruckingLogs: {
          select: {
            laborType: true,
            truckNumber: true,
            startingMileage: true,
            Equipment: {
              select: {
                qrId: true,
                name: true,
              },
            },
          },
        },
      },
    });

    // If timesheet doesn't exist or is completed, redirect to home
    if (!incompleteTimesheet) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Set cookies using server-side cookie manipulation
    const cookieStore = await cookies();

    // Set the timesheet ID cookie
    cookieStore.set("prevTimeSheet", incompleteTimesheet.id.toString(), {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    // Set the timesheet ID cookie
    cookieStore.set("timeSheetId", incompleteTimesheet.id.toString(), {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    // Set the current page view
    cookieStore.set("currentPageView", "dashboard", {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    // Set work role based on timesheet workType
    const workRoleMapping: Record<string, string> = {
      LABOR: "general",
      MECHANIC: "mechanic",
      TASCO: "tasco",
      TRUCK_DRIVER: "truck",
    };
    const workRole = workRoleMapping[incompleteTimesheet.workType] || "general";
    cookieStore.set("workRole", workRole, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    // Set jobsite information
    cookieStore.set(
      "jobSite",
      JSON.stringify({
        code: incompleteTimesheet.Jobsite.qrId,
        label: incompleteTimesheet.Jobsite.name,
      }),
      {
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      },
    );

    // Set cost code
    cookieStore.set("costCode", incompleteTimesheet.CostCode.name, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    // Set labor type and additional cookies based on work type
    if (
      incompleteTimesheet.workType === "TASCO" &&
      incompleteTimesheet.TascoLogs?.[0]
    ) {
      const tascoLog = incompleteTimesheet.TascoLogs[0];
      cookieStore.set("laborType", tascoLog.laborType || "", {
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
      if (tascoLog.Equipment?.qrId) {
        cookieStore.set("equipment", tascoLog.Equipment.qrId, {
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 1 week
        });
      }
    } else if (
      incompleteTimesheet.workType === "TRUCK_DRIVER" &&
      incompleteTimesheet.TruckingLogs?.[0]
    ) {
      const truckingLog = incompleteTimesheet.TruckingLogs[0];
      cookieStore.set("laborType", truckingLog.laborType || "truckDriver", {
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
      if (truckingLog.Equipment?.qrId) {
        cookieStore.set("truck", truckingLog.Equipment.qrId, {
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 1 week
        });
      }
      if (truckingLog.startingMileage) {
        cookieStore.set(
          "startingMileage",
          truckingLog.startingMileage.toString(),
          {
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 1 week
          },
        );
      }
    } else {
      // For LABOR and MECHANIC, set default labor type
      cookieStore.set("laborType", "", {
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
    }

    // Redirect directly to dashboard - single redirect!
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (error) {
    console.error("Failed to continue timesheet:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}
