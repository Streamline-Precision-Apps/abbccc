"use client";
import "../../app/globals.css";
import { User } from "@/lib/types";
import { useTranslations } from "next-intl";
import { Buttons } from "@/components/(reusable)/buttons";
import { Texts } from "@/components/(reusable)/texts";
import { Images } from "@/components/(reusable)/images";
import { Holds } from "@/components/(reusable)/holds";

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
                background={"green"} 
                href="/clock"
                className="col-span-2"
            >
                <Holds position={"row"}>
                    <Holds>
                        <Texts size={"p1"}>{t("Clock-btn")}</Texts>
                    </Holds>
                    <Holds>
                        <Images titleImg="/clock-in.svg" titleImgAlt="QR Code" size={"30"} />
                    </Holds>
                </Holds>
            </Buttons>
        </>
    );
}
