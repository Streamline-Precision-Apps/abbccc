"use client";
import React, {useState} from 'react';
import { useTranslations} from 'next-intl';
import LocaleToggleSwitch from '@/components/(inputs)/toggleSwitch';
import DynamicSection from '@/components/dynamicSection';
import BasicButton from '@/components/button';
import TitleBox from '@/components/titleBox';
import SwitchWithLabel from '@/components/(inputs)/switchWithLabel';
import BasicLabel from '@/components/(text)/label';
import LocaleCheckBox from '@/components/(inputs)/checkBox';
import TitleMedium from '@/components/(text)/title_h2';
import Modal from '@/components/modal';
import '@/app/globals.css';
import Link from 'next/link';
import EmptyBase from '@/components/emptyBase';


export default function Index() {
    const [isOpen, setIsOpen] = useState(false);
    const t = useTranslations('PortalLogin');
return (
    <div> 
        <EmptyBase>
            <TitleBox>Settings</TitleBox>
            <DynamicSection>
                <p></p>
            </DynamicSection>
            <DynamicSection>
            <button onClick={() => setIsOpen(true)}>
                Click to Open Modal
            </button>

            <Modal handleClose={() => setIsOpen(false)} isOpen={isOpen}>
            Are you sure you want to sign out of your account?
            </Modal>
            </DynamicSection>
            <BasicButton>Change Password</BasicButton>
        </EmptyBase>
    </div>
);
};