"use server";

import { Bases } from "@/components/(reusable)/bases";
import EmployeeInfo from "./employeeInfo";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Employee, Contact, UserTraining } from "@/lib/types";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { Grids } from "@/components/(reusable)/grids";

export default async function EmployeeProfile() {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
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
