"use server";
import { auth } from "@/auth";
// import ClockProcessor from "@/components/(clock)/clockProcess";
import NewClockProcess from "@/components/(clock)/newclockProcess";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Clock() {
  const session = await auth();
  if (!session) {
    redirect("/signin");
  }

  const user = session.user;

  // Get the current language from cookies
  const lang = cookies().get("locale");
  const locale = lang?.value || "en";
  const currentRole = cookies().get("workRole")?.value || "";
  return (
    <Bases>
      <Contents>
        <Holds className="h-full">
          <NewClockProcess
            mechanicView={user.mechanicView}
            tascoView={user.tascoView}
            truckView={user.truckView}
            laborView={user.laborView}
            option="clockin"
            returnpath="/"
            type={"jobsite"}
            scannerType={"jobsite"}
            locale={locale}
            currentRole={currentRole}
          />
        </Holds>
      </Contents>
    </Bases>
  );
}

{
  /* <ClockProcessor
  type={"jobsite"}
  scannerType={"jobsite"}
  option="clockin"
  locale={locale}
  returnpath="/"
/> */
}
