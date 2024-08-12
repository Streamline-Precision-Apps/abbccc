"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Submit } from "@/actions/equipmentActions";
import { useTranslations } from "next-intl";

export default function SubmitAll({ userid }: { userid: string | undefined }) {
    const t = useTranslations("EquipmentContent");
    return (
        <form action={Submit}>
            <Buttons type="submit" variant={"default"} size={"default"}>{t("SubmitAll")}</Buttons>
            <input type="hidden" name="id" value={userid} />
            <input type="hidden" name="submitted" value={"true"} />
        </form>
    );
}