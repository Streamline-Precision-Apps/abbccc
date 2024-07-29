"use client";
import React, {useState} from 'react';
import { useTranslations} from 'next-intl';
import LocaleToggleSwitch from '@/components/(inputs)/toggleSwitch';
import SwitchWithLabel from '@/components/(inputs)/switchWithLabel';
import { Titles } from '@/components/(reusable)/titles';
import '@/app/globals.css';
import Link from 'next/link';
import { Bases } from '@/components/(reusable)/bases';
import { TitleBoxes } from '@/components/(reusable)/titleBoxes';
import { Sections } from '@/components/(reusable)/sections';
import { Modals } from '@/components/(reusable)/modals';
import { Texts } from '@/components/(reusable)/texts';
import { Buttons } from '@/components/(reusable)/buttons';


export default function Index() {
    const [isOpen, setIsOpen] = useState(false);
    const t = useTranslations('PortalLogin');
return (
    <div> 
        <Bases>
            <Sections size={"titleBox"}>
                <TitleBoxes title="Change Password" titleImg="/settings.svg" titleImgAlt="Change Password Icon"/>
            </Sections>
            <Sections size={"dynamic"}>
                <Texts>New Password</Texts>
            </Sections>
            <Sections size={"dynamic"}>
                <Texts>Confirm New Password</Texts>
            </Sections>
            <Buttons variant={"orange"}>Change Password</Buttons>
        </Bases>
    </div>
);
};