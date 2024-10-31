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

  currentDate: Date;
};
export default function AdminHourControls({
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
  const today = new Date();
  let Weekday = currentDate.toLocaleDateString(locale, { weekday: "long" });

  if (
    Weekday === today.toLocaleDateString(locale, { weekday: "long" }) &&
    currentDate.toLocaleDateString(locale, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) ===
      today.toLocaleDateString(locale, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
  ) {
    Weekday = `${t("DA-Today")}`;
  }
  const dateToday = currentDate.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Contents width={"section"}>
      <Grids cols={"5"}>
        <Holds className="col-span-1 relative">
          <Buttons
            background={"white"}
            position={"left"}
            className="shadow-none py-2"
            onClick={scrollLeft}
          >
            <Images
              titleImg={"/expandLeft.svg"}
              titleImgAlt="left"
              size={"80"}
              className="mx-auto p-2 rotate-180"
            />
          </Buttons>
        </Holds>
        <Holds className="col-span-3 mb-8">
          <Texts text={"white"} size={"p2"} className="">
            {Capitalize(Weekday)}
          </Texts>
          <Texts text={"white"} size={"p4"}>
            {CapitalizeAll(dateToday)}
          </Texts>
        </Holds>
        <Holds className="col-span-1">
          <Buttons
            background={"white"}
            position={"center"}
            className="shadow-none py-2"
            onClick={scrollRight}
          >
            <Images
              titleImg={"/expandLeft.svg"}
              titleImgAlt="right"
              size={"80"}
              className="mx-auto p-2"
            />
          </Buttons>
        </Holds>
      </Grids>
    </Contents>
  );
}
