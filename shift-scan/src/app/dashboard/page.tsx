"use client";
import React, {useEffect, useState} from 'react';
import { useTranslations} from 'next-intl';
import '../globals.css';
import Link from 'next/link';
import UseModal from '../../../components/UI/modal';
import EmployeeCardDisplay from '../../../components/employeeCardDisplay';


export default function Index() {

    const t = useTranslations('dashboard');

    const [user, setUser] = useState<any>({
        firstName: '',
        lastName: '',
        date: '',
    });
    useEffect(() => {
        // simulating an api call here
        const fetchData = async () => {
            const userData = {
            firstName: 'Devun',
            lastName: 'Durst',
            date: '05-03-2024',
            role: "Manager",
            }
            setUser(userData);
        }
        fetchData();
    }, []);

    return (
            <div className='flex flex-col items-center space-y-4 '> 
                <UseModal />
                <h1>{t('Banner')}</h1>
                <h2>{t('Name', { firstName: user.firstName, lastName: user.lastName })}</h2>
                <h2>{t('Date', { date: user.date })}</h2>
                <br />
                <EmployeeCardDisplay role={user.role}/>
                <h2>{t('lN1')}</h2>
            </div>
    );
};