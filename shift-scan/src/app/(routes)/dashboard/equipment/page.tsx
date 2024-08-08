import { Bases } from "@/components/(reusable)/bases";
import { Sections } from "@/components/(reusable)/sections";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { Buttons } from "@/components/(reusable)/buttons";
import SubmitAll from "./submitAll";

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

    return (
        <Bases>
            <Sections size={"titleBox"}>
                <TitleBoxes title="Current Equipment" titleImg="/equipment.svg" titleImgAlt="Current" variant={"default"} size={"default"} />
            </Sections>
            <Sections size={"default"}>
                {green === 0 && total !== 0 ? <SubmitAll userid={userid} /> : <></>}
                {total === 0 ? <h2>No Current Equipment</h2> : <></>}
                {logs.map((log) => (
                    <Buttons variant={(log.completed) ? "green" : "orange"} size={"default"} href={`/dashboard/equipment/${log.id}`} key={log.id}>
                        {log.Equipment?.name}
                    </Buttons>
                ))}
            </Sections>
        </Bases>
    );
}