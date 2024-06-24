"use client";
import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useScanData } from '@/app/context/ScannedJobSIte';
import { useSavedCostCode } from '@/app/context/SavedCostCode';
import RedirectAfterDelay from '@/components/redirectAfterDelay';
import { clearAuthStep, getAuthStep, isAuthenticated, setAuthStep } from '@/app/api/auth';

const SuccessPage: React.FC = () => {
    const t = useTranslations('page5');
    const router = useRouter();
    const { scanResult } = useScanData();
    const { savedCostCode } = useSavedCostCode();

    useEffect(() => {
        if (!isAuthenticated()) {
            console.log('Not authenticated');
            console.log(getAuthStep());
            // router.push('/'); // Redirect to login page if not authenticated
        } else if (getAuthStep() !== 'success') {
            router.push('/'); // Redirect to QR page if steps are not followed
        }
    }, []);

    // const handleBeforeUnload = () => {
    //     const message = t('lN6');
    //     clearAuthStep();
    //     setAuthStep('dashboard');
    //     return message;
    // };


    return isAuthenticated() ? (
        <div className='flex flex-col items-center '>
            <h1>{t('lN1')}</h1>
            <h2>{t('lN2')} {scanResult?.data}</h2>
            <h2>{t('lN3')} {savedCostCode}</h2>
            <p>{t('lN4')}</p>
            <RedirectAfterDelay delay={5000} to="/dashboard" />
        </div>
    ) : (
        <></> // Placeholder for non-authenticated state handling
    );
};

export default SuccessPage;