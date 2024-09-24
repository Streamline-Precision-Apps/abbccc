"use client";
import { getCookieValue } from "@/utils/getCookie";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Holds } from "@/components/(reusable)/holds";

type ViewComponentProps = {
    scrollLeft: () => void;
    scrollRight: () => void;
    returnToMain: () => void;
    currentDate: Date;
}
export default function ViewComponent({ scrollLeft, scrollRight, returnToMain, currentDate }: ViewComponentProps){
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
    const dateToday = currentDate.toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' });

    return (

        <>
        <Holds position={"row"} className="w-full bg-app-dark-blue rounded-2xl relative shadow-[8px_8px_0px_grey]">
            <Holds size={"20"} >
                <Buttons background={"lightBlue"} position={"left"} className=" shadow-none" onClick={scrollLeft} >
                    <Images titleImg={"/backArrow.svg"} titleImgAlt="left" size={"70"} className="mx-auto" />
                </Buttons>
            </Holds>
                    <Holds size={"60"} >
                    <Holds size={"40"} >
                        <Buttons background={"red"} size={"70"} onClick={returnToMain}>
                        <Images titleImg={"/turnBack.svg"} titleImgAlt="return" size={"full"} className="mx-auto" />
                        </Buttons>
                        </Holds>
                        <Texts text={"white"} size={"p3"} className="pt-4 px-0">{Weekday}</Texts>
                        <Texts text={"white"} size={"p4"}>{dateToday}</Texts>
                    </Holds>
                    <Holds size={"20"} >
                <Buttons background={"lightBlue"} position={"center"} className="shadow-none" onClick={scrollRight}  >
                <Images titleImg={"/forwardArrow.svg"} titleImgAlt="right" size={"70"} className="mx-auto" />
            </Buttons>
            </Holds>
        </Holds>
        </>
    );
};
