import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic"; // This API needs to be dynamic for cookie operations

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { timesheetId, workType, jobsite, costCode, tascoLog, truckingLog } =
      body;

    const cookieStore = await cookies();

    // Set the timesheet ID cookie
    cookieStore.set("prevTimeSheet", timesheetId, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    // Set the timesheet ID cookie
    cookieStore.set("timeSheetId", timesheetId, {
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
    const workRole = workRoleMapping[workType] || "general";
    cookieStore.set("workRole", workRole, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    // Set jobsite information
    cookieStore.set(
      "jobSite",
      JSON.stringify({
        code: jobsite.code,
        label: jobsite.name,
      }),
      {
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      },
    );

    // Set cost code
    cookieStore.set("costCode", costCode, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    // Set labor type and additional cookies based on work type
    if (workType === "TASCO" && tascoLog) {
      cookieStore.set("laborType", tascoLog.laborType || "", {
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
      if (tascoLog.equipmentQrId) {
        cookieStore.set("equipment", tascoLog.equipmentQrId, {
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 1 week
        });
      }
    } else if (workType === "TRUCK_DRIVER" && truckingLog) {
      cookieStore.set("laborType", truckingLog.laborType || "truckDriver", {
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
      if (truckingLog.equipmentQrId) {
        cookieStore.set("truck", truckingLog.equipmentQrId, {
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to set timesheet cookies:", error);
    return NextResponse.json(
      { error: "Failed to set cookies" },
      { status: 500 },
    );
  }
}
