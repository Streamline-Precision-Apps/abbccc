"use client";

import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Images } from "@/components/(reusable)/images";
import { Titles } from "@/components/(reusable)/titles";
import { Grids } from "@/components/(reusable)/grids";
import { useTranslations } from "next-intl";

export default function TruckingContextsSkeleton() {
  const t = useTranslations("Widgets");

  return (
    <>
      <Holds background={"white"} className="row-start-1 row-end-2 h-full">
        <TitleBoxes>
          <Holds
            position={"row"}
            className="w-full justify-center items-center space-x-2"
          >
            <Titles size={"h2"} className="">
              {t("TruckingAssistant")}
            </Titles>
            <Images
              className="max-w-8 h-auto object-contain"
              titleImg={"/trucking.svg"}
              titleImgAlt={"Truck"}
            />
          </Holds>
        </TitleBoxes>
      </Holds>
      <Holds className="row-start-2 row-end-8 h-full animate-pulse">
        <Grids rows={"10"} className="h-full w-full">
          <Holds className={"w-full h-full rounded-t-none row-start-1 row-end-2"}>
            <Holds position={"row"} className="h-full w-full gap-x-1">
              {/* Tab placeholders */}
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="h-10 bg-gray-200 rounded-md flex-1"></div>
              ))}
            </Holds>
          </Holds>
          <Holds className={"w-full h-full rounded-t-none row-start-2 row-end-11"}>
            <div className="w-full h-full bg-gray-100 rounded-md p-4">
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded-md w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded-md w-1/2"></div>
                <div className="h-20 bg-gray-200 rounded-md w-full"></div>
                <div className="h-8 bg-gray-200 rounded-md w-2/3"></div>
              </div>
            </div>
          </Holds>
        </Grids>
      </Holds>
    </>
  );
}