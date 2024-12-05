"use client";

import { Holds } from "@/components/(reusable)/holds";

export function CostCodeRight() {
  return (
    <Holds background={"white"} className="w-full h-full p-4">
      <Holds
        background={"offWhite"}
        className="w-full h-full overflow-y-scroll no-scrollbar"
      ></Holds>
    </Holds>
  );
}
