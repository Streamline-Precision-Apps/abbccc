"use server";
import { auth } from "@/auth";
import ClockProcessor from "@/components/(clock)/clockProcess";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Sections } from "@/components/(reusable)/sections";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export default async function Clock() {
const session = await auth();
const userId = session?.user.id;

// Fetch all records
const jobCodes = await prisma.jobsites.findMany({
    select: {
    id: true,
    qrId: true,
    name: true,
    },
});

const costCodes = await prisma.costCodes.findMany({
    select: {
    id: true,
    name: true,
    description: true,
    },
});

const equipment = await prisma.equipment.findMany({
    select: {
    id: true,
    qrId: true,
    name: true,
    },
});

// Fetch recent records
const recentJobSites = await prisma.jobsites.findMany({
    select: {
    id: true,
    qrId: true,
    name: true,
    },
    orderBy: {
    createdAt: "desc",
    },
    take: 5,
});

const recentCostCodes = await prisma.costCodes.findMany({
    select: {
    id: true,
    name: true,
    description: true,
    },
    orderBy: {
    createdAt: "desc",
    },
    take: 5,
});

const recentEquipment = await prisma.equipment.findMany({
    select: {
    id: true,
    qrId: true,
    name: true,
    },
    orderBy: {
    createdAt: "desc",
    },
    take: 5,
});


const lang = cookies().get("locale");
const locale = lang ? lang.value : "en"; // Default to English

return (
<Bases>
<Contents size={"default"} variant={"default"}>
<Sections size={"default"}>
<ClockProcessor
        type={"jobsite"}
        scannerType={"jobsite"}
        locale={locale}
        returnpath="/"
        />
</Sections>
</Contents>
</Bases>
)
}
