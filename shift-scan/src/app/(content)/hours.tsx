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
    const t = useTranslations('page1');
    const {payPeriodHours} = useSavedPayPeriodHours();

    const handler = () => {
        setToggle(!display);
    }

    return display ? (
        <>    
        <button onClick={handler} className=" mb-2 flex justify-center m-auto items-center space-x-16 w-11/12 h-36 text-white bg-app-dark-blue rounded-lg lg:space-x-12 lg:h-20 ">
            <h2 className="text-4xl">{t('lN1')} </h2>
            <span className="flex bg-white text-2xl text-black p-3 rounded border-3 border-black lg:pl-8 lg:pr-8 lg:text-2xl lg:p-3  ">{payPeriodHours}</span>
        </button>  
        </>
    ):  <div className="w-11/12 mx-auto"><ViewHoursComponent toggle={setToggle} /></div>
}