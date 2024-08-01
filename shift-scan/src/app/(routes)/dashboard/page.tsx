import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import Content from "./content";

export default async function Dashboard() {
const user = cookies().get("user");
const userId = user?.value;

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
    createdAt: 'desc',
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
    createdAt: 'desc',
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
    createdAt: 'desc',
    },
    take: 5,
});

return (
    <Content
    jobCodes={jobCodes}
    CostCodes={costCodes}
    equipment={equipment}
    recentJobSites={recentJobSites}
    recentCostCodes={recentCostCodes}
    recentEquipment={recentEquipment}
    />
);
}