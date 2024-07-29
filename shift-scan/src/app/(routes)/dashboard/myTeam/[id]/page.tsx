"use server";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import EmployeeInfo from "./employee-info";
import {EmployeeTimeSheets} from "../[id]/employee-timesheet";
import prisma from "@/lib/prisma";

export default async function crewMember({ params }: { params: Params }) {

    const jobsiteData = await prisma.jobsite.findMany({});
    const costcodeData = await prisma.costCode.findMany({});

    return (
        <>
        <EmployeeInfo params={params} />
        <EmployeeTimeSheets employeeId={params.id} jobsiteData={jobsiteData} costcodeData={costcodeData}/>
        </> 
    );
}