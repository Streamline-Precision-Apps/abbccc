"use client";

import { Holds } from "@/components/(reusable)/holds";
import { Grids } from "@/components/(reusable)/grids";
import { useTranslations } from "next-intl";

export default function TruckDriverSkeleton() {
  const t = useTranslations("TruckingAssistant");

  return (
    <Grids rows={"10"} className="h-full w-full animate-pulse">
      <Holds className={"w-full h-full rounded-t-none row-start-1 row-end-2"}>
        {/* Tab skeletons */}
        <Holds position={"row"} className="h-full w-full gap-x-1">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="flex-1 bg-gray-200 rounded-md flex items-center justify-center h-12">
              <div className="h-4 w-16 bg-gray-300 rounded-md"></div>
            </div>
          ))}
        </Holds>
      </Holds>
      <Holds className={"w-full h-full rounded-t-none row-start-2 row-end-11"}>
        {/* Content skeleton */}
        <div className="p-4 w-full h-full">
          <div className="space-y-6">
            <div className="h-10 bg-gray-200 rounded-md w-2/3"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-12 bg-gray-200 rounded-md"></div>
              <div className="h-12 bg-gray-200 rounded-md"></div>
            </div>
            <div className="h-24 bg-gray-200 rounded-md"></div>
            <div className="h-12 bg-gray-200 rounded-md w-1/2"></div>
            <div className="grid grid-cols-3 gap-3">
              <div className="h-8 bg-gray-200 rounded-md"></div>
              <div className="h-8 bg-gray-200 rounded-md"></div>
              <div className="h-8 bg-gray-200 rounded-md"></div>
            </div>
          </div>
        </div>
      </Holds>
    </Grids>
  );
}