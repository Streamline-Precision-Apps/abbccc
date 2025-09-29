import { auth } from "@/auth";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { redirect } from "next/navigation";
import { Grids } from "@/components/(reusable)/grids";
import HamburgerMenuNew from "@/components/(animations)/hamburgerMenuNew";
import WidgetSection from "./(content)/widgetSection";
import prisma from "@/lib/prisma";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { Holds } from "@/components/(reusable)/holds";
import Spinner from "@/components/(animations)/spinner";

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
          <Suspense
            fallback={
              <Holds
                position={"row"}
                background={"white"}
                className="row-start-1 row-end-2 h-full p-2 py-3"
              />
            }
          >
            <HamburgerMenuNew isHome={true} />
          </Suspense>
          <Suspense
            fallback={
              <>
                <Holds className="row-span-2 bg-app-blue bg-opacity-20 w-full p-10 h-[80%] rounded-[10px] animate-pulse"></Holds>
                <Holds
                  background={"white"}
                  className="row-span-5 h-full justify-center items-center animate-pulse"
                >
                  <Spinner />
                </Holds>
              </>
            }
          >
            <WidgetSection
              locale={locale}
              session={session}
              isTerminate={isTerminate}
            />
          </Suspense>
        </Grids>
      </Contents>
    </Bases>
  );
}
