"use client";
import React, {useEffect, useState} from 'react';
import {NextIntlClientProvider, useTranslations} from 'next-intl';
import '../globals.css';
import Link from 'next/link';
import UseModal from '../../../components/UI/modal';

export default function Index() {
    const t = useTranslations('ScanPage');

    const [user, setUser] = useState<any>({
        title: ' '
    });
    useEffect(() => {
        // simulating an api call here
        const fetchData = async () => {
            const userData = {
                title: 'Clock In'
            }
            setUser(userData);
        }
        fetchData();
    }, []);

    return (
        <div>
        <h1>{t('title')}</h1>
        <h1>QR Scanner on this page</h1>
        <button>
            <Link href={'/dashboard'}>{t('title')}</Link>
        </button>
        </div>
    );
};