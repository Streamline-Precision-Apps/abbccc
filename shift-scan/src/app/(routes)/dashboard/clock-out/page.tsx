"use server";
import { auth } from "@/auth";
import ClockOutContent from "@/app/(routes)/dashboard/clock-out/clockOutContent";
import { redirect } from "next/navigation";

export default async function ClockOutPage() {
  const session = await auth();
  if (!session) {
    redirect("/signin");
  }
  // Pass user id and permission so downstream logic can determine manager/team status
  return <ClockOutContent userId={session.user.id} permission={session.user.permission} />;
}
