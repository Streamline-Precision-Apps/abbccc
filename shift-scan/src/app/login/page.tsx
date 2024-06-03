"use client";
import React, {useState} from 'react';
import { useTranslations} from 'next-intl';
import LocaleCheckBox from '../../../components/localeCheckBox';

import '@/app/globals.css';
import Link from 'next/link';


export default function Index() {
    const t = useTranslations('PortalLogin');

    return (
        <div> 
            <h1>{t('Title')}</h1>
            <h2>{t('lN1')}</h2>
            <h2>{t('lN2')}</h2>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                <Link href={'/'}>{t('btn-signIn')}</Link>
            </button>
            <span>
                <LocaleCheckBox />
            </span>
            <h2>{t('btn-forgot')}</h2>
            <h2>{t('lN4')}</h2>
        </div>
    );
};
