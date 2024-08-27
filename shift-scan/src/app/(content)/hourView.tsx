"use client";
import { getCookieValue } from "@/app/(content)/getCookie";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
    const Router = useRouter();

    if (Weekday === today.toLocaleDateString(locale, { weekday: 'long' }) && currentDate.toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' }) === today.toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' })) {
        Weekday = `${t("DA-Today")}`;
    }
    const datetoday = currentDate.toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' });

    const viewPayroll = () => {
        Router.push("/timesheets");
    }
    return (

        <>
        <Contents variant={"rowSpaceBetween"} size={null}>
                <Buttons variant={"red"} size={"returnBtn"} onClick={returnToMain} >
                <Images titleImg={"/backarrow.svg"} titleImgAlt="left" variant={"icon"} size={"widgetSm"} />
                </Buttons>
                <Buttons variant={"default"} size={"default"} onClick={scrollLeft} ><Images titleImg={"/backarrow.svg"} titleImgAlt="left" variant={"icon"} size={"widgetSm"} /></Buttons>
            <Contents variant={"center"} size={"default"}>
                
                <Contents variant={"colCenter"} size={"test"} >
                <Texts variant={"totalHours"} size={"p0"}>{Weekday}</Texts>
                <Texts variant={"totalHours"} size={"p4"}>{datetoday}</Texts>
                </Contents>
            
            </Contents>
                <Buttons variant={"default"} size={"default"} onClick={scrollRight} ><Images titleImg={"/arrow.svg"} titleImgAlt="left" variant={"icon"} size={"widgetSm"} /></Buttons>
        </Contents>
        </>
    );
};

export default ViewComponent;