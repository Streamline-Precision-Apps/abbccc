"use client";
import React, { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import QrReader from '@/app/(routes)/clock/Qr/qrReader';
import { useRouter } from 'next/navigation';
import { clearAuthStep, getAuthStep, setAuthStep } from '@/app/api/auth';
import "@/app/globals.css";

const CostCodePage: React.FC = () => {
    const router = useRouter();
    const t = useTranslations('page5');


    useEffect(() => {
        setAuthStep('clock'); // Set initial auth step to 'clock'
    }, []);

    

    return getAuthStep() === 'clock' ? (
        <div>
            <button onClick={() => router.push('/')} className="flex justify-center text-lg font-light underline">{t('lN1')}</button>
            <h1>Currently working on this page!</h1>
        </div>
    ):
    (
        <></>
    );
};

export default CostCodePage;