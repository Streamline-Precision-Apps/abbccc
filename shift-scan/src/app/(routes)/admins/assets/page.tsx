"use client";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import React from "react";
import AssetSideBar from "./component/sidebar/AssetSideBar";
import AssetMainContent from "./component/sidebar/AssetMainContent";
export default function Assets() {
  return (
    <Holds background={"white"} className="h-full w-full rounded-[10px]">
      <Holds background={"adminBlue"} className="h-full w-full rounded-[10px]">
        <Grids
          cols={"10"}
          gap={"5"}
          className="w-full h-full p-3 rounded-[10px]"
        >
          <AssetSideBar />
          <AssetMainContent />
        </Grids>
      </Holds>
    </Holds>
  );
}
