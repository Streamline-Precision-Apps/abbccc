"use server";
import { auth } from "@/auth";
import ClockOutContent from "./clockOutContent";
import { redirect } from "next/navigation";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";

export default async function AdminDashboard() {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  const userId = session.user.id;

  return (
    <Bases>
      <Contents>
        <ClockOutContent id={userId} />;
      </Contents>
    </Bases>
  );
}
