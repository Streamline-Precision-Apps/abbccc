"use server";
import { auth } from "@/auth";
import ViewTimeSheets from "@/app/(routes)/timesheets/view-timesheets";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

export default async function Timesheets() {
    const session = await auth();
    if (!session) {
        redirect('/signin');
    }
    const id = session?.user.id;
    const t = await getTranslations("TimesheetsContent");
    return (
        <Bases>
        <Contents height={"page"}>
            <Holds background={"white"} size={"full"} className="mb-10">
                <TitleBoxes title={`${t("Title")}`} titleImg={"/form.svg"} titleImgAlt={`${t("Title")}`} size={"default"} />
            </Holds>
        <ViewTimeSheets user={id} />
        </Contents>
        </Bases>
    )
}