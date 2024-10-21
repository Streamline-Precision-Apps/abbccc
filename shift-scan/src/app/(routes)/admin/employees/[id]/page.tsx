"use server";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import EmployeeInfo from "./employee-info";
import { EmployeeTimeSheets } from "../[id]/employee-timesheet";
import prisma from "@/lib/prisma";
import { Bases } from "@/components/(reusable)/bases";
import { auth } from "@/auth";
import { Equipment, Jobsites } from "@/lib/types";

export default async function crewMember({ params }: { params: Params }) {
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
      <EmployeeInfo params={params} />
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
