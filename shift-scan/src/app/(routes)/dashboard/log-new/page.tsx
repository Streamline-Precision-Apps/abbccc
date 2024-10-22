"use server";
import { auth } from "@/auth";
import ClockProcessor from "@/components/(clock)/clockProcess";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { cookies } from "next/headers";
import { Grids } from "@/components/(reusable)/grids";
import { redirect } from "next/navigation";

export default async function SwitchJobs() {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }
  //   const equipment = await prisma.equipment.findMany();

  const lang = (await cookies()).get("locale");
  const locale = lang ? lang.value : "en"; // Default to English

  return (
    <Bases>
      <Contents>
        <Grids rows={"1"}>
          <Holds className="h-full row-span-1">
            <ClockProcessor
              type={"equipment"}
              scannerType={"equipment"}
              locale={locale}
              returnpath="/dashboard"
              // equipment={equipment}
            />
          </Holds>
        </Grids>
      </Contents>
    </Bases>
  );
}
