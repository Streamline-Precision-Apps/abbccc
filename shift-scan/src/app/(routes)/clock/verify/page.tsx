"use client";
import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useScanData } from '@/app/context/JobSiteContext';
import { useSavedCostCode } from '@/app/context/CostCodeContext';
import { clearAuthStep, getAuthStep, setAuthStep } from '@/app/api/auth';
import { Clock } from '@/components/clock';
import { CreateTimeSheet } from '@/actions/timeSheetActions';
import "@/app/globals.css";

const Verify: React.FC = () => {
    const router = useRouter();
    const t = useTranslations('page5');
    const [date] = useState(new Date());
    const { scanResult } = useScanData();
    const { savedCostCode } = useSavedCostCode();

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
e.preventDefault(); // Prevent default form submission
const formData = new FormData(e.currentTarget); // Create FormData from the form
authentication(formData); // Call authentication function with FormData
};

const authentication = (formData: FormData) => {
setDb(formData);
clearAuthStep();
setAuthStep('success');
router.push('/clock/success');
};

const setDb = (formData: FormData) => {
// TODO: Implement logic to interact with database
try {
    // Add database interaction logic here
} catch (error) {
    console.error(error);
}
// Example: get form id from serverAction for information in db
// save a context of the form id to be used for future pages
};

return getAuthStep() === 'verify' ? (
<div className='mt-16 h-screen lg:w-1/2 block m-auto'>
    <form onSubmit={handleSubmit} className="h-full bg-white flex flex-col items-center p-5 rounded-t-2xl">
    <h1 className='text-3xl my-5'>{t('lN1')}</h1>
    <div className="bg-pink-100 h-1/2 w-1/2 flex flex-col items-center p-5 rounded-t-2xl text-xl">
        <h2 className='my-5'>Date: {date.toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' })}</h2>
        <h2 className='my-5'>{t('lN2')} "{scanResult?.data}"</h2>
        <h2 className='my-5'>{t('lN3')} "{savedCostCode}"</h2>
    </div>
    <Clock time={date.getTime()} />
    <button type="submit" className='bg-app-green w-36 text-black text-2xl p-2 rounded-lg mt-10'>{t('lN5')}</button>
    {/* Hidden inputs */}
    <input type="hidden" name="submit_date" value={Date.now().toString()} />
    <input type="hidden" name="userId" value={localStorage.getItem('userId') || ''} />
    <input type="hidden" name="date" value={Date.now().toString()} />
    <input type="hidden" name="jobsite_id" value={scanResult?.data || ''} />
    <input type="hidden" name="costCode" value={savedCostCode?.toString() || ''} />
    <input type="hidden" name="start_time" value={Date.now().toString()} />
    </form>
</div>
) : (
<></>
);
};

export default Verify;