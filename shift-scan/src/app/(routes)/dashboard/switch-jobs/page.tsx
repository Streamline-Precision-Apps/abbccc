"use server";
import { auth } from "@/auth";
import ClockProcessor from "@/components/(clock)/clockProcess";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function SwitchJobs() {
  const session = await auth();

  if (!session) {
    // Redirect or return an error if the user is not authenticated
    redirect("/signin");
  }

  // Fetch all records

  const lang = (await cookies()).get("locale");
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
