"use client";
import { getCookieValue } from "@/utils/getCookie";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Holds } from "@/components/(reusable)/holds";
import Capitalize from "@/utils/captitalize";
import CapitalizeAll from "@/utils/capitalizeAll";
import { Grids } from "@/components/(reusable)/grids";
import { toZonedTime } from "date-fns-tz";

type ViewComponentProps = {
  scrollLeft: () => void;
  scrollRight: () => void;
  currentDate: string;
};
const MST_TIMEZONE = "America/Denver";

export default function ViewComponent({
  scrollLeft,
  scrollRight,
  currentDate,
}: ViewComponentProps) {
  const [locale, setLocale] = useState("en-US"); // Default to 'en-US'

  useEffect(() => {
    const localeCookie = getCookieValue("locale");
    if (localeCookie) {
      setLocale(localeCookie);
    }
  }, []);

  const t = useTranslations("Home");

  // Convert currentDate to MST
  const zonedCurrentDate = toZonedTime(new Date(currentDate), MST_TIMEZONE); //new Date(currentDate);

  const todayZoned = toZonedTime(new Date(), MST_TIMEZONE);

  // Get the weekday name in MST
  let Weekday = zonedCurrentDate.toLocaleDateString(locale, {
    timeZone: MST_TIMEZONE,
    weekday: "long",
  });

  // Check if the current date is today
  if (zonedCurrentDate.toDateString() === todayZoned.toDateString()) {
    Weekday = `${t("DA-Today")}`;
  }

  // Format the date as "Mon, Aug 5, 2024"
  const dateToday = zonedCurrentDate.toLocaleDateString(locale, {
    timeZone: MST_TIMEZONE,
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>  
      <Holds position={"row"} className="h-full">
        <Holds size={"20"} className="h-full">
          <Buttons
          onClick={scrollLeft}
          className="shadow-none"
          >
            <Images
            titleImg={"/backArrow.svg"}
            titleImgAlt="left"
            className="mx-auto"
            />
          </Buttons>
        </Holds>
        <Holds background={"white"} size={"60"} className="h-full mx-2 justify-center border-black border-[3px] rounded-[10px]">
            <Texts size={"p2"} className="">
              {Capitalize(Weekday)}
            </Texts>
            <Texts size={"p4"}>
              {CapitalizeAll(dateToday)}
            </Texts>
        </Holds>
        <Holds size={"20"} className="h-full">
          <Buttons
          onClick={scrollRight}
          className="shadow-none"
          >
            <Images
            titleImg={"/forwardArrow.svg"}
            titleImgAlt="right"
            className="mx-auto"
            />
          </Buttons>
        </Holds>
      </Holds>
    </>
  );
}
