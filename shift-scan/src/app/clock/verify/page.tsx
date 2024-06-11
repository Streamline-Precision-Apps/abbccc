'use client';

import {useTranslations} from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';
import '../../globals.css';
import { Clock } from "../../../../components/clock";
import { useScanData } from '../../../../components/context/ScannedJobSIte';
import { useSavedCostCode } from '../../../../components/context/SavedCostCode';
import useBeforeUnload from '../../../../components/app/refreshWarning';

export default function verify() {
// preclocked in page confirmation to send data to api route
const t = useTranslations('page5'); 
const [today] = useState(new Date());
const { scanResult} = useScanData();
const { savedCostCode} = useSavedCostCode();
// by using usestate we can change the value of the variable later
const now = new Date();

const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    const message = t('lN6');
    event.returnValue = message;
    return message;
}
// this is for the live clock page
// provide the data such as job found and costcode
// eventually you will not beable to access this page unless you are logged in and have been 
// throught the costcode finder and scanned in.

// this is a custom hook to use beforeunload
useBeforeUnload(handleBeforeUnload);

return (
    <div className='flex flex-col items-center '>
        <h1>{t('lN1')}</h1>
        <h2>{t('lN2')} {scanResult?.data}</h2>
        <h2>{t('lN3')} {savedCostCode}</h2>
        <Clock time={now.getTime()} />
    <div className='flex-box bg-blue-400 p-5 justify-center'>
        <Link href={'/clock/success'}>{t('lN5')}</Link>
    </div>
    </div>
    );
}