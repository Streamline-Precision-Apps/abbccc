"use client";

import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { useTranslations } from "next-intl";
import { Images } from "@/components/(reusable)/images";

export default function RefuelLayoutSkeleton() {
  const t = useTranslations("Tasco");

  return (
    <Holds className="w-full h-full animate-pulse">
      <Grids rows={"8"} gap={"5"}>
        <Holds position={"row"} className="w-full h-full row-start-1 row-end-2">
          <Holds size={"80"}>
            <Texts size={"p3"} className="font-bold">
              {t("DidYouRefuel?")}
            </Texts>
          </Holds>
          <Holds size={"20"}>
            <div className="w-10 h-10 bg-gray-200 rounded-md"></div>
          </Holds>
        </Holds>
        <Holds className="w-full h-full row-start-2 row-end-9">
          <div className="space-y-4">
            {/* Skeleton items for refuel logs */}
            {[1, 2].map((item) => (
              <div
                key={item}
                className="w-full h-16 bg-gray-200 rounded-md"
              ></div>
            ))}
          </div>
        </Holds>
      </Grids>
    </Holds>
  );
}
