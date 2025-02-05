"use server";
import { auth } from "@/auth";
import ClockOutContent from "@/app/(routes)/dashboard/clock-out/clockOutContent";
import { redirect } from "next/navigation";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";

export default async function ClockOutPage() {
  const session = await auth();
  if (!session) {
    redirect("/signin");
  }

  return (
    <Bases>
      <Contents>
        <ClockOutContent />
      </Contents>
    </Bases>
  );
}
