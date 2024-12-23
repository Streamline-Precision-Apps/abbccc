"use server";
import { auth } from "@/auth";
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
  const lang = cookies().get("locale");
  const locale = lang ? lang.value : "en"; // Default to English
  return (
    <Bases>
      <Contents className="h-full">
        <Holds background={"white"} className="w-full h-full ">
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
          />
        </Holds>
      </Contents>
    </Bases>
  );
}
