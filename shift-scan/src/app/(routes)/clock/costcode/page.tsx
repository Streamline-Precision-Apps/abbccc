"use client";
import React, { useEffect } from 'react';
import CostCodeFinder from '@/app/(routes)/clock/costcode/costcodeFinder';
import { useTranslations } from 'next-intl';
import { clearAuthStep, getAuthStep, isAuthenticated, setAuthStep } from '@/app/api/auth';
import { useRouter } from 'next/navigation';

const CostCodePage: React.FC = () => {
    const router = useRouter();
    const t = useTranslations('page5');

    useEffect(() => {
        if (getAuthStep() !== 'clock') {
            console.log(getAuthStep());
            router.push('/'); // Redirect to QR page if steps are not followed
        }
    }, []);

    return getAuthStep() === 'clock' ? (
        <div>
            <CostCodeFinder />
        </div>
    ):
    (
        <></>
    );
};

export default CostCodePage;