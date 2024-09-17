"use server";

import Content from "@/app/(routes)/admin/assets/content";
import prisma from "@/lib/prisma";

export default async function Page() {

    const equipment = await prisma.equipment.findMany();
    const jobsites = await prisma.jobsites.findMany();
    const costCodes = await prisma.costCodes.findMany(
        {
            select: {
                id: true,
                name: true,
                description: true,
                type: true
            }
        }
    );


    return (
    <Content equipment={equipment} jobsites={jobsites} costCodes={costCodes} />
    )
}