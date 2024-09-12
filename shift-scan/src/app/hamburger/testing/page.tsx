'use client'
import '@/app/globals.css';
import { Bases } from "@/components/(reusable)/bases";
import { Sections } from "@/components/(reusable)/sections";
import { Contents } from '@/components/(reusable)/contents';
import React , { act, useState } from 'react';
import { Buttons } from '@/components/(reusable)/buttons';
import { Images } from '@/components/(reusable)/images';
import { Texts } from '@/components/(reusable)/texts';
import { Modals } from '@/components/(reusable)/modals';
import ClockProcessor from "@/components/(clock)/clockProcess";
import { useSession } from "next-auth/react";
import { CustomSession } from "@/lib/types";
import { EquipmentCode, Logs } from "@/lib/types";

interface UserProps {
    locale: string;
  }

export const Testing: React.FC<UserProps> = ({
    locale
  }) => {
    const { data: session } = useSession() as { data: CustomSession | null };
    const user = session?.user;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
    
        setIsModalOpen(true);
    
      };
    
      const handleCloseModal = () => {
        setIsModalOpen(false);
        window.location.reload();
      };
    return (
        <Bases>
            <Contents size={"default"}>
                <Sections size={"default"}>
                    <Buttons
                    variant={"orange"}
                    size={"widgetSm"}
                    onClick={handleOpenModal}
                    >
                        <Contents variant={"widgetButton"} size={"test"}>
                            <Images
                            titleImg="/jobsite.svg"
                            titleImgAlt="Jobsite Icon"
                            variant={"icon"}
                            size={"widgetSm"}
                            ></Images>
                            <Texts size={"widgetSm"}>SwitchJobs</Texts>
                        </Contents>
                    </Buttons>
                    <Modals
                    isOpen={isModalOpen}
                    handleClose={handleCloseModal}
                    variant={"gradient"}
                    size={"fullPage"}
                    type={"clock"}
                    >
                        <ClockProcessor
                        type={"switchJobs"}
                        id={user?.id}
                        scannerType={"jobsite"}
                        isModalOpen={isModalOpen}
                        locale={locale}
                        />
                    </Modals>
                </Sections>
            </Contents>
        </Bases>  
    )
}

export default Testing
