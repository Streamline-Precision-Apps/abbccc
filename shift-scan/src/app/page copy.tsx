import { cookies } from "next/headers";
import { auth } from "@/auth";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { redirect } from "next/navigation";
import { Grids } from "@/components/(reusable)/grids";
import HamburgerMenuNew from "@/components/(animations)/hamburgerMenuNew";
import WidgetSection from "./(content)/widgetSection";
import prisma from "@/lib/prisma";

// Server Action to set timesheet continuation cookies

type IncompleteTimesheet = {
  id: number;
  workType: string;
  Jobsite: { qrId: string; name: string; id: string };
  CostCode: { name: string; id: string };
  TascoLogs?: Array<{
    laborType: string | null;
    Equipment: { qrId: string; name: string } | null;
  }>;
  TruckingLogs?: Array<{
    laborType: string | null;
    startingMileage: number | null;
    Equipment: { qrId: string; name: string } | null;
  }>;
};

async function setTimesheetCookiesAction(incompleteTimesheet: IncompleteTimesheet) {
  "use server";
  
  const cookieStore = await cookies();
  
  try {
    // Set the timesheet ID cookie
    cookieStore.set("prevTimeSheet", incompleteTimesheet.id.toString(), {
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
    cookieStore.set("jobSite", JSON.stringify({
      code: incompleteTimesheet.Jobsite.qrId,
      label: incompleteTimesheet.Jobsite.name,
    }), {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    // Set cost code
    cookieStore.set("costCode", incompleteTimesheet.CostCode.name, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    // Set labor type and additional cookies based on work type
    if (incompleteTimesheet.workType === "TASCO" && incompleteTimesheet.TascoLogs?.[0]) {
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
    } else if (incompleteTimesheet.workType === "TRUCK_DRIVER" && incompleteTimesheet.TruckingLogs?.[0]) {
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
        cookieStore.set("startingMileage", truckingLog.startingMileage.toString(), {
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 1 week
        });
      }
    } else {
      // For LABOR and MECHANIC, set default labor type
      cookieStore.set("laborType", "", {
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
    }
    
    return { success: true };
  } catch (error) {
    console.error("Failed to set timesheet cookies:", error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export default async function Home() {
  //------------------------------------------------------------------------
  // Authentication: Get the current user
  const session = await auth();
  if (!session) {
    // Redirect or return an error if the user is not authenticated
    redirect("/signin");
  } else if (!session.user.accountSetup) {
    // Redirect to account setup if not completed
    redirect("/signin/signup");
  }

  const terminationDate = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      terminationDate: true,
    },
  });

  const isTerminate = terminationDate?.terminationDate !== null ? true : false;

  // Check for incomplete timesheets (no endTime)
  const incompleteTimesheet = await prisma.timeSheet.findFirst({
    where: {
      userId: session.user.id,
      endTime: null, // No end time means still clocked in
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
    orderBy: {
      startTime: "desc", // Get the most recent incomplete timesheet
    },
  });

  // If there's an incomplete timesheet, validate it exists and set cookies
  if (incompleteTimesheet) {
    try {
      // Double-check that the timesheet still exists and is valid
      const timesheetValidation = await prisma.timeSheet.findUnique({
        where: {
          id: incompleteTimesheet.id,
        },
        select: {
          id: true,
          endTime: true,
        },
      });

      // If the timesheet doesn't exist or has been completed, clear any related cookies and continue to main page
      if (!timesheetValidation || timesheetValidation.endTime) {
        console.log("Timesheet no longer exists or has been completed, clearing any related cookies");
        
        // Clear any potentially stale cookies (this is optional but helps with cleanup)
        const cookieStore = await cookies();
        cookieStore.delete("prevTimeSheet");
        cookieStore.delete("workRole");
        cookieStore.delete("jobSite");
        cookieStore.delete("costCode");
        cookieStore.delete("laborType");
        
        // Continue to main page instead of trying to set cookies
      } else {
        // Timesheet is valid, set cookies and redirect to dashboard
        const result = await setTimesheetCookiesAction(incompleteTimesheet);
        if (!result.success) {
          console.error("Failed to set timesheet cookies:", result.error);
        }
        
        // Redirect directly to dashboard instead of continue-timesheet page
        redirect("/dashboard");
      }
    } catch (error) {
      console.error("Failed to validate or set timesheet continuation cookies:", error);
      // Clear potentially stale cookies on error
      const cookieStore = await cookies();
      cookieStore.delete("prevTimeSheet");
      // Continue to main page on error
    }
  }

  // Get the current language from cookies
  const lang = (await cookies()).get("locale");
  const locale = lang ? lang.value : "en";

  return (
    <Bases>
      <Contents>
        <Grids rows={"8"} gap={"5"}>
          <HamburgerMenuNew />
          <WidgetSection
            locale={locale}
            session={session}
            isTerminate={isTerminate}
          />
        </Grids>
      </Contents>
    </Bases>
  );
}
