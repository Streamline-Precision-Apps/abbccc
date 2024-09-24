"use client";
import React, {useState} from 'react';
import { useTranslations} from 'next-intl';
import LocaleToggleSwitch from '@/components/(inputs)/toggleSwitch';
import { Titles } from '@/components/(reusable)/titles';
import '@/app/globals.css';
import Link from 'next/link';
import { Bases } from '@/components/(reusable)/bases';
import { TitleBoxes } from '@/components/(reusable)/titleBoxes';
import { Holds } from '@/components/(reusable)/holds';
import { Modals } from '@/components/(reusable)/modals';
import { Texts } from '@/components/(reusable)/texts';
import { Buttons } from '@/components/(reusable)/buttons';


export default function Index() {
    const [isOpen, setIsOpen] = useState(false);
    const t = useTranslations('Hamburger');
return (
        <Bases>
            <Holds size={"titleBox"}>
                <TitleBoxes title="Change Password" titleImg="/settings.svg" titleImgAlt="Change Password Icon"/>
            </Holds>
            <Holds size={"dynamic"}>
                <Texts>{t('NewPassword')}</Texts>
            </Holds>
            <Holds size={"dynamic"}>
                <Texts>{t('ConfirmPassword')}</Texts>
            </Holds>
            <Buttons variant={"orange"}>{t('ChangePassword')}</Buttons>
        </Bases>
);
};