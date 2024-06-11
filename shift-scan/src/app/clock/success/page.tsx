"use client";
import {useTranslations} from 'next-intl';
import { useRouter} from 'next/navigation';
import { useEffect, useState } from 'react';
import '../../globals.css';
import { useScanData } from '../../../../components/context/ScannedJobSIte';
import { useSavedCostCode } from '../../../../components/context/SavedCostCode';
import RedirectAfterDelay from '../../../../components/clock/redirectAfterDelay';

export default function verify() {
// this page will be used when the user has successfully clocked in
// it appears for a few seconds and then redirects to the dashboard
const t = useTranslations('page5'); 
const router = useRouter();
const [today] = useState(new Date());
const { scanResult} = useScanData();
const { savedCostCode} = useSavedCostCode();
const now = new Date();

// to have a delay of 5 seconds uncomment the line below

return (
    <div className='flex flex-col items-center '>
        <h1> {} </h1>
        <h2>{t('lN2')} {scanResult?.data}</h2>
        <h2>{t('lN3')} {savedCostCode}</h2>
        <p>{t('lN4')}</p>
        {/* <RedirectAfterDelay delay={5000} to="/dashboard" /> */}
    </div>
    );
}