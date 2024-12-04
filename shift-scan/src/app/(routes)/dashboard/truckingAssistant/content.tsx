"use client";
import React from "react";
import CurrentDrives from "./currentDrives";
import { Holds } from "@/components/(reusable)/holds";
import { Grids } from "@/components/(reusable)/grids";
import { Buttons } from "@/components/(reusable)/buttons";

export default function Content() {

  return (
    <Holds className="h-full">
      <Grids className="grid-rows-10">
        <Holds
          background={"white"}
          className="rounded-t-none  row-span-9 h-full"
        >
          <CurrentDrives />
          <Buttons background={"green"} href="/dashboard/truckingAssistant/add-drive" position={"right"} size= {"10"} className="my-5 mx-5 h-10">Add Drive</Buttons>
        </Holds>
      </Grids>
    </Holds>
  );
}
