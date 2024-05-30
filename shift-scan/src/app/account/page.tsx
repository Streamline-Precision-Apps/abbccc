"use client";
import React, {useEffect, useState} from 'react';
import {NextIntlClientProvider, useTranslations} from 'next-intl';
import { useLocale } from '../../../components/localeContext';
import '../globals.css';

export default function Index() {
    const locale  = useLocale();
    const t = useTranslations('PreClocked');
    const [user, setUser] = useState<any>({
        firstName: '',
        lastName: '',
        payPeriodHours: '',
        date: '',
    });
    useEffect(() => {
        // simulating an api call here
        const fetchData = async () => {
            const userData = {
                firstName: 'John',
                lastName: 'Doe',
                payPeriodHours: 40,
                date: '05-03-2024',
            }
            setUser(userData);
        }
        fetchData();
    }, []);

    return (
    <NextIntlClientProvider locale={locale}>
        <div> 
            <button>{t('Settings')}</button>
            <h1>{t('Banner')}</h1>
            <h2>{t('Name', { firstName: user.firstName, lastName: user.lastName })}</h2>
            <h2>{t('Date', { date: user.date })}</h2>
            <button>
            <h2>{t('HoursCard')}</h2>
            <h2>{t('Total-hours', { payPeriodHours: user.payPeriodHours })}</h2>
            </button>
            <br />
            <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>{t('Clock-btn')}</button>
            <h2>{t('Error')}</h2>
            <h2>{t('Copyright')}</h2>
        </div>
        </NextIntlClientProvider>
    );
};