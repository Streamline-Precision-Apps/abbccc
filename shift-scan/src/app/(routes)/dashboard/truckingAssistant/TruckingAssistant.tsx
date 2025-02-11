"use client";
import React from "react";
import { Holds } from "@/components/(reusable)/holds";
import { Grids } from "@/components/(reusable)/grids";
import DidYouRefuel from "../tasco/components/didYouRefuel";
import Notes from "../tasco/components/notes";
import MaterialHauled from "./components/MaterialHauled";
import LeftIdaho from "./components/LeftIdaho";
import EquipmentHauled from "./components/EquipmentHauled";
import EndingMileage from "./components/EndingMileage";

export default function TruckingAssistant() {
  return (
    <Holds
      background={"white"}
      className="h-full p-4 overflow-y-hidden no-scrollbar"
    >
      <Grids className="grid-rows-10">
        <MaterialHauled />
        <DidYouRefuel />
        <LeftIdaho />
        <EquipmentHauled />
        <EndingMileage />
        <Notes />
      </Grids>
    </Holds>
  );
}
