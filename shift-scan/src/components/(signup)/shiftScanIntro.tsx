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
    <Grids rows={"10"} gap={"5"} className="h-full mb-5">
      <Holds background={"white"} className="row-span-3 h-full">
        <Images
          titleImg={"/shiftScanLogo.svg"}
          titleImgAlt={"Logo"}
          size={"30"}
          background={"white"}
          className="m-auto"
        />
        <Contents width={"section"}>
          <Holds className="">
            <Texts size={"p3"}>Welcome to shift scan!<br/> Time to set up your account!</Texts>
          </Holds>
        </Contents>
      </Holds>
      <Holds background={"white"} className="row-span-6 h-full">
        <Contents width={"section"}>
          <Holds className="my-auto">
            <Titles size={"h2"}>Things we need to do...</Titles>
            <Texts size={"p3"} className="my-5">Choose New Password</Texts>
            <Texts size={"p3"} className="my-5">Give Permissions</Texts>
            <Texts size={"p3"} className="my-5">Choose Profile Picture</Texts>
            <Texts size={"p3"} className="my-5">Create Virtual Signature</Texts>
          </Holds>
        </Contents>
      </Holds>
      <Holds className="row-span-1 h-full">
        <Buttons background={"green"} onClick={handleNextStep}>
          <Titles>Lets Get Started!</Titles>
        </Buttons>
      </Holds>
    </Grids>
  );
};

export default ShiftScanIntro;
