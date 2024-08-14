"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Submit } from "@/actions/equipmentActions";
import { useTranslations } from "next-intl";
import { Bases } from "@/components/(reusable)/bases";
import { Sections } from "@/components/(reusable)/sections";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Texts } from "@/components/(reusable)/texts";
import { Inputs } from "@/components/(reusable)/inputs";
import { Forms } from "@/components/(reusable)/forms";

interface ContentProps {
    total: number;
    completed: number;
    green: number;
    userid: string | undefined;
    logs: any[];
}

export default function Content({ userid, logs, total, green }: ContentProps) {
    const t = useTranslations("EquipmentContent");
    return (
    <Bases>
    <Sections size={"titleBox"}>
        <TitleBoxes title={t("Title")} titleImg="/equipment.svg" titleImgAlt="Current" variant={"default"} size={"default"} />
    </Sections>
    <Sections size={"default"}>
        {green === 0 && total !== 0 ? 
        (< Forms action={Submit}>
            <Buttons type="submit" variant={"default"} size={"default"}>{t("SubmitAll")}</Buttons>
            <Inputs type="hidden" name="id" value={userid} />
            <Inputs type="hidden" name="submitted" value={"true"} />
        </Forms>)
        : <></>}
        {total === 0 ? <Texts>{t("NoCurrent")}</Texts> : <></>}
        {logs.map((log) => (
            <Buttons variant={(log.completed) ? "green" : "orange"} size={"default"} href={`/dashboard/equipment/${log.id}`} key={log.id}>
                {log.Equipment?.name}
            </Buttons>
        ))}
    </Sections>
    </Bases>
    );
}