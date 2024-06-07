import { useTranslations } from "next-intl";
import "@/app/globals.css";
import { useState } from "react";
import ViewHoursComponent from "./hoursDisplay";

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
        <div className="w-full flex justify-center">
        {!toggle ? (
        <button onClick={handleClick} className='flex justify-center p-5 border w-1/2 gap-2 bg-green-400 rounded'>
        <h2>{t('lN1')}</h2>
        <span>{payPeriodHours.toString()}</span>
        </button>
        ) : (
            <ViewHoursComponent payPeriodHours={payPeriodHours} setToggle={setToggle} />
        )}
        </div>
    );
} 
