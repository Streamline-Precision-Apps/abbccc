"use client";
import React, {useEffect, useState} from 'react';
import {NextIntlClientProvider, useTranslations} from 'next-intl';
import { useLocale } from '../../../../components/localeContext';
import '../../globals.css';
import Link from 'next/link';
import UseModal from '../../../../components/UI/modal';
import EmployeeButtons from '../../../../components/UI/employee_buttons';


export default function Index() {
    const locale  = useLocale();
    const t = useTranslations('Dashboard');

    const [user, setUser] = useState<any>({
        firstName: '',
        lastName: '',
        date: '',
    });
    useEffect(() => {
        // simulating an api call here
        const fetchData = async () => {
            const userData = {
            firstName: 'Devun',
            lastName: 'Durst',
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
                
                <br />
                <EmployeeButtons />
                <button 
                className='bg-blue-500 hover:bg-blue-700 text-white w-1/2 font-bold p-5 rounded'>
                    <Link href="/clock">
                    {t('ClockOut-btn')}
                    </Link>
                </button>
                <h2>{t('Copyright')}</h2>
            </div>
            </NextIntlClientProvider>
    );
};