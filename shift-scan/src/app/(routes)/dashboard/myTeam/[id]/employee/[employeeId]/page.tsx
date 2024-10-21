"use server";

import EmployeeInfo from "./employee-info";
import { EmployeeTimeSheets } from "./employee-timesheet";
import prisma from "@/lib/prisma";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";

export default async function crewMember({
  params,
}: {
  params: { employeeId: string };
}) {
  return (
    <Bases>
      <Contents>
        <EmployeeInfo params={params} />
        <Holds className="mt-5">
          <EmployeeTimeSheets employeeId={params.employeeId} />
        </Holds>
      </Contents>
    </Bases>
  );
}
