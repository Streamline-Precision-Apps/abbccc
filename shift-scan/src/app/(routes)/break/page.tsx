"use server";
import { auth } from "@/auth";
import ClockProcessor from "@/components/(clock)/clockProcess";
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
  const lang = (await cookies()).get("locale");
  const locale = lang ? lang.value : "en"; // Default to English
  return (
    <Bases>
      <Contents>
        <Holds background={"white"}>
          <ClockProcessor
            type={"jobsite"}
            scannerType={"jobsite"}
            option="break"
            locale={locale}
            returnpath="/"
          />
        </Holds>
      </Contents>
    </Bases>
  );
}
