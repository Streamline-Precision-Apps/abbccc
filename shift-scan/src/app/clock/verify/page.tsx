"use client";

import {useTranslations} from 'next-intl';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import '../../globals.css';
import { Clock } from "../../../../components/clock";

export default function verify() {
const t = useTranslations('costCodes'); 


const [today] = useState(new Date());
const [jobSite] = useState('C137383'); 
const [costCode] = useState('1.02 - wood');
// by using usestate we can change the value of the variable later
useEffect(() => {
    const fetchData = async () => {

        const userData = {
            positionId: 123,
            firstName: 'Devun',
            lastName: 'Durst',
            date: today ,
            EmpId: 'durs320'
        }
    }

    fetchData();

}, [today]);

const now = new Date();

return (
    <div className='flex flex-col items-center '>
        <h1>{t('clock')}</h1>
        <h2>Job Found: {jobSite}</h2>
        <h2>Cost Code: {costCode}</h2>
        <Clock time={now.getTime()} />
    <div className='flex-box bg-blue-400 p-5 justify-center'>
        <Link href={'/clock/verify'}>{t('confirm')}</Link>
    </div>
    </div>
    );
}