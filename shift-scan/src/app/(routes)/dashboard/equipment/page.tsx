
import { Bases } from "@/components/(reusable)/bases";
import { Buttons } from "@/components/(reusable)/buttons";
import { Sections } from "@/components/(reusable)/sections";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Titles } from "@/components/(reusable)/titles";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export default async function Equipment() {
    const userCookie = cookies().get("user");
    const userid = userCookie ? userCookie.value : undefined;
    const User = await prisma.user.findUnique({
        where: {
            id: userid,
        },
    });
    const name = User ? `${User.firstName} ${User.lastName}` : "";

    

    return (
        <Bases>
            <Sections size={"default"}>
                <Titles>{name}</Titles>
                <Buttons variant={"default"} size={"widgetLg"} href="/dashboard">Go Home</Buttons>
                <Buttons variant={"green"} size={"widgetLg"}href="/dashboard/equipment/scan">log New</Buttons>
                <Buttons variant={"orange"} size={"widgetLg"}href="/dashboard/equipment/current">current equipment</Buttons>
            </Sections>
        </Bases>  
    )
}
