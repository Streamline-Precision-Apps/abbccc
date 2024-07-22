import ClockProcess from "@/components/(clock)/clockProcess";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

type Props = {
    type: string;
    id : string;
}
export default async function Clock({type}: Props) {
    const user = cookies().get("user");
    const userstring = user?.value || null;
    const userId = userstring;
    // add these here to enable proper code selection in the form
    const jobCodes = await prisma.jobsite.findMany();
    const CostCodes = await prisma.costCode.findMany();
    const equipment = await prisma.equipment.findMany();
    const Vehicles = await prisma.equipment.findMany(
        {where: {is_vehicle: true}});
    const trailers = await prisma.equipment.findMany({
        where: {is_trailer: true}});
        
    
        return (
            <div>
            <ClockProcess type={type} id={userId} jobCodes={jobCodes} CostCodes={CostCodes} equipment={equipment} Vehicles={Vehicles} trailers={trailers} />
        </div>
    );
}