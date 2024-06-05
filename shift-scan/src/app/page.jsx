"use client";
import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import '@/app/globals.css';
import Link from 'next/link';
import UseModal from '../../components/UI/modal';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export default function Index() {
    const t = useTranslations('page1');

    const [user, setUser] = useState({
        firstName: 'retrieving...',
        lastName: '',
        payPeriodHours: 'retrieving...',
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

        fetchData();
    }, []);

    return (
        <div className='flex flex-col items-center space-y-4'>
            <UseModal />
            <h1>{t('Banner')}</h1>
            <h2>{t('Name', { firstName: user.firstName, lastName: user.lastName})}</h2>
            <h2>{t('Date', { date: user.date })}</h2>
            <button className='flex justify-center p-5 border w-1/2 gap-2 bg-green-400 rounded'>
                <h2>{t('lN1')}</h2>
                <h2>{t('lN2', { payPeriodHours: user.payPeriodHours })}</h2>
            </button>
            <br />
            <button className='bg-blue-500 hover:bg-blue-700 text-white w-1/2 font-bold p-5 rounded'>
                <Link href="/clock">
                    {t('lN3')}
                </Link>
            </button>
            <h2>{t('lN4')}</h2>
        </div>
    );
}