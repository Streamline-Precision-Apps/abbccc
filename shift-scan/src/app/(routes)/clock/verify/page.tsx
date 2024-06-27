"use client";
import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useScanData } from '@/app/context/JobSiteContext';
import { useSavedCostCode } from '@/app/context/CostCodeContext';
import { clearAuthStep, getAuthStep, setAuthStep } from '@/app/api/auth';
import { Clock } from '@/components/clock';
import "@/app/globals.css";

const verify: React.FC = () => {
    const router = useRouter();
    const t = useTranslations('page5');
    const [today] = useState(new Date());
    const { scanResult } = useScanData();
    const { savedCostCode } = useSavedCostCode();
    const now = new Date();

    useEffect(() => {
    if (getAuthStep() !== 'verify') {
            router.push('/');
        }
    else if (getAuthStep() === 'clock') {
        router.push('/clock/costcode'); // Redirect to QR page if steps are not followed
    }
    }, []);
    const authentication = () => {
        clearAuthStep();
        setAuthStep('success');
    }
    // const handleBeforeUnload = () => {
    //     const message = t('lN6');
    //     return message;
    // };

    // This is for the live clock page
    // Provide the data such as job found and costcode
    // Eventually, you will not be able to access this page unless you are logged in and have been through the costcode finder and scanned in.

    // This is a custom hook to use beforeunload
    // useBeforeUnload(handleBeforeUnload);

    return getAuthStep() === 'verify' ? (
        <div className='flex flex-col items-center '>
            <h1>{t('lN1')}</h1>
            <h2>{t('lN2')} {scanResult?.data}</h2>
            <h2>{t('lN3')} {savedCostCode}</h2>
            <Clock time={now.getTime()} />
            <div className='flex-box bg-blue-400 p-5 justify-center'>
                <Link onClick={authentication} href={'/clock/success'}>{t('lN5')}</Link>
            </div>
        </div>
    ):
    (
        <></>
    );
};

export default verify;