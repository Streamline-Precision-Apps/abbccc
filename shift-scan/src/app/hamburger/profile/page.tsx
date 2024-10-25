"use server";
import { Bases } from "@/components/(reusable)/bases";
import EmployeeInfo from "./employeeInfo";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";

export default async function EmployeeProfile() {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  return (
    <Bases>
      <Contents>
        <Holds className="h-full ">
          <EmployeeInfo />
        </Holds>
      </Contents>
    </Bases>
  );
}
