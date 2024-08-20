"use client";
import "../../app/globals.css";
import { useState } from "react";
import { User } from "@/lib/types";
import { useTranslations } from "next-intl";
import { Buttons } from "@/components/(reusable)/buttons";
import { Texts } from "@/components/(reusable)/texts";
import { Images } from "@/components/(reusable)/images";
import { Modals } from "@/components/(reusable)/modals";
import ClockProcessor from "@/components/(clock)/clockProcess";
import { Contents } from "@/components/(reusable)/contents";

interface Props {
    user: User;
    locale: string;
    option?: string;
    manager?: boolean;
}

export default function ClockInWidget({ user, locale, option, manager}: Props) {
    const t = useTranslations("Home");

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        location.reload(); // only current method to reload the page
    };

    if (manager) {
        return (
        <>
            <Buttons 
                variant={"green"} 
                size={"widgetMed"} 
                onClick={handleOpenModal}
            >
                <Contents variant={"widgetButtonRow"} size={"test"}>
                    <Texts size={"widgetMed"}>{t("Clock-btn")}</Texts>
                    <Images titleImg="/clockIn.svg" titleImgAlt="QR Code" variant={"icon"} size={"widgetMed"} />
                </Contents>
            </Buttons>
            <Modals isOpen={isModalOpen} handleClose={handleCloseModal} variant={"default"} size={"clock"} type={"clock"}> 
            <ClockProcessor
                type={"jobsite"}
                id={user.id}
                scannerType={"jobsite"}
                isModalOpen={isModalOpen}
                locale={locale}
                option={option}
            />
            </Modals>
        </>
    );
}    else {
        return (
            <>
            <Buttons 
                variant={"green"} 
                size={"widgetLg"} 
                onClick={handleOpenModal}
            >
                <Contents variant={"widgetButtonRow"} size={"test"}>
                    <Texts size={"widgetMed"}>{t("Clock-btn")}</Texts>
                    <Images titleImg="/clockIn.svg" titleImgAlt="QR Code" variant={"icon"} size={"widgetMed"} />
                </Contents>
            </Buttons>
            <Modals isOpen={isModalOpen} handleClose={handleCloseModal} variant={"default"} size={"clock"} type={"clock"}> 
            <ClockProcessor
                type={"jobsite"}
                id={user.id}
                scannerType={"jobsite"}
                isModalOpen={isModalOpen}
                locale={locale}
                option={option}
            />
            </Modals>
        </>
        )
}}