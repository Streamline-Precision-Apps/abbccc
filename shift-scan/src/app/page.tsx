"use server";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { redirect } from "next/navigation";
import { Grids } from "@/components/(reusable)/grids";
import HamburgerMenuNew from "@/components/(animations)/hamburgerMenuNew";
import WidgetSection from "./(content)/widgetSection";
import prisma from "@/lib/prisma";
import {
  setCurrentPageView,
  setWorkRole,
  setLaborType,
  setJobSite,
  setCostCode,
  setPrevTimeSheet,
  setEquipment,
  setTruck,
  setStartingMileage,
} from "@/actions/cookieActions";

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

  // If there's an incomplete timesheet, set cookies and redirect to dashboard
  if (incompleteTimesheet) {
    // Set the timesheet ID cookie
    await setPrevTimeSheet(incompleteTimesheet.id);

    // Set the current page view
    await setCurrentPageView("dashboard");

    // Set work role based on timesheet workType
    const workRoleMapping: Record<string, string> = {
      LABOR: "general",
      MECHANIC: "mechanic",
      TASCO: "tasco",
      TRUCK_DRIVER: "truck",
    };
    await setWorkRole(
      workRoleMapping[incompleteTimesheet.workType] || "general",
    );

    // Set jobsite information
    await setJobSite({
      code: incompleteTimesheet.Jobsite.qrId,
      label: incompleteTimesheet.Jobsite.name,
    });

    // Set cost code
    await setCostCode(incompleteTimesheet.CostCode.name);

    // Set labor type and additional cookies based on work type
    if (
      incompleteTimesheet.workType === "TASCO" &&
      incompleteTimesheet.TascoLogs?.[0]
    ) {
      const tascoLog = incompleteTimesheet.TascoLogs[0];
      await setLaborType(tascoLog.laborType || "");
      if (tascoLog.Equipment?.qrId) {
        await setEquipment(tascoLog.Equipment.qrId);
      }
    } else if (
      incompleteTimesheet.workType === "TRUCK_DRIVER" &&
      incompleteTimesheet.TruckingLogs?.[0]
    ) {
      const truckingLog = incompleteTimesheet.TruckingLogs[0];
      await setLaborType(truckingLog.laborType || "truckDriver");
      if (truckingLog.Equipment?.qrId) {
        await setTruck(truckingLog.Equipment.qrId);
      }
      if (truckingLog.startingMileage) {
        await setStartingMileage(truckingLog.startingMileage.toString());
      }
    } else {
      // For LABOR and MECHANIC, set default labor type
      await setLaborType("");
    }

    // Redirect to dashboard
    redirect("/dashboard");
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
