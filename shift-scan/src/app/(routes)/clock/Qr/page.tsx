"use client";
import React, { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import QrReader from '@/app/(routes)/clock/Qr/qrReader';
import { useRouter } from 'next/navigation';
import { clearAuthStep, setAuthStep } from '@/app/api/auth';
import "@/app/globals.css";

type Props = {
    returnRouterName: string
    processName : string
}

const QRPage: React.FC<Props> = ( {returnRouterName, processName}: Props) => {
    const router = useRouter();
    const t = useTranslations('page2');
    const routerName = '/clock/costcode';

    useEffect(() => {
        // setAuthStep('clock'); // Set initial auth step to 'clock'
    }, []);

    const backAction = () => {
        // this check lets us put a route name to return to
        console.log("returnRouterName: ", returnRouterName)
        if (returnRouterName !== undefined) {
            router.push(returnRouterName);
            console.log("entered the if")
        }
        else{
        clearAuthStep();
        router.push('/');
        }
    };
    const jobsiteLoginAlternative = () => {
        setAuthStep('jobs');
        router.push('/clock/jobs');
    }

    return (
        <div className='mt-16 h-screen lg:w-1/2 block m-auto '>
            <div className="bg-white h-full flex flex-col items-center p-5 rounded-t-2xl">
                <button className=' bg-app-red w-36 text-black text-lg p-2 rounded-lg' onClick={backAction}>cancel scan</button>
            <h1 className="flex justify-center text-2xl font-bold pt-10 pb-10">{t('title')}</h1>
            <button className=" flex justify-items-center items-center w-full lg:w-1/3 h-96 p-5 border-4 border-black rounded-lg bg-gr">
                <QrReader prcessName={processName} returnRouterName={returnRouterName} routerName={routerName} />
            </button>
            <br />
            <button onClick={() => jobsiteLoginAlternative()} className="flex justify-center text-lg font-light underline">{t('lN1')}</button>
            </div>
        </div>
    );
};

export default QRPage;