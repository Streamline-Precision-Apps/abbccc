import { useTranslations } from "next-intl";
import "@/app/globals.css";
import { useState } from "react";
import ViewHoursComponent from "@/app/(logic_else_where)hoursDisplay";
import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface HoursProps {
    payPeriodHours: number; 
    permission: string;
}

export default function Hours({ payPeriodHours, permission }: HoursProps) {
    const t = useTranslations("page1");
    const session = useSession();

    const [toggle, setToggle] = useState(false);

    const handleClick = () => {
        setToggle(!toggle);
        console.log(toggle);
    };

    if (permission === 'ADMIN') {
        return (
            <div className="w-full flex justify-center flex-col items-center  ">
            {!toggle ? (
            <>
            <button onClick={handleClick} className='flex justify-center items-center p-5 border w-3/4 h-32 gap-2 text-white text-3xl bg-slate-700 rounded'>
            <h2>{t('lN1')}</h2>
            <span>{payPeriodHours.toString()}</span>
            </button> 
            <div className="w-full flex justify-center flex-col items-center mt-10 ">
            <div className="flex flex-row mb-5 w-3/4 text-center">
            <div className="flex flex-row align-center justify-center bg-blue-500 text-white p-10 border-2 rounded w-1/2 ">
            <h2 className="text-xl mg-auto ">{t('lN5')}</h2>
            </div>
            <div className="flex flex-row bg-blue-500 align-center items-center text-white p-10 border-2 w-1/2 rounded ">
            <h2 className="text-xl mg-auto">{t('lN6')}</h2>
            </div>
            </div>
            <Link className="w-full flex justify-center" href="/clock/Qr">
            <button className='bg-green-400 text-5xl text-white w-3/4 h-64 p-5 gap-2 rounded'>
                {t('lN3')}
            </button>
            </Link>
            </div>
            </>
            ) : (
                <ViewHoursComponent payPeriodHours={payPeriodHours} setToggle={setToggle} />
            )}
            </div>
        );
} else{
    return (
        <div className="w-full flex justify-center flex-col items-center  ">
        {!toggle ? (
        <>
        <button onClick={handleClick} className='flex justify-center items-center p-5 border w-3/4 h-32 gap-2 text-white text-3xl bg-slate-700 rounded'>
        <h2>{t('lN1')}</h2>
        <span>{payPeriodHours.toString()}</span>
        </button> 
        <div className="w-full flex justify-center flex-col items-center mt-10">
        <div>
        </div>
        <Link className="w-full flex justify-center" href="/clock/Qr">
        <button className='bg-green-400 text-5xl text-white w-3/4 h-64 p-5 gap-2 rounded'>
            {t('lN3')}
        </button>
        </Link>
        </div>
        </>
        ) : (
            <ViewHoursComponent payPeriodHours={payPeriodHours} setToggle={setToggle} />
        )}
        </div>
    );
}
} 
