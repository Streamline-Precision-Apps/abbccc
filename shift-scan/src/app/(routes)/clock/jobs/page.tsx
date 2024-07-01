"use client";
import React, { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import {getAuthStep, setAuthStep } from '@/app/api/auth';
import "@/app/globals.css";
import CodeFinder from '@/components/(search)/codeFinder';

const CostCodePage: React.FC = () => {
    const router = useRouter();
    const t = useTranslations('page5');

    useEffect(() => {
        if (getAuthStep() !== 'jobs') {
            console.log(getAuthStep());
            router.push('/'); // Redirect to QR page if steps are not followed  
        }
    }, []);


    useEffect(() => {
        console.log(getAuthStep()); // debugging
        setAuthStep('jobs'); // Set initial auth step to 'clock'
    }, []);

    

    return getAuthStep() === 'jobs' ? (
        <div className='mt-16 h-screen lg:w-1/2 block m-auto'>
            <div className="bg-white h-full flex flex-col items-center p-5 rounded-t-2xl">
            <button onClick={() => router.push('/')} className="flex justify-center text-lg font-light underline">{t('lN1')}</button>
            <h1>Currently working on this page!</h1>
            <CodeFinder datatype='jobsite' />
        </div>
        </div>
    ):
    (
        <>

        </>
    );
};

export default CostCodePage;