import ClockProcess from "@/components/(clock)/clockProcess";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

type Props = {
    type: string;
}
export default async function Clock({type}: Props) {
    const user = cookies().get("user");
    const userId = user?.value ;
    // add these here to enable proper code selection in the form
    const jobCodes = await prisma.jobsite.findMany(
        {
            select: {
                id: true,
                jobsite_id: true,
                jobsite_name: true
            }
        }
    );
    const CostCodes = await prisma.costCode.findMany(
        {
            select: {
                id: true,
                cost_code: true,
                cost_code_description: true
            }
        }
    );
    const equipment = await prisma.equipment.findMany(
        {
            select: {
                id: true,
                qr_id: true,
                name: true,
            }
        }
    );
    

    if (type === "equipment") {
        return (
            <div>
            <ClockProcess type={type} id={userId} scannerType="EQ" jobCodes={jobCodes} CostCodes={CostCodes} equipment={equipment} />
        </div>
        );
    }

    else if (type === "switchJobs"){
        return (
            <div>
            <ClockProcess type={type} id={userId} scannerType="Job" jobCodes={jobCodes} CostCodes={CostCodes} equipment={equipment} />
        </div>
        );
    }

    else {
        return (
            <div>
            <ClockProcess type={type} id={userId} scannerType="Job" jobCodes={jobCodes} CostCodes={CostCodes} equipment={equipment} />
        </div>
    );
}
}