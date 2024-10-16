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

export default async function SwitchJobs() {
  const session = await auth();
  const userId = session?.user.id;

  // Fetch all records

  const lang = cookies().get("locale");
  const locale = lang ? lang.value : "en"; // Default to English

  return (
    <Bases size={"scroll"} className="min-h-screen">
      <Contents>
        <Holds>
          <ClockProcessor
            type={"switchJobs"}
            scannerType={"jobsite"}
            locale={locale}
            returnpath="/dashboard"
          />
        </Holds>
      </Contents>
    </Bases>
  );
}
