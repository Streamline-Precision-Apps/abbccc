"use client";
import React, {useEffect, useState} from 'react';
import {NextIntlClientProvider, useTranslations} from 'next-intl';
import { useLocale } from '../../../components/localeContext';
import '../globals.css';
import Link from 'next/link';
import UseModal from '../../../components/UI/modal';

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
                firstName: 'Devun',
                lastName: 'Durst',
                payPeriodHours: 40,
                date: '05-03-2024',
            }
            setUser(userData);
        }
        fetchData();
    }, []);

    return (
    <NextIntlClientProvider locale={locale}>
        <div className='flex flex-col items-center space-y-4 '> 
            
            <UseModal />
            <h1>{t('Banner')}</h1>
            <h2>{t('Name', { firstName: user.firstName, lastName: user.lastName })}</h2>
            <h2>{t('Date', { date: user.date })}</h2>
            <button className='flex justify-center p-5 border w-1/2 gap-2 bg-green-400 rounded'>
            <h2>{t('HoursCard')}</h2>
            <h2>{t('Total-hours', { payPeriodHours: user.payPeriodHours })}</h2>
            </button>
            <br />
            <button 
            className='bg-blue-500 hover:bg-blue-700 text-white w-1/2 font-bold p-5 rounded'>
                <Link href="/clock">
                {t('Clock-btn')}
                </Link>
            </button>
            
            <h2>{t('Copyright')}</h2>
        </div>
        </NextIntlClientProvider>
    );
};