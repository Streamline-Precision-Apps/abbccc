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
        <div className="w-full flex justify-center flex-col items-center ">    
        <button onClick={handler} className="flex justify-center items-center p-5 border w-3/4 h-32 gap-2 text-white text-3xl bg-slate-700 rounded-lg">
            <h2 className="flex">{t('lN1')} <div className=" flex items-center bg-white text-black p-2 rounded ">{payPeriodHours}</div></h2>
        </button>  
        </div>
    ):  <ViewHoursComponent toggle={setToggle} />
}