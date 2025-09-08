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

  // If there's an incomplete timesheet, redirect to continue-timesheet page with URL parameters
  if (incompleteTimesheet) {
    const params = new URLSearchParams({
      timesheetId: incompleteTimesheet.id.toString(),
      workType: incompleteTimesheet.workType,
      jobsiteCode: incompleteTimesheet.Jobsite.qrId,
      jobsiteName: incompleteTimesheet.Jobsite.name,
      costCode: incompleteTimesheet.CostCode.name,
    });

    // Add TASCO-specific parameters
    if (incompleteTimesheet.TascoLogs?.[0]) {
      const tascoLog = incompleteTimesheet.TascoLogs[0];
      if (tascoLog.laborType) {
        params.append('tascoLaborType', tascoLog.laborType);
      }
      if (tascoLog.Equipment?.qrId) {
        params.append('tascoEquipmentQrId', tascoLog.Equipment.qrId);
      }
    }

    // Add Trucking-specific parameters
    if (incompleteTimesheet.TruckingLogs?.[0]) {
      const truckingLog = incompleteTimesheet.TruckingLogs[0];
      if (truckingLog.laborType) {
        params.append('truckingLaborType', truckingLog.laborType);
      }
      if (truckingLog.Equipment?.qrId) {
        params.append('truckingEquipmentQrId', truckingLog.Equipment.qrId);
      }
      if (truckingLog.startingMileage) {
        params.append('truckingStartingMileage', truckingLog.startingMileage.toString());
      }
    }

    // Redirect to the continue-timesheet page with parameters
    redirect(`/continue-timesheet?${params.toString()}`);
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
