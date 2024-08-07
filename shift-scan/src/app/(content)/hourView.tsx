"use client";
import { getCookieValue } from "@/app/(content)/getCookie";
import { Buttons } from "@/components/(reusable)/buttons";
import { Images } from "@/components/(reusable)/images";
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
        <div>
            <div className="flex flex-row justify-between">
                <Buttons variant={"default"} size={"small"} onClick={scrollLeft} ><Images titleImg={"/backarrow.svg"} titleImgAlt="left" variant={"icon"} size={"widgetSm"} /></Buttons>
                <Buttons variant={"red"} size={"small"} onClick={returnToMain} >{t("DA-Return")}</Buttons>
                <Buttons variant={"default"} size={"small"} onClick={scrollRight} ><Images titleImg={"/arrow.svg"} titleImgAlt="left" variant={"icon"} size={"widgetSm"} /></Buttons>
            </div>
            <div>
                <h1>{Weekday}</h1>
                <h1>{datetoday}</h1>
            </div>
        </div>
    );
};

export default ViewComponent;