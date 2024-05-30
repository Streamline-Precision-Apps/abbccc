"use client";
import React, {useState, useEffect} from 'react';
import {useTranslations} from 'next-intl';
import './globals.css';


export default function Index() {
    const t = useTranslations('PortalLogin');

    const handleLanguageSwitch = () => {
        document.cookie = `locale=${'es'};`; 
        window.location.reload();
    }

    return (

        <div> 
            <h1>{t('Title')}</h1>
            <h2>{t('EmpId')}</h2>
            <h2>{t('Password')}</h2>
            <h2>{t('Submit')}</h2>
            <h2>{t('Language')}</h2>
            <span>
            <input
                type="checkbox"
                onChange={() => handleLanguageSwitch()}
                />
            </span>
            <h2>{t('ForgotPassword')}</h2>
            <h2>{t('Error')}</h2>
            <h2>{t('Copyright')}</h2>
        </div>

    )
}
