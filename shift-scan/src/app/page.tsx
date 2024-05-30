"use client";
import React, {useState} from 'react';
import {NextIntlClientProvider, useTranslations} from 'next-intl';
import LocaleCheckBox from '../../components/localeCheckBox';
import { useLocale } from '../../components/localeContext';
import './globals.css';
import Link from 'next/link';


export default function Index() {
    const locale  = useLocale();
    const t = useTranslations('PortalLogin');

    return (
    <NextIntlClientProvider locale={locale}>
        <div> 
            <h1>{t('Title')}</h1>
            <h2>{t('EmpId')}</h2>
            <h2>{t('Password')}</h2>
            <button>
                <Link href={'/account'}>{t('Submit')}</Link>
            </button>
            <h2>{t('Language')}</h2>
            <span>
                <LocaleCheckBox />
            </span>
            <h2>{t('ForgotPassword')}</h2>
            <h2>{t('Error')}</h2>
            <h2>{t('Copyright')}</h2>
        </div>
        </NextIntlClientProvider>
    );
};

