"use client";

import {useTranslations} from 'next-intl';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import '../../globals.css';

export default function Clock() {
const t = useTranslations('page3'); 
const recentlyUsedKeys = ['item1', 'item2', 'item3'];


const [today] = useState(new Date());
const [jobSite] = useState('C135000'); 
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
// we will be using L N # syntax for each message key
return (
    <div className='flex flex-col items-center '>
        <h1>{t('title')}</h1>
        <h2>{t('lN1') + jobSite}</h2>
        <div className='flex-box p-5 justify-center'>
        <p>{t('lN2')}</p>
        <input className='border-2' type="search" placeholder="Cost Code" />
    <ul className='flex-box p-5 justify-center'>
        {recentlyUsedKeys.map((key) => (
        <li className="list-none " key={key}>
            <button>
            {t(`used-codes.${key}`)}
            </button>
            </li>
        
        ))}
    </ul>
    </div>
    <div className='flex-box bg-blue-400 p-5 justify-center'>
        <Link href={'/clock/verify'}>{t('btn-next')}</Link>
    </div>
    </div>
    );
}