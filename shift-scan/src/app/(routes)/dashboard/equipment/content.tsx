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
import { Contents } from "@/components/(reusable)/contents";

type EquipmentLogs = {
    total: number;
    completed: number;
    green: number;
    user_Id: string | undefined;
    logs: any[];
}

export default function EquipmentLogContent({ user_Id, logs, total, green }: EquipmentLogs) {
    const t = useTranslations("EquipmentContent");
    return (
    <Bases>
    <Contents>
    <Sections size={"titleBox"}>
        <TitleBoxes title={t("Title")} titleImg="/equipment.svg" titleImgAlt="Current" variant={"default"} size={"default"} />
    </Sections>
    <Sections size={"default"}>
        {green === 0 && total !== 0 ? 
        (< Forms action={Submit}>
            <Buttons type="submit" variant={"lightBlue"} size={null}>{t("SubmitAll")}</Buttons>
            <Inputs type="hidden" name="id" value={user_Id} />
            <Inputs type="hidden" name="submitted" value={"true"} />
        </Forms>)
        : <></>}
        {total === 0 ? <Texts>{t("NoCurrent")}</Texts> : <></>}
        {logs.map((log) => (
            <Buttons variant={(log.completed) ? "green" : "orange"} size={null} href={`/dashboard/equipment/${log.id}`} key={log.id}>
                {log.Equipment?.name}
            </Buttons>
        ))}
    </Sections>
    </Contents>
    </Bases>
    );
}