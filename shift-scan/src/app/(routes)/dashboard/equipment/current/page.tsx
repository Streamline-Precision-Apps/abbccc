import { Bases } from "@/components/(reusable)/bases";
import { Sections } from "@/components/(reusable)/sections";
import { Titles } from "@/components/(reusable)/titles";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { Buttons } from "@/components/(reusable)/buttons";

export default async function Current() {
    const userCookie = cookies().get("user");
    const userid = userCookie ? userCookie.value : undefined;

    const currentDate = new Date();
    const past24Hours = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
    const completed = false

    const logs = await prisma.employeeEquipmentLog.findMany({
        where: {
            employee_id: userid,
            createdAt: { lte: currentDate, gte: past24Hours, },
            // completed: false,
            // submitted : false,
        },
        include: {
            Equipment: true
        }
    });
    return (
        <Bases>
            <Sections size={"titleBox"}>
                <TitleBoxes title="Current Equipment" titleImg="/current.svg" titleImgAlt="Current" variant={"default"} size={"default"} />
            </Sections>
            <Sections size={"default"}>
            {logs.map((log) => (
                <Buttons variant={(completed) ? "green" : "orange"} size={"default"} href={(`/dashboard/equipment/current/${log.id}`)}  key={log.id}>{log.Equipment?.name}</Buttons>
            ))}
            </Sections>
        </Bases>
    )
}