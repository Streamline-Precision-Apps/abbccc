"use client";
import React, {useEffect, useState} from 'react';
import { useTranslations} from 'next-intl';
import '../globals.css';
import Link from 'next/link';


export default function Index() {
    const t = useTranslations('ScanPage');
    const [today] = useState(new Date());

    useEffect(() => {

        const fetchData = async () => {

            const userData = {
                positionId: 123,
                firstName: 'Devun',
                lastName: 'Durst',
                EmpId: 'durs320'
            }
        }

        fetchData();

    }, []);

    return (
        <div>
        <h1 className="text-align-center text-2xl mb-4">{t('title')}</h1>
        <h2>{t('subtitle')}</h2>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            <Link href={"/clock/costcode"}>{t('test')}</Link>
        </button>
        </div>
    );
};