"use server";
import { auth } from "@/auth";
import ClockProcessor from "@/components/(clock)/clockProcess";
import { Bases } from "@/components/(reusable)/bases";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Images } from "@/components/(reusable)/images";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { Grids } from "@/components/(reusable)/grids";

export default async function SwitchJobs() {
  const session = await auth();
  const userId = session?.user.id;

  //   const equipment = await prisma.equipment.findMany();

  const lang = cookies().get("locale");
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
