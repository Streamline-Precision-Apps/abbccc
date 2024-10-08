"use server";
import prisma from "@/lib/prisma";
import EquipmentLogContent from "@/app/(routes)/dashboard/equipment/content";
import { auth } from "@/auth";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { getTranslations } from "next-intl/server";

export default async function Current() {
    const session = await auth();
    const userId = session?.user?.id;
    const t = await getTranslations("EquipmentContent");
    
// use translate breaks here for what ever reason
return (
    <Bases>
    <Contents>
    <Holds size={"full"}>
        <TitleBoxes title={t("Title")} titleImg="/equipment.svg" titleImgAlt="Current" variant={"default"} size={"default"} />
    </Holds>
    <EquipmentLogContent userId={userId} />
    </Contents>
    </Bases>
    
);
}