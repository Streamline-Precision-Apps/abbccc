"use server";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import EmployeeInfo from "./employee-info";
import { EmployeeTimeSheets } from "../[id]/employee-timesheet";
import prisma from "@/lib/prisma";
import { Bases } from "@/components/(reusable)/bases";


export default async function crewMember({ params }: { params: Params }) {
    const jobsiteData = await prisma.jobsite.findMany({});
    const costcodeData = await prisma.costCode.findMany({});
    const equipmentData = await prisma.employeeEquipmentLog.findMany({
        include: {
            Equipment: true
        }
    });

    return (
        <Bases>
            <EmployeeInfo params={params} />
            <EmployeeTimeSheets employeeId={params.id} jobsiteData={jobsiteData} costcodeData={costcodeData} equipmentData={equipmentData} />
        </Bases>
    );
}