"use server";
import { auth } from "@/auth";
import NewClockProcess from "@/components/(clock)/newclockProcess";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Helper function to fetch cookie data
const getCookieData = async () => {
  const cookieStore = cookies();
  const timeSheetId = cookieStore.get("timeSheetId")?.value;
  const jobSiteId = cookieStore.get("jobSiteId")?.value;
  const costCode = cookieStore.get("costCode")?.value;
  const workRole = cookieStore.get("workRole")?.value;

  return { timeSheetId, jobSiteId, costCode, workRole };
};

export default async function SwitchJobs() {
  const session = await auth();

  if (!session) {
    // Redirect or return an error if the user is not authenticated
    redirect("/signin");
  }

  // Fetch all records
  const user = session.user;

  // Get the current language from cookies
  const lang = cookies().get("locale");
  const locale = lang?.value || "en";
  // Fetch cookie data
  const { timeSheetId, jobSiteId, costCode, workRole } = await getCookieData();
  return (
    <Bases>
      <Contents>
        <Holds background={"white"} className="h-full">
          <NewClockProcess
            mechanicView={user.mechanicView}
            tascoView={user.tascoView}
            truckView={user.truckView}
            laborView={user.laborView}
            option="clockin"
            returnpath="/dashboard"
            type={"switchJobs"}
            scannerType={"jobsite"}
            locale={locale}
            timeSheetId={timeSheetId}
            jobSiteId={jobSiteId}
            costCode={costCode}
            workRole={workRole}
          />
        </Holds>
      </Contents>
    </Bases>
  );
}
