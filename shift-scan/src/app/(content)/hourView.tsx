"use client";
import { getCookieValue } from "@/utils/getCookie";
import { Buttons } from "@/components/(reusable)/buttons";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Holds } from "@/components/(reusable)/holds";
import Capitalize from "@/utils/captitalize";
import CapitalizeAll from "@/utils/capitalizeAll";
import { Titles } from "@/components/(reusable)/titles";

type ViewComponentProps = {
  scrollLeft: () => void;
  scrollRight: () => void;
  currentDate: string;
};

/**
 * A control component for displaying the date and navigating time tracking data in a time tracking visualization.
 */
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
  const zonedCurrentDate = new Date(currentDate); //new Date(currentDate);

  const todayZoned = new Date();

  // Get the weekday name in MST
  const Weekday = zonedCurrentDate.toLocaleDateString(locale, {
    weekday: "long",
  });

  // Format the date as "Mon, Aug 5, 2024"
  const dateToday = zonedCurrentDate.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Holds background={"white"} position={"row"} className="h-full w-full p-2">
      <Buttons onClick={scrollLeft} className="shadow-none w-[60px]">
        <Images
          titleImg={"/less-than.svg"}
          titleImgAlt="left"
          className="mx-auto h-5 w-5"
        />
      </Buttons>

      <Holds
        background={"white"}
        size={"80"}
        className="h-full mx-2 justify-center rounded-[10px]"
      >
        <Titles size={"h3"} className="">
          {zonedCurrentDate.toDateString() === todayZoned.toDateString()
            ? `${t("DA-Today")}, ${Capitalize(Weekday)}`
            : Capitalize(Weekday)}
        </Titles>
        <Texts size={"p5"}>{CapitalizeAll(dateToday)}</Texts>
      </Holds>

      <Buttons onClick={scrollRight} className="shadow-none w-[60px]">
        <Images
          titleImg={"/greater-than.svg"}
          titleImgAlt="right"
          className="mx-auto h-5 w-5"
        />
      </Buttons>
    </Holds>
  );
}
