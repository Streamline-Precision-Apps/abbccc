"use server";
import EmployeeInfo from "./employee-info";
import { EmployeeTimeSheets } from "../[id]/employee-timesheet";
import prisma from "@/lib/prisma";
import { Bases } from "@/components/(reusable)/bases";
import { auth } from "@/auth";
import { Equipment, Jobsites } from "@/lib/types";
type Params = Promise<{ id: string }>;
export default async function crewMember(props: { params: Promise<Params> }) {
  const params = await props.params;
  const session = await auth().catch((err) => {
    console.error("Error in authentication:", err);
    return null;
  });
  const jobsiteData = await prisma.jobsites.findMany({
    include: {
      costCode: true, // This will return an array of cost codes
    },
  });
  const costcodeData = await prisma.costCodes.findMany();
  const equipmentData = await prisma.employeeEquipmentLogs.findMany({
    include: {
      Equipment: true,
    },
  });
  const equipment = await prisma.equipment.findMany({});

  return (
    <Bases>
      <EmployeeInfo params={props.params} />
      <EmployeeTimeSheets
        employeeId={params.id}
        jobsiteData={jobsiteData as unknown as Jobsites[]}
        costcodeData={costcodeData}
        equipmentData={
          equipmentData.map((data) => data.Equipment) as Equipment[]
        }
        equipment={equipment}
        permission={session?.user.permission}
      />
    </Bases>
  );
}
