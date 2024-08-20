"use server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import Content from "@/app/(routes)/dashboard/equipment/content";

export default async function Current() {
    const userCookie = cookies().get("user");
    const userid = userCookie ? userCookie.value : undefined;
    
    const currentDate = new Date();
    const past24Hours = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);

    const logs = await prisma.employeeEquipmentLog.findMany({
        where: {
            employee_id: userid,
            createdAt: { lte: currentDate, gte: past24Hours },
            submitted: false
        },
        include: {
            Equipment: true,
        }
    });

    const total = logs.length;
    const completed = logs.filter((log) => log.completed).length;
    const green = total - completed;
// usetranslate breaks here for what ever reason
    return (
        <Content total={total} completed={completed} green={green} userid={userid} logs={logs} />
    );
}