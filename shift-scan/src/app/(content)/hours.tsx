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
        <button onClick={handler} className=" mb-2 flex m-auto items-center w-11/12 h-36 space-x-5 lg:space-x-8 text-white bg-app-dark-blue rounded-lg lg:h-20 ">
            <h2 className="text-4xl pl-8 ">{t('lN1')} </h2>
            <span className="flex bg-white text-black p-4 pl-4 pr-4 rounded border-3 border-black lg:pl-8 lg:pr-8 lg:text-2xl lg:p-3  ">{payPeriodHours}</span>
        </button>  
        </>
    ):  <ViewHoursComponent toggle={setToggle} />
}