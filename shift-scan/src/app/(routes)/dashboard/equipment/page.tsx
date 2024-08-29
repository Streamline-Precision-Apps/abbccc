"use server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import Content from "@/app/(routes)/dashboard/equipment/content";
import { auth } from "@/auth";

export default async function Current() {
    const session = await auth();
    const user_Id = session?.user.id;
    
    const currentDate = new Date();
    const past24Hours = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);

    const logs = await prisma.employeeEquipmentLog.findMany({
        where: {
            employee_id: user_Id,
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
        <Content total={total} completed={completed} green={green} user_Id={user_Id} logs={logs} />
    );
}