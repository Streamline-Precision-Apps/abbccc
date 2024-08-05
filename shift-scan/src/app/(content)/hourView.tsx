"use client";
import { getCookieValue } from "@/app/(content)/getCookie";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

interface ViewComponentProps {
    scrollLeft: () => void;
    scrollRight: () => void;
    returnToMain: () => void;
    currentDate: Date;
}
const ViewComponent: React.FC<ViewComponentProps> = ({ scrollLeft, scrollRight, returnToMain, currentDate }) => {
    const [locale, setLocale] = useState('en-US'); // Default to 'en-US'

    useEffect(() => {
        const localeCookie = getCookieValue('locale');
        if (localeCookie) {
            setLocale(localeCookie);
        }
    }, []);

    const t = useTranslations('Home');
    const today = new Date();
    let Weekday = currentDate.toLocaleDateString(locale, { weekday: 'long' });

    if (Weekday === today.toLocaleDateString(locale, { weekday: 'long' }) && currentDate.toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' }) === today.toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' })) {
        Weekday = `${t("DA-Today")}`;
    }
    const datetoday = currentDate.toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' });

    return (
        <div className="w-full">
            <div className="flex justify-between w-full flex-row items-center">
                <button onClick={scrollLeft} className="bg-app-blue text-white p-2 rounded">{t("DA-ScrollLeft")}</button>
                <button onClick={returnToMain} className="bg-app-red text-white p-2 rounded">{t("DA-Return")}</button>
                <button onClick={scrollRight} className="bg-app-blue text-white p-2 rounded">{t("DA-ScrollRight")}</button>
            </div>

            <div className="flex justify-between w-full mt-4 flex flex-col items-center">
                <h1>{Weekday}</h1>
                <h1>{datetoday}</h1>
            </div>
        </div>
    );
};

export default ViewComponent;