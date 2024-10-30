"use client";
import React from "react";
import { Images } from "../(reusable)/images";
import { Buttons } from "../(reusable)/buttons";
import { Texts } from "../(reusable)/texts";
import { Holds } from "../(reusable)/holds";
import { Grids } from "../(reusable)/grids";
import { Titles } from "../(reusable)/titles";
import { Contents } from "../(reusable)/contents";

const ShiftScanIntro = ({ handleNextStep }: { handleNextStep: () => void }) => {
  return (
    <Grids rows={"4"} gap={"5"} className="h-full">
      <Holds background={"lightBlue"} className="row-span-1 h-full ">
        <Holds className=" m-auto">
          <Images
            titleImg={"/shiftScanLogo.svg"}
            titleImgAlt={"Logo"}
            size={"40"}
            className="my-auto"
          />
        </Holds>
      </Holds>
      <Holds background={"white"} className="row-span-3 h-full">
        <Contents width={"section"}>
          <Holds className="py-4">
            <Titles size={"h2"} className="my-2">
              Welcome to shift scan,
            </Titles>

            <Texts>{`Let's start off by taking your account preferences!`}</Texts>
          </Holds>

          <Images
            titleImg={"/person.svg"}
            titleImgAlt={"Logo"}
            size={"70"}
            className="my-auto"
          />
        </Contents>
      </Holds>
      <Holds className="my-auto">
        <Buttons onClick={handleNextStep} size={"80"}>
          Next
        </Buttons>
      </Holds>
    </Grids>
  );
};

export default ShiftScanIntro;
