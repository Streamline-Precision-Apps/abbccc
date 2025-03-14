"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Inputs } from "@/components/(reusable)/inputs";
import { Holds } from "@/components/(reusable)/holds";
import { Selects } from "@/components/(reusable)/selects";
import React, { useEffect, useState } from "react";
import { Grids } from "@/components/(reusable)/grids";
import { useTranslations } from "next-intl";
import { Images } from "../(reusable)/images";
import { Texts } from "../(reusable)/texts";
import { Labels } from "../(reusable)/labels";
import CodeStep from "./code-step";
import CodeFinder from "../(search)/codeFinder";
import StepButtons from "./step-buttons";

type TruckClockInFormProps = {
  handleNextStep: () => void;
  handlePrevStep: () => void;
  laborType: string;
  truck: string;
  setLaborType: React.Dispatch<React.SetStateAction<string>>;
  setTruck: React.Dispatch<React.SetStateAction<string>>;
  setStartingMileage: React.Dispatch<React.SetStateAction<number>>;
};
type TruckListSchema = {
  id: string;
  qrId: string;
  name: string;
};

export default function TruckClockInForm({
  handleNextStep,
  laborType,
  truck,
  setLaborType,
  setTruck,
  setStartingMileage,
  handlePrevStep,
}: TruckClockInFormProps) {
  const t = useTranslations("Clock");
  const [truckList, setTruckList] = useState<TruckListSchema[]>([]);
  const [selectedOpt, setSelectedOpt] = useState<boolean>(false);
  useEffect(() => {
    const truckList = async () => {
      const fetchTruckList = await fetch("/api/getTruckData").then((res) =>
        res.json()
      );
      setTruckList(fetchTruckList);
    };
    truckList();
  }, []);
  return (
    <Holds background={"white"} className="w-full h-full py-4">
      <Contents width="section">
        <Grids rows={"10"} cols={"1"} className="h-full w-full">
          <Grids
            rows={"2"}
            cols={"5"}
            gap={"3"}
            className="row-start-1 row-end-3 h-full"
          >
            <Holds
              className="row-start-1 row-end-2 col-start-1 col-end-2 h-full w-full justify-center "
              onClick={handlePrevStep}
            >
              <Images
                titleImg="/turnBack.svg"
                titleImgAlt="back"
                position={"left"}
              />
            </Holds>
            <Holds
              background={"white"}
              className="row-start-2 row-end-3 col-start-1 col-end-6 justify-center p-1 py-2 border-[3px] border-black rounded-[10px]"
            >
              <Selects
                value={laborType}
                onChange={(e) => {
                  setLaborType(e.target.value);
                }}
                className="bg-app-blue"
              >
                <option value="" className="text-center">
                  {t("SelectLaborType")}
                </option>
                <option value="operator" className="text-center">
                  {t("Operator")}
                </option>
                <option value="truckDriver" className="text-center">
                  {t("TruckDriver")}
                </option>
                <option value="manualLabor" className="text-center">
                  {t("ManualLabor")}
                </option>
              </Selects>
            </Holds>
          </Grids>
          <Holds className="row-start-3 row-end-11 h-full w-full justify-center">
            {laborType === "truckDriver" && (
              <Grids rows={"8"} cols={"1"} gap={"5"}>
                <Holds
                  background={"white"}
                  className="row-start-1 row-end-3 justify-center p-1 py-2 border-[3px] border-black rounded-[10px]"
                >
                  <Selects
                    value={truck}
                    onChange={(e) => {
                      setTruck(e.target.value);
                    }}
                    className="bg-app-blue"
                  >
                    <option value="" className="text-center">
                      {t("SelectTruck")}
                    </option>
                    {truckList.map((truck) => (
                      <option
                        key={truck.id}
                        value={truck.qrId}
                        className="text-center"
                      >
                        {truck.name}
                      </option>
                    ))}
                  </Selects>
                </Holds>
                <Holds className="row-start-3 row-end-4">
                  <Labels>{t("StartingMileage")}</Labels>
                  <Inputs
                    type="number"
                    name={"startingMileage"}
                    onChange={(e) => {
                      setStartingMileage(Number(e.target.value));
                    }}
                  />
                </Holds>
                <Holds className="row-start-8 row-end-9">
                  <Buttons
                    className="py-2"
                    background={"orange"}
                    onClick={() => {
                      handleNextStep();
                    }}
                  >
                    <Texts>{t("Continue")}</Texts>
                  </Buttons>
                </Holds>
              </Grids>
            )}
            {laborType === "operator" && (
              <Grids rows={"7"} gap={"5"} className="h-full w-full">
                <Holds className="row-start-1 row-end-7 h-full w-full pt-5">
                  <CodeFinder
                    setScannedId={undefined}
                    datatype={"equipment-operator"}
                    setSelectedOpt={setSelectedOpt}
                  />
                </Holds>
                {handleNextStep && (
                  <Holds className="row-start-7 row-end-8 h-full w-full justify-center">
                    <StepButtons
                      handleNextStep={handleNextStep}
                      disabled={!selectedOpt}
                    />
                  </Holds>
                )}
              </Grids>
            )}
            {laborType === "manualLabor" && (
              <Grids rows={"8"} cols={"1"} gap={"5"}>
                <Holds className="row-start-8 row-end-9">
                  <Buttons
                    className="py-2"
                    background={"orange"}
                    onClick={() => {
                      handleNextStep();
                    }}
                  >
                    <Texts>{t("Continue")}</Texts>
                  </Buttons>
                </Holds>
              </Grids>
            )}
          </Holds>
        </Grids>
      </Contents>
    </Holds>
  );
}
