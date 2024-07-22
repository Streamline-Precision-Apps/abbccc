"use client";
import React, {useState} from 'react';
import { useTranslations} from 'next-intl';
import LocaleToggleSwitch from '@/components/(inputs)/toggleSwitch';
import SwitchWithLabel from '@/components/(inputs)/switchWithLabel';
import BasicLabel from '@/components/(text)/label';
import { Titles } from '@/components/(reusable)/titles';
import '@/app/globals.css';
import Link from 'next/link';
import { Bases } from '@/components/(reusable)/bases';
import { TitleBoxes } from '@/components/(reusable)/titleBoxes';
import { Sections } from '@/components/(reusable)/sections';
import { Modals } from '@/components/(reusable)/modals';


export default function Index() {
    const [isOpen, setIsOpen] = useState(false);
    const t = useTranslations('PortalLogin');
return (
    <div> 
        <Bases>
            <TitleBoxes title="Change Password" titleImg="/changePassword.png" titleImgAlt="Change Password Icon"/>
            <Sections>
                <p></p>
            </Sections>
            <Sections>
            <button onClick={() => setIsOpen(true)}>
                Click to Open Modal
            </button>

            <Modals handleClose={() => setIsOpen(false)} isOpen={isOpen}>
            Are you sure you want to sign out of your account?
            </Modals>
            </Sections>
            {/* <BasicButton>Change Password</BasicButton> */}
        </Bases>
    </div>
);
};