import ClockProcess from "@/components/(clock)/clockProcess";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

type Props = {
    type: string;
}
export default async function Clock({type}: Props) {
    const user = cookies().get("user");
    const userstring = user?.value || null;
    const userId = userstring;
    // add these here to enable proper code selection in the form
    const jobCodes = await prisma.jobsite.findMany();
    const CostCodes = await prisma.costCode.findMany();
    const equipment = await prisma.equipment.findMany();

    if (type === "equipment") {
        return (
            <div>
            <ClockProcess type={type} id={userId} scannerType="EQ" jobCodes={jobCodes} CostCodes={CostCodes} equipment={equipment} />
        </div>
        );
    }
    
        return (
            <div>
            <ClockProcess type={type} id={userId} scannerType="Job" jobCodes={jobCodes} CostCodes={CostCodes} equipment={equipment} />
        </div>
    );
}