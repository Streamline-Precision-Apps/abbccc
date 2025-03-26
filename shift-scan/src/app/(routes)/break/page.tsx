"use server";
import { auth } from "@/auth";
import NewClockProcess from "@/components/(clock)/newclockProcess";

import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const getCookieData = async () => {
  const cookieStore = cookies();
  const jobSiteId = cookieStore.get("jobSiteId")?.value;
  const costCode = cookieStore.get("costCode")?.value;
  const workRole = cookieStore.get("workRole")?.value;
  const switchLaborType = cookieStore.get("laborType")?.value;

  return { jobSiteId, costCode, workRole, switchLaborType };
};

export default async function Clock() {
  const session = await auth();
  if (!session) {
    redirect("/signin");
  }
  const user = session.user;
  const lang = cookies().get("locale");
  const locale = lang ? lang.value : "en"; // Default to English

  const { jobSiteId, costCode, workRole, switchLaborType } =
    await getCookieData();

  return (
    <Bases>
      <Contents>
        <NewClockProcess
          type={"jobsite"}
          scannerType={"jobsite"}
          option={"break"}
          locale={locale}
          returnpath="/"
          mechanicView={user.mechanicView}
          tascoView={user.tascoView}
          truckView={user.truckView}
          laborView={user.laborView}
          jobSiteId={jobSiteId}
          costCode={costCode}
          workRole={workRole}
          switchLaborType={switchLaborType}
        />
      </Contents>
    </Bases>
  );
}
