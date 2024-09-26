"use server";

import EmployeeInfo from "./employee-info";
import { EmployeeTimeSheets } from "./employee-timesheet";
import prisma from "@/lib/prisma";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Sections } from "@/components/(reusable)/sections";


export default async function crewMember({ params }: { params: { employeeId: string } }) {

    return (
        <Bases>
        <Contents>
            <EmployeeInfo params={params} />
            <Sections size={"dynamic"} variant={"default"}>
            <EmployeeTimeSheets employeeId={params.employeeId}/>
            </Sections>
        </Contents>
        </Bases>
    );
}