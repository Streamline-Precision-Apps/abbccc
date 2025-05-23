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

type ViewComponentProps = {
  scrollLeft: () => void;
  scrollRight: () => void;
  dataRangeStart: string;
  dataRangeEnd: string;
  currentDate: string;
};
const MST_TIMEZONE = "America/Denver";

export default function AdminHourControls({
  scrollLeft,
  scrollRight,
  dataRangeStart,
  dataRangeEnd,
  currentDate,
}: ViewComponentProps) {
  const [locale, setLocale] = useState("en-US"); // Default to 'en-US'
  useEffect(() => {
    const localeCookie = getCookieValue("locale");
    if (localeCookie) {
      setLocale(localeCookie);
    }
  }, []);
  const rangeStart = new Date(dataRangeStart).toLocaleDateString(locale, {
    timeZone: MST_TIMEZONE,
    month: "short",
    day: "numeric",
  });
  const rangeEnd = new Date(dataRangeEnd).toLocaleDateString(locale, {
    timeZone: MST_TIMEZONE,
    month: "short",
    day: "numeric",
  });

  const t = useTranslations("Home");
  const today = new Date();
  let Weekday = new Date(currentDate).toLocaleDateString(locale, {
    timeZone: MST_TIMEZONE,
    weekday: "long",
  });
  if (
    Weekday === today.toLocaleDateString(locale, { weekday: "long" }) &&
    new Date(currentDate).toLocaleDateString(locale, {
      timeZone: MST_TIMEZONE,
      month: "short",
      day: "numeric",
      year: "numeric",
    }) ===
      new Date(today).toLocaleDateString(locale, {
        timeZone: MST_TIMEZONE,
        month: "short",
        day: "numeric",
        year: "numeric",
      })
  ) {
    Weekday = `${t("DA-Today")}`;
  }
  const dateToday = new Date(currentDate).toLocaleDateString(locale, {
    timeZone: MST_TIMEZONE,
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Contents width={"section"}>
      <Grids cols={"7"}>
        <Holds className="col-span-1 relative">
          <Buttons
            background={"white"}
            position={"left"}
            className="shadow-none py-2"
            onClick={scrollLeft}
          >
            <Images
              titleImg={"/arrowRightSymbol.svg"}
              titleImgAlt="left"
              size={"80"}
              className="mx-auto p-4 rotate-180"
            />
          </Buttons>
        </Holds>
        <Holds className="col-span-5 mb-4">
          <Texts text={"white"} size={"p2"} className="">
            {Capitalize(Weekday)}
          </Texts>
          <Texts text={"white"} size={"p4"}>
            {CapitalizeAll(dateToday)}
          </Texts>
          {Weekday === "Today" && (
            <Texts text={"white"} size={"p6"} className="">
              {t("CurrentRange")}: {CapitalizeAll(rangeStart)} -{" "}
              {CapitalizeAll(rangeEnd)}
            </Texts>
          )}
        </Holds>
        <Holds className="col-span-1">
          <Buttons
            background={"white"}
            position={"center"}
            className="shadow-none py-2"
            onClick={scrollRight}
          >
            <Images
              titleImg={"/arrowRightSymbol.svg"}
              titleImgAlt="right"
              size={"80"}
              className="mx-auto p-4"
            />
          </Buttons>
        </Holds>
      </Grids>
    </Contents>
  );
}
