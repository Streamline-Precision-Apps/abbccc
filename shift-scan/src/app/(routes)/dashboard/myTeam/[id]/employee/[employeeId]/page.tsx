"use server";

import EmployeeInfo from "./employee-info";
import { EmployeeTimeSheets } from "./employee-timesheet";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
type Params = Promise<{ employeeId: string }>;
export default async function crewMember(props: { params: Promise<Params> }) {
  return (
    <Bases>
      <Contents>
        <EmployeeInfo employeeId={(await props.params).employeeId} />
        <Holds className="mt-5">
          <EmployeeTimeSheets employeeId={(await props.params).employeeId} />
        </Holds>
      </Contents>
    </Bases>
  );
}
