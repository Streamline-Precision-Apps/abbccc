"use client";

import { Contents } from "@/components/(reusable)/contents";
import { Forms } from "@/components/(reusable)/forms";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Options } from "@/components/(reusable)/options";
import { Holds } from "@/components/(reusable)/holds";
import { Selects } from "@/components/(reusable)/selects";
import { Texts } from "@/components/(reusable)/texts";
import { useTranslations } from "next-intl";

export default function Content() {
    const t = useTranslations("dashboard");
    return (
        <Holds size={"default"}>
            <Contents >
                <Texts>{t("Forms")}</Texts>
                <Forms>
                    <Selects
                    defaultValue={t("FormDefault")} 
                    // onChange={(e) => handleFormSelect(e.target.value)}
                    >
                        <Options value="">{t("FormDefault")}</Options>
                        <Options value="1" >{t("Form1")}</Options>
                        <Options value="2">{t("Form2")}</Options>
                        <Options value ="3">{t("Form3")}</Options>
                    </Selects>
                    
                </Forms>
            </Contents>
        </Holds>
    );
}