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
        <Holds className="flex flex-row justify-center items-center w-full bg-app-dark-blue rounded-2xl relative shadow-[8px_8px_0px_grey]">
                <Buttons variant={"lightBlue"} position={"left"} className=" shadow-none" onClick={scrollLeft} >
                    <Images titleImg={"/new/backArrow.svg"} titleImgAlt="left" variant={"icon"}  size={"fill"} className="mx-auto" />
                    </Buttons>
                    <Holds variant={"col"} >
                        <Buttons variant={"red"} size={"half"} onClick={returnToMain}>
                        <Images titleImg={"/new/turnBack.svg"} titleImgAlt="return" variant={"icon"} size={"fill"} className="mx-auto" />
                        </Buttons>
                        <Texts variant={"totalHours"} size={"p0"} className="pt-2">{Weekday}</Texts>
                        <Texts variant={"totalHours"} size={"p4"}>{dateToday}</Texts>
                    </Holds>
            <Buttons variant={"lightBlue"} position={"left"} className="shadow-none" onClick={scrollRight}  >
                <Images titleImg={"/new/forwardArrow.svg"} titleImgAlt="right" variant={"icon"} size={"fill"} className="mx-auto" />
            </Buttons>
        </Holds>
        </>
    );
};
