"use server";
import { auth } from "@/auth";
import ClockProcessor from "@/components/(clock)/clockProcess";
import { Bases } from "@/components/(reusable)/bases";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Images } from "@/components/(reusable)/images";
import { Sections } from "@/components/(reusable)/sections";
import { Texts } from "@/components/(reusable)/texts";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export default async function Clock() {
const session = await auth();
const user_Id = session?.user.id;

// Fetch all records
const jobCodes = await prisma.jobsite.findMany({
    select: {
    id: true,
    jobsite_id: true,
    jobsite_name: true,
    },
});

const costCodes = await prisma.costCode.findMany({
    select: {
    id: true,
    cost_code: true,
    cost_code_description: true,
    },
});

const equipment = await prisma.equipment.findMany({
    select: {
    id: true,
    qr_id: true,
    name: true,
    },
});

// Fetch recent records
const recentJobSites = await prisma.jobsite.findMany({
    select: {
    id: true,
    jobsite_id: true,
    jobsite_name: true,
    },
    orderBy: {
    createdAt: "desc",
    },
    take: 5,
});

const recentCostCodes = await prisma.costCode.findMany({
    select: {
    id: true,
    cost_code: true,
    cost_code_description: true,
    },
    orderBy: {
    createdAt: "desc",
    },
    take: 5,
});

const recentEquipment = await prisma.equipment.findMany({
    select: {
    id: true,
    qr_id: true,
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
        id={user_Id}
        scannerType={"jobsite"}
        locale={locale}
        returnpath="/"
        />
</Sections>
</Contents>
</Bases>
)
}
