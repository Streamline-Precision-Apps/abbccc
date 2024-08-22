"use server";

import Content from "@/app/(routes)/admin/assets/content";
import prisma from "@/lib/prisma";

export default async function Page() {



    const equipment = await prisma.equipment.findMany({
        select: {
        id: true,
        qr_id: true,
        name: true,
        equipment_tag: true,
        },
    });
const jobsites = await prisma.jobsite.findMany();

    const costCodes = await prisma.costCode.findMany({
    select: {
        id: true,
        cost_code: true,
        cost_code_description: true,
        cost_code_type: true,
    },
    });


    return (
    <Content equipment={equipment} jobsites={jobsites} costCodes={costCodes} />
    )
}