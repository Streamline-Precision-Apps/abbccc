"use server";
import { auth } from "@/auth";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { cookies } from "next/headers";
import { Grids } from "@/components/(reusable)/grids";
import { redirect } from "next/navigation";
import NewClockProcess from "@/components/(clock)/newclockProcess";

export default async function SwitchJobs() {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }
  //   const equipment = await prisma.equipment.findMany();

  const lang = cookies().get("locale");
  const locale = lang ? lang.value : "en"; // Default to English
  return (
    <Bases>
      <Contents>
        <Grids rows={"1"}>
          <Holds className="h-full row-span-1">
            <NewClockProcess
              mechanicView={false}
              tascoView={false}
              truckView={false}
              laborView={false}
              type={"equipment"}
              returnpath="/dashboard"
              scannerType={"equipment"}
              option={"equipment"}
              locale={locale}
            />
          </Holds>
        </Grids>
      </Contents>
    </Bases>
  );
}
