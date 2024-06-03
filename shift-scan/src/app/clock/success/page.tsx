"use client";

import {useTranslations} from 'next-intl';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import '../../globals.css';
import { Clock } from "../../../../components/clock";

export default function verify() {
const t = useTranslations('page5'); 

 const firstName = 'Devun';
const lastName = 'Durst';
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

}, []);

const now = new Date();

return (
    <div className='flex flex-col items-center '>
        <h1> {firstName} {lastName} </h1>
        <h2>{t('lN2')} {jobSite}</h2>
        <h2>{t('lN3')} {costCode}</h2>
        <p>{t('lN4')}</p>
        <Link href={'/dashboard'} className='flex justify-center p-5 border bg-blue-500'>{t('lN5')}</Link>
    </div>
    );
}