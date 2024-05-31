"use client";

import {useTranslations} from 'next-intl';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import '../../globals.css';

export default function Clock() {
const t = useTranslations('costCodes'); 
const recentlyUsedKeys = ['item1', 'item2', 'item3'];


const [today] = useState(new Date());
const [jobSite] = useState('C137383'); 
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

return (
    <div className='flex flex-col items-center '>
        <h1>{t('title')}</h1>
        <h2>Job Found: {jobSite}</h2>
        <div className='flex-box p-5 justify-center'>
        <input className='border-2' type="search" placeholder="Cost Code" />
    <ul className='flex-box p-5 justify-center'>
        {recentlyUsedKeys.map((key) => (
        <li className="list-none " key={key}>
            <button>
            {t(`recentlyUsed.${key}`)}
            </button>
            </li>
        
        ))}
    </ul>
    </div>
    <div className='flex-box bg-blue-400 p-5 justify-center'>
        <Link href={'/dashboard'}>{t('test')}</Link>
    </div>
    </div>
    );
}