"use client";
import React, { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import QrReader from '../../../../components/clock/qrReader';
import { useRouter } from 'next/navigation';
import { setAuthStep } from '@/app/api/auth';

const QRPage: React.FC = () => {
    const router = useRouter();
    const t = useTranslations('page2');

    useEffect(() => {
        setAuthStep('clock'); // Set initial auth step to 'clock'
    }, []);

    return (
        <div className='flex flex-col items-center'>
            <h1 className="text-align-center text-2xl mb-4">{t('title')}</h1>
            <h2>{t('subtitle')}</h2>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                <QrReader/>
            </button>
        </div>
    );
};

export default QRPage;