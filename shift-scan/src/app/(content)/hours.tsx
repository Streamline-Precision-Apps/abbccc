"use client";
import { useTranslations } from "next-intl";
import ViewHoursComponent from "@/app/(content)/hoursControl";
import { useSavedPayPeriodHours } from "../context/SavedPayPeriodHours";

// Assuming User has at least these fields, adjust accordingly

interface HoursProps {
display: boolean; 
setToggle: (toggle: boolean) => void;
}


export default function Hours({setToggle, display}: HoursProps) {
    const t = useTranslations('Home');
    const {payPeriodHours} = useSavedPayPeriodHours();

    const handler = () => {
        setToggle(!display);
    }

    return display ? (
        <>    
        <button onClick={handler} className=" mb-2 flex justify-center m-auto items-center space-x-12 w-11/12 h-36 text-white bg-app-dark-blue rounded-lg lg:space-x-12 lg:h-20 ">
            <h2 className="text-4xl">{t('Hours')} </h2>
            <span className="w-1/4 bg-white text-2xl text-black py-3 px-2 rounded border-2 border-black rounded-2xl lg:text-2xl lg:p-3 ">{payPeriodHours}{t('Unit')}</span>
        </button>  
        </>
    ):  <div className="w-11/12 mx-auto"><ViewHoursComponent toggle={setToggle} /></div>
}