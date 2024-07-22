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



export default function Index() {
    const t = useTranslations('PortalLogin');
return (
    <div> 
        <Bases>
            <Sections size={"titleBox"}>
                <TitleBoxes 
                title="Settings" 
                titleImg="/Settings.svg" 
                titleImgAlt="Settings"  
                variant={"default"} size={"default"}/>
            </Sections>
            <Sections size={"dynamic"}>
            <Titles>Notifications</Titles>
                <SwitchWithLabel>
                    <Texts size={"left"}>Approved Requests</Texts>
                    <LocaleToggleSwitch></LocaleToggleSwitch>
                </SwitchWithLabel>
                <SwitchWithLabel>
                    <Texts>Time Off Requests</Texts>
                    <LocaleToggleSwitch></LocaleToggleSwitch>
                </SwitchWithLabel>
                <SwitchWithLabel>
                    <Texts>General Reminders</Texts>
                    <LocaleToggleSwitch></LocaleToggleSwitch>
                </SwitchWithLabel>
            </Sections>
            <Sections size={"dynamic"}>
            <Titles>Security</Titles>
                <SwitchWithLabel>
                    <Texts>Biometrics</Texts>
                    <LocaleToggleSwitch></LocaleToggleSwitch>
                </SwitchWithLabel>
                <SwitchWithLabel>
                    <Texts>Camera Access</Texts>
                    <LocaleToggleSwitch></LocaleToggleSwitch>
                </SwitchWithLabel>
                <SwitchWithLabel>
                    <Texts>Location Access</Texts>
                    <LocaleToggleSwitch></LocaleToggleSwitch>
                </SwitchWithLabel>
            </Sections>
            <Buttons href="/hamburger/changePassword" variant={'orange'} size={'default'}>
            <Titles>Change Password</Titles>
            </Buttons>
        </Bases>
    </div>
);
};