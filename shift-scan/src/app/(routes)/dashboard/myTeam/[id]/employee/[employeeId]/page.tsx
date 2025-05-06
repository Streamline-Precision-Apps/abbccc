"use server";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import EmployeeTabs from "./employee-tabs";
export default async function crewMember() {
  return (
    <Bases>
      <Contents>
        <EmployeeTabs />
      </Contents>
    </Bases>
  );
}
