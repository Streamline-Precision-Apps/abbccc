"use server";
import prisma from "@/lib/prisma";
import EquipmentLogContent from "@/app/(routes)/dashboard/equipment/content";
import { auth } from "@/auth";

export default async function Current() {
    const session = await auth();
    const user_Id = session?.user.id;
    
    const currentDate = new Date();
    const past24Hours = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);

    const logs = await prisma.employeeEquipmentLogs.findMany({
        where: {
            employeeId: user_Id,
            createdAt: { lte: currentDate, gte: past24Hours },
            isSubmitted: false
        },
        include: {
            Equipment: true,
        }
    });
    
    const total = logs.length;
    const completed = logs.filter((log) => log.isCompleted).length;
    const green = total - completed;
// use translate breaks here for what ever reason
    return (
        <EquipmentLogContent total={total} completed={completed} green={green} user_Id={user_Id} logs={logs} />
    );
}