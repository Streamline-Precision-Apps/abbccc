"use server";
import { auth } from "@/auth";
import ClockProcessor from "@/components/(clock)/clockProcess";
import { Bases } from "@/components/(reusable)/bases";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Images } from "@/components/(reusable)/images";
import { Holds } from "@/components/(reusable)/Holds";
import { Texts } from "@/components/(reusable)/texts";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export default async function SwitchJobs() {
const session = await auth();
const user_Id = session?.user.id;

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
        <Bases variant={"default"} size={"scroll"} >
        <Contents size={"default"} variant={"default"}>
        <Holds size={"default"}>
        <ClockProcessor
            type={"switchJobs"}
            id={user_Id}
            scannerType={"jobsite"}
            locale={locale}
            returnpath="/dashboard"
        />
        </Holds>
        </Contents>
        </Bases>
    )
}
