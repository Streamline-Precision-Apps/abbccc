"use client";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import Capitalize from "@/utils/captitalize";
import { useTranslations } from "next-intl";
type props = {
    firstName: string;
    lastName: string;
}

export default function NameContainer({firstName, lastName}: props) {
    const t = useTranslations("Home");
return (
<Holds className="p-5">
    <Texts variant={"name"} size={"p0"}>
        {t("Name", {
            firstName: Capitalize(firstName),
            lastName: Capitalize(lastName),
        })}
    </Texts>
</Holds>
);
}   