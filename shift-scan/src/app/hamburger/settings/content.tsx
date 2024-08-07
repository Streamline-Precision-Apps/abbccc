"use client";
import React, {useState} from 'react';
import { useTranslations} from 'next-intl';
import LocaleToggleSwitch from '@/components/(inputs)/toggleSwitch';
import { Sections } from '@/components/(reusable)/sections';
import { Buttons } from '@/components/(reusable)/buttons';
import SwitchWithLabel from '@/components/(inputs)/switchWithLabel';
import { Titles } from '@/components/(reusable)/titles';
import { TitleBoxes } from '@/components/(reusable)/titleBoxes';
import { Bases } from '@/components/(reusable)/bases';
import '@/app/globals.css';
import { Images } from '@/components/(reusable)/images';
import { Texts } from '@/components/(reusable)/texts';

type data = {
language : string
approvedRequests: Boolean
timeoffRequests:  Boolean
GeneralReminders: Boolean 
Biometric:        Boolean 
cameraAccess:     Boolean 
LocationAccess:   Boolean 
}

export default function Index( data : any ) {
    const t = useTranslations('Hamburger');
return (
    <div> 
        <Bases>
            <Sections size={"titleBox"}>
                <TitleBoxes 
                title={t("Title")} 
                titleImg="/Settings.svg" 
                titleImgAlt="Settings"  
                variant={"default"} size={"default"}/>
            </Sections>
            
            <Sections size={"dynamic"}>
            <Titles>{t("Notifications")} </Titles>
                <SwitchWithLabel>
                    <Texts size={"left"}>{t("ApprovedRequests")} </Texts>
                    <LocaleToggleSwitch></LocaleToggleSwitch>
                </SwitchWithLabel>
                <SwitchWithLabel>
                    <Texts>{t("TimeOffRequests")} </Texts>
                    <LocaleToggleSwitch></LocaleToggleSwitch>
                </SwitchWithLabel>
                <SwitchWithLabel>
                    <Texts>{t("GeneralReminders")} </Texts>
                    <LocaleToggleSwitch></LocaleToggleSwitch>
                </SwitchWithLabel>
            </Sections>
            <Sections size={"dynamic"}>
            <Titles>{t("Security")} </Titles>
                <SwitchWithLabel>
                    <Texts>{t("Biometrics")} </Texts>
                    <LocaleToggleSwitch></LocaleToggleSwitch>
                </SwitchWithLabel>
                <SwitchWithLabel>
                    <Texts>{t("CameraAccess")} </Texts>
                    <LocaleToggleSwitch></LocaleToggleSwitch>
                </SwitchWithLabel>
                <SwitchWithLabel>
                    <Texts>{t("LocationAccess")} </Texts>
                    <LocaleToggleSwitch></LocaleToggleSwitch>
                </SwitchWithLabel>
            </Sections>
            <Buttons href="/hamburger/changePassword" variant={'orange'} size={'default'}>
            <Titles>{t("ChangePassword")} </Titles>
            </Buttons>
        </Bases>
    </div>
);
};