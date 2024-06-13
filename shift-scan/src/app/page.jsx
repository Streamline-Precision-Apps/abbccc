"use client";
import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import '@/app/globals.css';
import UseModal from '../../components/UI/modal';
import { PrismaClient } from '@prisma/client';
import Banner from '../../components/app/banner';
import HoursButton from '../../components/app/hoursButton';
import { LoginButton, LogoutButton } from './api/auth';


const prisma = new PrismaClient();


export default function Index() {

    const t = useTranslations('page1');

    const [user, setUser] = useState({
        firstName: 'retrieving...',
        lastName: '',
        payPeriodHours: 0,
        date: 'retrieving...',
    });

    useEffect(() => {
        const fetchData = async () => { 
            try {
                const response = await fetch('../api/employee');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Fetched Data:', data); // Log the fetched data
                setUser(data);
            } catch (error) {
                console.log('Error fetching user data:', error);
            }
        };

        fetchData()   ;
    }, []);

    return (
        <div className='flex flex-col items-center space-y-4'>
            <UseModal />
            <h1>Login under:</h1>
            <LoginButton />
            <LogoutButton />
            <br />
            <Banner date={String(user.date)} />
            <h2 className='text-3xl'>{t('Name', { firstName: user.firstName, lastName: user.lastName})}</h2>
            <HoursButton payPeriodHours={Number(user.payPeriodHours)}/>
            <br />
            <h2>{t('lN4')}</h2>
        </div>
    );
}