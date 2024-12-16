"use server";

import EmployeeInfo from "./employee-info";
import { EmployeeTimeSheets } from "./employee-timesheet";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
export default async function crewMember() {
  return (
    <Bases className="h-min-screen h-dvh">
      <Contents>
        <EmployeeInfo />
        <Holds className="mt-5">
          <EmployeeTimeSheets />
        </Holds>
      </Contents>
    </Bases>
  );
}
