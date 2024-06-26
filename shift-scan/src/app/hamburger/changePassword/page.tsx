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

import '@/app/globals.css';
import Link from 'next/link';
import EmptyBase from '@/components/emptyBase';


export default function Index() {
    const t = useTranslations('PortalLogin');
return (
    <div> 
        <EmptyBase>
            <TitleBox>Settings</TitleBox>
            <DynamicSection>
                <p></p>
            </DynamicSection>
            <DynamicSection>
            <p></p>
            </DynamicSection>
            <BasicButton>Change Password</BasicButton>
        </EmptyBase>
    </div>
);
};