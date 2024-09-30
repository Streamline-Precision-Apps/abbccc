"use server";

import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import Content from "@/app/(routes)/dashboard/forms/content";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Forms() {
    const session = await auth();
    if (!session) {
        redirect('/signin');
    }
    
    return (
    <Bases>
    <Contents height="page">
        <Holds size={"full"} background={"white"}>
            <TitleBoxes
            title="Forms"
            titleImg="/form.svg"
            titleImgAlt="Forms"
            variant="default"
            size="default"
            />
        </Holds>
        <Content />
    </Contents>
    </Bases>
);
}