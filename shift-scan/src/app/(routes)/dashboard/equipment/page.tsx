
import { Bases } from "@/components/(reusable)/bases";
import { Buttons } from "@/components/(reusable)/buttons";
import { Images } from "@/components/(reusable)/images";
import { Sections } from "@/components/(reusable)/sections";
import { Texts } from "@/components/(reusable)/texts";
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
                <Buttons variant={"default"} size={"default"} href="/dashboard">
                <Images titleImg="/home.svg" titleImgAlt="Home Icon" variant={"icon"} size={"default"}/>
                <Texts>Go Home</Texts>
                </Buttons>
                <Buttons variant={"green"} size={"default"}href="/dashboard/equipment/scan">
                <Images titleImg="/equipment.svg" titleImgAlt="Equipment Icon" variant={"icon"} size={"default"}/>
                <Texts>Log New</Texts>
                </Buttons>
                <Buttons variant={"orange"} size={"default"}href="/dashboard/equipment/current">
                <Images titleImg="/forms.svg" titleImgAlt="Current Equipment Icon" variant={"icon"} size={"default"}/>
                <Texts>Current Equipment</Texts>
                </Buttons>
            </Sections>
        </Bases>  
    )
}
