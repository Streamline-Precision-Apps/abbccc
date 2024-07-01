"use client";
import React, { useEffect } from 'react';
import CostCodeFinder from '@/components/(search)/codeFinder';
import { useTranslations } from 'next-intl';
import { getAuthStep} from '@/app/api/auth';
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
        <div className='mt-16 h-screen lg:w-1/2 block m-auto'>
            <div className="bg-white h-full flex flex-col items-center p-5 rounded-t-2xl">
            <CostCodeFinder datatype='costcode' />
        </div>
        </div>
        
    ):
    (
        <></>
    );
};

export default CostCodePage;