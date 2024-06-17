"use client";

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import '@/app/globals.css';
import UseModal from '../../components/UI/modal';
import Banner from '../../components/app/banner';
import HoursButton from '../../components/app/hoursButton';
import { LoginButton, LogoutButton } from './api/auth';
import { useSession } from 'next-auth/react';

export default function Index() {
    const t = useTranslations('page1');
    const { data: session } = useSession();

    const [user, setUser] = useState({
        firstName: 'retrieving...',
        lastName: '',
        payPeriodHours: 0,
        date: 'retrieving...',
    });

    useEffect(() => {
        if (session && session.user) {
            setUser({
                firstName: session.user.firstName,
                lastName: session.user.lastName,
                payPeriodHours: 0, // Assuming this data will be fetched separately
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            });
        }
    }, [session]);

    return (
        <div className='flex flex-col items-center space-y-4'>
            <UseModal />
            <h1>Login under:</h1>
            <LoginButton />
            <LogoutButton />
            <br />
            <Banner date={String(user.date)} />
            <h2 className='text-3xl'>{t('Name', { firstName: user.firstName, lastName: user.lastName })}</h2>
            <HoursButton payPeriodHours={Number(user.payPeriodHours)} />
            <br />
            <h2>{t('lN4')}</h2>
        </div>
    );
}