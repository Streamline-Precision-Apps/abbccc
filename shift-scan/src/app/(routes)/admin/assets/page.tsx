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
const costCodes = await prisma.costCode.findMany();


    return (
    <Content equipment={equipment} jobsites={jobsites} costCodes={costCodes} />
    )
}