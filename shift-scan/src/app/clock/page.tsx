"use client";
import React, {useEffect, useState} from 'react';
import { useTranslations} from 'next-intl';
import '../globals.css';
import Link from 'next/link';
import QrReader from '../../../components/clock/qrReader';



export default function Index() {
    const t = useTranslations('page2');

    useEffect(() => {

        const fetchData = async () => {

            const userData = {
                employeeId: 123,
                firstName: 'Devun',
                lastName: 'Durst',
                EmpId: 'durs320'
            }
        }

        fetchData();

    }, []);

    return (
        <div className='flex flex-col items-center'>
        <h1 className="text-align-center text-2xl mb-4">{t('title')}</h1>
        <h2>{t('subtitle')}</h2>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        <QrReader/>
            <Link href={"/clock/costcode"}>{t('btn-scan')}</Link>
        </button>
        </div>
    );
};