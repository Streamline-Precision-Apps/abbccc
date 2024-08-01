"use server";
import Content from "@/app/(content)/content"
import "@/app/globals.css"
import prisma from "@/lib/prisma"
import { cookies } from "next/headers"

export default async function Home() {
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
    
    return (   
            <Content jobCodes={jobCodes} CostCodes={CostCodes} equipment={equipment} />
    )   
}