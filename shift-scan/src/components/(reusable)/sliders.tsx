"use client";
import { Dispatch, SetStateAction } from "react";
import { Grids } from "./grids";
import { Holds } from "./holds";
import { Titles } from "./titles";
import { Texts } from "./texts";

export default function Sliders({
  leftTitle,
  rightTitle,
  activeTab,
  setActiveTab,
}: {
  leftTitle: string;
  rightTitle: string;
  activeTab: number;
  setActiveTab: Dispatch<SetStateAction<number>>; // Changed from Number to number
}) {
  return (
    <div className="h-full w-full bg-app-gray rounded-[10px] border-[3px] border-black overflow-hidden relative">
      <Grids cols={"2"} className="h-full w-full relative">
        {/* Slide Background */}
        <div
          className={`
             absolute top-0 h-full w-1/2 transition-transform duration-300 bg-app-blue
            ${activeTab === 1 ? "translate-x-0" : "translate-x-full"}
            ${
              activeTab === 1
                ? "rounded-r-[4px] border-t-[0.1px] border-b-[0.1px] border-l-[0.1px] border-r-[2.5px]  border-black"
                : "rounded-l-[4px] border-t-[0.1px] border-b-[0.1px] border-l-[2.5px] border-r-[0.1px]  border-black"
            }
            
          `}
        />

        <Holds
          className={`h-full w-full col-span-1 py-2 z-10 flex justify-center items-center cursor-pointer`}
          onClick={() => setActiveTab(1)}
        >
          <Texts size={"p6"}>{leftTitle}</Texts>
        </Holds>

        <Holds
          className={`h-full w-full col-span-1 py-2 z-10 flex justify-center items-center cursor-pointer`}
          onClick={() => setActiveTab(2)}
        >
          <Texts size={"p6"}>{rightTitle}</Texts>
        </Holds>
      </Grids>
    </div>
  );
}
