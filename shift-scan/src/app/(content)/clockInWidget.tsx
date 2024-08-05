import { useState } from "react";
import { User } from "@/lib/types";
import { useTranslations } from "next-intl";
import "../../app/globals.css";
import { useRouter } from "next/navigation";
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
    const router = useRouter();
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
                <div className="flex flex-col bg-white px-2 ">
                <ClockProcessor
                    type={"jobsite"}
                    id={user.id}
                    scannerType={"jobsite"}
                    isModalOpen={isModalOpen}
                    />
                </div>
            </Modals>
        </>
    );
}