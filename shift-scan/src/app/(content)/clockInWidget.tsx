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

interface Props {
    user: User;
}

export default function ClockInWidget({ user }: Props) {
    const t = useTranslations("Home");

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Buttons variant={"green"} size={"default"} onClick={handleOpenModal}>
                <Images titleImg="/clockIn.svg" titleImgAlt="QR Code" variant={"icon"} size={"widgetSm"} />
                <Texts>{t("Clock-btn")}</Texts>
            </Buttons>
            <Modals isOpen={isModalOpen} handleClose={handleCloseModal} variant={"default"} size={"clock"} type={"clock"}> 
                <ClockProcessor
                    type={"jobsite"}
                    id={user.id}
                    scannerType={"jobsite"}
                    isModalOpen={isModalOpen}
                    />
            </Modals>
        </>
    );
}