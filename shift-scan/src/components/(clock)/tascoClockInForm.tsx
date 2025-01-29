"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { Selects } from "@/components/(reusable)/selects";
import { Grids } from "@/components/(reusable)/grids";
import { useTranslations } from "next-intl";
import { Images } from "../(reusable)/images";
import CodeStep from "./code-step";
import { Titles } from "../(reusable)/titles";

type TascoClockInFormProps = {
  handlePrevStep: () => void;
  handleNextStep: () => void;
  shiftType: string;
  setShiftType: React.Dispatch<React.SetStateAction<string>>;
  laborType: string;
  setLaborType: React.Dispatch<React.SetStateAction<string>>;
  materialType: string;
  setMaterialType: React.Dispatch<React.SetStateAction<string>>;
};

export default function TascoClockInForm({
  handleNextStep,
  laborType,
  setLaborType,
  materialType,
  setMaterialType,
  shiftType,
  setShiftType,
  handlePrevStep,
}: TascoClockInFormProps) {
  const t = useTranslations("Clock");

  const shiftTypeArray = [
    { value: "", label: t("SelectShiftType") },
    { value: "abcdShift", label: "A, B, C, D Shift" },
    { value: "fShift", label: "F Shift Mud Conditioning" },
    { value: "eShift", label: "E Shift Screen Lime Rock" },
  ];

  const laborTypeArray = [
    { value: "", label: t("SelectLaborType") },
    { value: "manualLabor", label: t("ManualLabor") },
    { value: "equipmentOperator", label: t("EquipmentOperator") },
  ];

  const materialsArray = [
    { value: "", label: t("SelectMaterialType") },
    { value: "rock", label: "Rock" },
    { value: "elimco", label: "Elimco" },
    { value: "coal", label: "Coal" },
    { value: "limeKiln", label: "Lime Kiln" },
    { value: "agWaste", label: "Ag Waste" },
    { value: "beltMud", label: "Belt Mud" },
    { value: "endOfCampaignCleanUp", label: "End Of Campaign Clean Up" },
  ];

  return (
    <Holds background={"white"} className="w-full h-full py-4">
      <Contents width="section">
        <Grids rows={"12"} cols={"5"} gap={"3"} className="h-full w-full">
          <Holds
            className="row-start-1 row-end-2 col-start-1 col-end-2 h-full w-full justify-center"
            onClick={() => handlePrevStep()}
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
              value={shiftType}
              onChange={(e) => {
                setShiftType(e.target.value);
              }}
              className="bg-app-blue text-xs"
            >
              {shiftTypeArray.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="text-center"
                >
                  {option.label}
                </option>
              ))}
            </Selects>
          </Holds>

          <Holds className="row-start-3 row-end-13 col-start-1 col-end-6 h-full w-full justify-center">
            {shiftType === "fShift" && (
              <CodeStep
                datatype="equipment-operator" // using this to set the title of equipment
                handleNextStep={handleNextStep}
                backArrow={false}
              />
            )}
            {shiftType === "eShift" && (
              <CodeStep
                datatype="equipment-operator" // using this to set the title of equipment
                handleNextStep={handleNextStep}
                backArrow={false}
              />
            )}

            {shiftType === "abcdShift" && (
              <Grids rows={"8"} cols={"2"} gap={"3"}>
                <Holds
                  background={"white"}
                  className=" row-start-1 row-end-2 col-span-1 justify-center p-1 py-2 border-[3px] border-black rounded-[10px]"
                >
                  <Selects
                    value={materialType}
                    onChange={(e) => {
                      setMaterialType(e.target.value);
                    }}
                    className="bg-app-blue text-xs"
                  >
                    {materialsArray.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        className="text-center"
                      >
                        {option.label}
                      </option>
                    ))}
                  </Selects>
                </Holds>
                <Holds
                  background={"white"}
                  className=" row-start-1 row-end-2 col-span-1 justify-center p-1 py-2 border-[3px] border-black rounded-[10px]"
                >
                  <Selects
                    value={laborType}
                    onChange={(e) => {
                      setLaborType(e.target.value);
                    }}
                    className="bg-app-blue text-xs"
                  >
                    {laborTypeArray.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        className="text-center"
                      >
                        {option.label}
                      </option>
                    ))}
                  </Selects>
                </Holds>
                {laborType === "manualLabor" && (
                  <Holds className="row-start-8 row-end-9 col-span-2 justify-center">
                    <Buttons
                      background={"orange"}
                      className="py-2"
                      onClick={handleNextStep}
                    >
                      <Titles size={"h1"}>{t("Continue")}</Titles>
                    </Buttons>
                  </Holds>
                )}
                {laborType === "equipmentOperator" && (
                  <Holds className="row-start-2 row-end-9 col-span-2 h-full w-full">
                    <Grids rows={"1"} cols={"1"}>
                      <CodeStep
                        datatype="equipment-operator" // using this to set the title of equipment
                        handleNextStep={handleNextStep}
                        backArrow={false}
                      />
                    </Grids>
                  </Holds>
                )}
                {laborType !== "manualLabor" &&
                  laborType !== "equipmentOperator" && (
                    <Holds className="row-start-8 row-end-9 col-span-2 justify-center">
                      <Buttons
                        background={"grey"}
                        className="py-2 "
                        disabled
                        onClick={() => {}}
                      >
                        <Titles size={"h1"}>{t("Continue")}</Titles>
                      </Buttons>
                    </Holds>
                  )}
              </Grids>
            )}
          </Holds>
        </Grids>
      </Contents>
    </Holds>
  );
}
