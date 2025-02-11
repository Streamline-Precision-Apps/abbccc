"use client";
import { Bases } from "@/components/(reusable)/bases";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Titles } from "@/components/(reusable)/titles";
import { useState } from "react";

export default function CreateMechanicProjectProcess() {
  const [step, setStep] = useState(1);

  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  return (
    <>
      <Bases>
        <Contents>
          {/*Select Scanning Option */}
          {step === 1 && (
            <Holds background={"white"} className="w-full h-full py-4">
              <Grids rows={"7"} gap={"5"} className="w-full h-full ">
                <Holds>
                  <TitleBoxes
                    title="Select Equipment"
                    titleImg="/mechanic.svg"
                    titleImgAlt={"Mechanic"}
                    type="noIcon"
                  />
                </Holds>
                <Holds className="row-start-3 row-end-5">
                  <Images titleImg="/camera.svg" titleImgAlt={""} size={"40"} />
                </Holds>
                <Holds className="row-start-6 row-end-7 h-full">
                  <Contents>
                    <Buttons background={"lightBlue"} onClick={nextStep}>
                      <Titles size={"h4"}>Scan Equipment</Titles>
                    </Buttons>
                  </Contents>
                </Holds>
                <Holds className="row-start-7 row-end-8 h-full">
                  <Contents>
                    <Buttons background={"lightBlue"} onClick={nextStep}>
                      <Titles size={"h4"}>Select Manually</Titles>
                    </Buttons>
                  </Contents>
                </Holds>
              </Grids>
            </Holds>
          )}
          {/*Qr Scan Equipment option */}
          {step === 2 && <Holds></Holds>}

          {/*Manual Entry of Equipment */}
          {step === 3 && <Holds></Holds>}

          {/*Creation of Project with problem, jobsite, status*/}
          {step === 4 && <Holds></Holds>}
        </Contents>
      </Bases>
    </>
  );
}
