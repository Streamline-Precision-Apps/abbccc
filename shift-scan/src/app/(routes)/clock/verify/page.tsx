"use client";
import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
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

    // useEffect(() => {
    // if (getAuthStep() !== 'verify') {
    //         router.push('/');
    //     }
    // else if (getAuthStep() === 'clock') {
    //     router.push('/clock/costcode'); // Redirect to QR page if steps are not followed
    // }
    // }, []);
    const authentication = () => {
        clearAuthStep();
        setAuthStep('success');
        router.push('/clock/success');
    }


    return getAuthStep() === 'verify' ? (
        <div className='mt-16 h-screen lg:w-1/2 block m-auto'>
            <div className="h-full bg-white flex flex-col items-center p-5 rounded-t-2xl">
            <h1 className='text-3xl my-5'>{t('lN1')}</h1>
            <div className="bg-pink-100 h-1/2 w-1/2 flex flex-col items-center p-5 rounded-t-2xl text-xl">
            <h2 className='my-5'>Date: {now.toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' })}</h2>
            <h2 className='my-5'>{t('lN2')} "{scanResult?.data}"</h2>
            <h2 className='my-5'>{t('lN3')} "{savedCostCode}"</h2>
            </div>
            <Clock time={now.getTime()} />
                <button className=' bg-app-green w-36 text-black text-2xl p-2 rounded-lg mt-10' onClick={authentication}>{t('lN5')}</button>
            </div>
        </div>
    ):
    (
        <></>
    );
};

export default verify;