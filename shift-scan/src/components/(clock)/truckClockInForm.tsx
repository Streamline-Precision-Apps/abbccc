"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Inputs } from "@/components/(reusable)/inputs";
import { Holds } from "@/components/(reusable)/holds";
import { Selects } from "@/components/(reusable)/selects";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Grids } from "@/components/(reusable)/grids";
import { useTranslations } from "next-intl";
import { Texts } from "../(reusable)/texts";
import { Labels } from "../(reusable)/labels";
import CodeFinder from "../(search)/codeFinder";
import StepButtons from "./step-buttons";
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
  const [displayValue, setDisplayValue] = useState("");
  const [selectedOpt, setSelectedOpt] = useState<boolean>(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [clockInTruckType, setClockInTruckType] = useState<
    string | undefined
  >();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const truckList = async () => {
      setLoading(true);

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
        <Grids rows={"8"} className="h-full w-full">
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
            <Holds className=" animate-pulse flex justify-center items-center h-full w-full row-start-2 row-end-9">
              <Spinner size={50} />
            </Holds>
          ) : (
            <Holds className="row-start-2 row-end-9 h-full w-full ">
              {clockInRoleTypes === "truckDriver" && (
                <Grids rows={"7"} className="h-full w-full">
                  <Holds className="row-start-1 row-end-2 h-full">
                    <Inputs
                      type="text"
                      name={"startingMileage"}
                      value={displayValue}
                      placeholder={t("StartingMileage")}
                      onChange={(e) => {
                        // Strip non-numeric characters
                        const numericValue = e.target.value.replace(
                          /[^0-9]/g,
                          ""
                        );
                        setDisplayValue(numericValue);
                        setStartingMileage(Number(numericValue));
                      }}
                      onBlur={() => {
                        if (startingMileage) {
                          setDisplayValue(`${startingMileage} Miles`);
                        }
                      }}
                      onFocus={() => {
                        setDisplayValue(startingMileage?.toString() || "");
                      }}
                      className="text-center"
                    />
                  </Holds>
                  <Holds className="row-start-2 row-end-7 h-full">
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
