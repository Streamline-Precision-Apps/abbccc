"use client";
import "../../app/globals.css";
import { User } from "@/lib/types";
import { useTranslations } from "next-intl";
import { Buttons } from "@/components/(reusable)/buttons";
import { Texts } from "@/components/(reusable)/texts";
import { Images } from "@/components/(reusable)/images";
import { Contents } from "@/components/(reusable)/contents";

interface Props {
    user: User;
    locale: string;
    option?: string;
    manager?: boolean;
}

export default function ClockInWidget({ user, locale, option, manager}: Props) {
    const t = useTranslations("Home");
    if (manager) {
        return (
        <>
            <Buttons 
                variant={"green"} 
                size={"widgetMed"} 
                href="/clock"
            >
                <Contents variant={"widgetButtonRow"} size={"test"}>
                    <Texts size={"widgetMed"}>{t("Clock-btn")}</Texts>
                    <Images titleImg="/clockIn.svg" titleImgAlt="QR Code" variant={"icon"} size={"widgetMed"} />
                </Contents>
            </Buttons>
        </>
    );
}    else {
        return (
            <>
            <Buttons 
                variant={"green"} 
                size={"widgetLg"} 
                href="/clock"
            >
                <Contents variant={"widgetButtonRow"} size={"test"}>
                    <Texts size={"widgetMed"}>{t("Clock-btn")}</Texts>
                    <Images titleImg="/clockIn.svg" titleImgAlt="QR Code" variant={"icon"} size={"widgetMed"} />
                </Contents>
            </Buttons>
        </>
        )
}}