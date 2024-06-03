"use client";

import {useTranslations} from 'next-intl';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import '../../globals.css';
import { Clock } from "../../../../components/clock";

export default function verify() {
const t = useTranslations('page4'); 


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
        <h1>{t('lN1')}</h1>
        <h2>{t('lN2')} {jobSite}</h2>
        <h2>{t('lN3')} {costCode}</h2>
        <Clock time={now.getTime()} />
    <div className='flex-box bg-blue-400 p-5 justify-center'>
        <Link href={'/clock/success'}>{t('lN4')}</Link>
    </div>
    </div>
    );
}