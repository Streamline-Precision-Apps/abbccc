import { useTranslations } from "next-intl";
import "@/app/globals.css";
import { useState } from "react";
import ViewHoursComponent from "./hoursDisplay";
import Link from 'next/link';

interface HoursProps {
    payPeriodHours: number; // Change Number to number
}
export default function Hours({ payPeriodHours }: HoursProps) {
    const t = useTranslations("page1");
    const [toggle, setToggle] = useState(false);

    const handleClick = () => {
        setToggle(!toggle);
        console.log(toggle);
    };
    return (
        <div className="w-full flex justify-center flex-col items-center  ">
        {!toggle ? (
        <>
        <button onClick={handleClick} className='flex justify-center items-center p-5 border w-3/4 h-32 gap-2 text-white text-3xl bg-slate-700 rounded'>
        <h2>{t('lN1')}</h2>
        <span>{payPeriodHours.toString()}</span>
        </button> 
        <div className="w-full flex justify-center flex-col items-center mt-10">
        <Link className="w-full flex justify-center" href="/clock">
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
