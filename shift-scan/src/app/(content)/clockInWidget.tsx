"use client";
import "../../app/globals.css";
import { User } from "@/lib/types";
import { useTranslations } from "next-intl";
import { Buttons } from "@/components/(reusable)/buttons";
import { Texts } from "@/components/(reusable)/texts";
import { Images } from "@/components/(reusable)/images";
import { Contents } from "@/components/(reusable)/contents";

type Props = {
    user: User;
    locale: string;
    option?: string;
    manager?: boolean;
}

export default function ClockInWidget({ user, locale, option, manager}: Props) {
    const t = useTranslations("Home");
        return (
        <>
            <Buttons 
                variant={"green"} 
                size={"fill"} // this eliminated the big if statement
                href="/clock"
            >
                <Contents variant={"widgetButtonRow"} size={"test"}>
                    <Texts size={"widgetMed"}>{t("Clock-btn")}</Texts>
                    <Images titleImg="/new/clock-in.svg" titleImgAlt="QR Code" variant={"icon"} size={"widgetMed"} />
                </Contents>
            </Buttons>
        </>
    );
}
