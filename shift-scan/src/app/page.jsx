"use client";

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import '@/app/globals.css';
import { useSession } from 'next-auth/react';
import ManagerPreLogin from '../../components/app/managerPreLogin';
import EmployeePreLogin from '../../components/app/employeePreLogin';
import { getAuthStep, isDashboardAuthenticated } from './api/auth';

export default function Index() {
    const t = useTranslations('page1');
    const { data: session } = useSession();


    const [user, setUser] = useState({
        firstName: 'Display Name',
        lastName: '',
        payPeriodHours: 0,
        date: 'display date',
        permission: '',
    });

    useEffect(() => {
        if (session && session.user) {
            setUser({
                firstName: session.user.firstName,
                lastName: session.user.lastName,
                payPeriodHours: 0, //data will be fetch seperately.
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                permission: session.user.permission,
            });
        }
    }, [session]);
    useEffect(() => {
        if (isDashboardAuthenticated()) {
            window.location.href = '/dashboard';
        }
    }, []);


    if (user.permission === 'ADMIN' || user.permission === 'MANAGER' || user.permission === 'PROJECTMANAGER') {
        return(
        <div className='flex flex-col items-center space-y-4'>
        <ManagerPreLogin user={user} permission={user.permission} />
    </div>
        )
    } 
    else if (user.permission === 'SUPERADMIN') {
        return(
            <div className='flex flex-col items-center space-y-4'>
            <h1>Super Admin Dahboard here</h1>
        </div>
        )
    } else{
    return (
        
        <div className='flex flex-col items-center space-y-4'>
            <EmployeePreLogin user={user} />
        </div>
    );
}}