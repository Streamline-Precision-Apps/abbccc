"use client";
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useScanData } from '@/app/context/JobSiteContext';
import { useSavedCostCode } from '@/app/context/CostCodeContext';
import { useSavedTimeSheetData } from '@/app/context/TimeSheetIdContext';
import { clearAuthStep, getAuthStep, setAuthStep } from '@/app/api/auth';
import { Clock } from '@/components/clock';
import { CreateTimeSheet} from '@/actions/timeSheetActions';
import "@/app/globals.css";
import { useSavedUserData } from '@/app/context/UserContext';


const Verify: React.FC = () => {
    const router = useRouter();
    const t = useTranslations('page5');
    const [date] = useState(new Date());
    const { scanResult } = useScanData();
    const { savedCostCode } = useSavedCostCode();
    const { savedUserData } = useSavedUserData();

    useEffect(() => {
        setAuthStep("success");
    }, []); 

    return (
        <div className='mt-16 h-screen lg:w-1/2 block m-auto'>
            <form action={CreateTimeSheet} className="h-full bg-white flex flex-col items-center p-5 rounded-t-2xl">
                <h1 className='text-3xl my-5'>{t('lN1')}</h1>
                <div className="bg-pink-100 h-1/2 w-1/2 flex flex-col items-center p-5 rounded-t-2xl text-xl">
                    <h2 className='my-5'>Date: {date.toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' })}</h2>
                    <h2 className='my-5'>{t('lN2')} "{scanResult?.data}"</h2>
                    <h2 className='my-5'>{t('lN3')} "{savedCostCode}"</h2>
                </div>
                <Clock time={date.getTime()} />
                <button type="submit" className="bg-app-blue w-1/2 h-1/6 py-4 px-5 rounded-lg text-black font-bold mt-5">
                    {t('lN5')}
                    </button> 
                {/* Hidden inputs */}
                <input type="hidden" name="submit_date" value={new Date().toString()} />
                <input type="hidden" name="userId" value={savedUserData?.id || ''} />
                <input type="hidden" name="date" value={new Date().toString()} />
                <input type="hidden" name="jobsite_id" value={scanResult?.data || ''} />
                <input type="hidden" name="costcode" value={savedCostCode?.toString() || ''} />
                <input type="hidden" name="start_time" value={new Date().toString()} />
                <input type="hidden" name="user" value={savedUserData?.id || ''} />
            </form>
        </div>
    );
};

export default Verify;