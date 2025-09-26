import { auth } from "@/auth";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { redirect } from "next/navigation";
import { Grids } from "@/components/(reusable)/grids";
import HamburgerMenuNew from "@/components/(animations)/hamburgerMenuNew";
import WidgetSection from "./(content)/widgetSection";
import prisma from "@/lib/prisma";
<<<<<<< HEAD
import { Suspense } from "react";
=======
import { cookies } from "next/headers";
>>>>>>> 63cb0af91b1662f27f4a234d742f3ffa0812c2ce

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

  // If there's an incomplete timesheet, redirect to continue-timesheet API route
  if (incompleteTimesheet) {
    // Single redirect to API route that sets cookies and redirects to dashboard
    redirect(`/api/continue-timesheet?id=${incompleteTimesheet.id}`);
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
