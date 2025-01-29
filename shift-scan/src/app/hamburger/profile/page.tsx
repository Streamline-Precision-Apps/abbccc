"use server";
import { Bases } from "@/components/(reusable)/bases";
import EmployeeInfo from "./employeeInfo";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function EmployeeProfile() {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  return (
    <Bases>
      <EmployeeInfo />
    </Bases>
  );
}
