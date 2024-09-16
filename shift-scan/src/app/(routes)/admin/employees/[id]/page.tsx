"use server";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import EmployeeInfo from "./employee-info";
import { EmployeeTimeSheets } from "../[id]/employee-timesheet";
import prisma from "@/lib/prisma";
import { Bases } from "@/components/(reusable)/bases";
import { auth } from "@/auth";


export default async function crewMember({ params }: { params: Params }) {   
    const session = await auth().catch((err) => {
        console.error("Error in authentication:", err);
        return null;
        });
    const jobsiteData = await prisma.jobsite.findMany({
        where: {
            jobsite_active: true,
            },
    });
    const costcodeData = await prisma.costCode.findMany({});
    const equipmentData = await prisma.employeeEquipmentLog.findMany({
        include: {
            Equipment: true
        }
    });
    const equipment = await prisma.equipment.findMany({});

    return (
        <Bases variant={"default"}>
            <EmployeeInfo params={params} />
            <EmployeeTimeSheets employeeId={params.id} jobsiteData={jobsiteData} costcodeData={costcodeData} equipmentData={equipmentData} equipment={equipment} permission={session?.user.permission}/>
        </Bases>
    );
}