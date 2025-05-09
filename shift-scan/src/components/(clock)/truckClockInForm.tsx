"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Inputs } from "@/components/(reusable)/inputs";
import { Holds } from "@/components/(reusable)/holds";
import { Selects } from "@/components/(reusable)/selects";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Grids } from "@/components/(reusable)/grids";
import { useTranslations } from "next-intl";
import { Images } from "../(reusable)/images";
import { Texts } from "../(reusable)/texts";
import { Labels } from "../(reusable)/labels";
import CodeStep from "./code-step";
import CodeFinder from "../(search)/codeFinder";
import StepButtons from "./step-buttons";
import { Titles } from "../(reusable)/titles";
import { TitleBoxes } from "../(reusable)/titleBoxes";
import Spinner from "../(animations)/spinner";
import { useOperator } from "@/app/context/operatorContext";

type TruckClockInFormProps = {
  handleNextStep: () => void;
  handlePrevStep: () => void;
  laborType: string;
  truck: string;
  setLaborType: React.Dispatch<React.SetStateAction<string>>;
  setTruck: React.Dispatch<React.SetStateAction<string>>;
  setStartingMileage: React.Dispatch<React.SetStateAction<number>>;
  clockInRoleTypes: string | undefined;
  returnPathUsed: boolean;
  setStep: Dispatch<SetStateAction<number>>;
  startingMileage: number;
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
  clockInRoleTypes,
  returnPathUsed,
  setStep,
  startingMileage,
}: TruckClockInFormProps) {
  const t = useTranslations("Clock");
  const { equipmentId } = useOperator();
  const [truckList, setTruckList] = useState<TruckListSchema[]>([]);
  const [selectedOpt, setSelectedOpt] = useState<boolean>(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [clockInTruckType, setClockInTruckType] = useState<
    string | undefined
  >();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const truckList = async () => {
      setLoading(true);
      const fetchTruckList = await fetch("/api/getTruckData").then((res) =>
        res.json()
      );
      setTruckList(fetchTruckList);
      setLoading(false);
    };
    truckList();
  }, []);

  useEffect(() => {
    setClockInTruckType(clockInRoleTypes);
    if (clockInTruckType === "truckLabor" && !hasTriggered) {
      handleNextStep();
      console.log("triggered truck labor");
      setHasTriggered(true); // Set the flag to prevent future triggers
    }
  }, [clockInTruckType, hasTriggered]);

  useEffect(() => {
    if (equipmentId) {
      setSelectedOpt(true);
    }
  }, [equipmentId]);

  return (
    <Holds
      background={"white"}
      className={loading ? "animate-pulse w-full h-full" : "w-full h-full py-5"}
    >
      <Contents width="section">
        <Grids rows={"7"} className="h-full w-full">
          <Holds className="row-start-1 row-end-2 h-full w-full">
            <TitleBoxes
              title={
                clockInRoleTypes === "truckDriver"
                  ? t("EnterTruckInfo")
                  : clockInRoleTypes === "truckEquipmentOperator"
                  ? t("EnterEquipmentInfo")
                  : ""
              }
              titleImg=""
              titleImgAlt=""
              onClick={returnPathUsed ? () => setStep(1) : handlePrevStep}
              type="noIcon-NoHref"
            />
          </Holds>
          {loading ? (
            <Holds className=" animate-pulse flex justify-center items-center h-full w-full row-start-2 row-end-7">
              <Spinner size={50} />
            </Holds>
          ) : (
            <Holds className="row-start-2 row-end-9 h-full w-full justify-center">
              {clockInRoleTypes === "truckDriver" && (
                <Grids rows={"7"} cols={"1"} gap={"5"}>
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
                  <Holds className="row-start-7 row-end-8">
                    <Buttons
                      className="py-2"
                      background={
                        !startingMileage || !truck ? "lightGray" : "orange"
                      }
                      onClick={() => {
                        handleNextStep();
                      }}
                      disabled={!truck || !startingMileage}
                    >
                      <Texts>{t("Continue")}</Texts>
                    </Buttons>
                  </Holds>
                </Grids>
              )}
              {clockInRoleTypes === "truckEquipmentOperator" && (
                <Grids rows={"7"} gap={"5"} className="h-full w-full">
                  <Holds className="row-start-1 row-end-7 h-full w-full pt-5">
                    <CodeFinder
                      datatype={"equipment-operator"}
                      setSelectedOpt={setSelectedOpt}
                      setScannedId={undefined}
                      initialValue={
                        equipmentId
                          ? { code: equipmentId, label: equipmentId }
                          : null
                      }
                      initialSearchTerm={equipmentId || ""}
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
            </Holds>
          )}
        </Grids>
      </Contents>
    </Holds>
  );
}
