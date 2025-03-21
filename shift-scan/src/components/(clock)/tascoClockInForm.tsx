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
import { use, useEffect, useState } from "react";
import { set } from "date-fns";
import CodeFinder from "../(search)/codeFinder";
import { Labels } from "../(reusable)/labels";

type TascoClockInFormProps = {
  handlePrevStep: () => void;
  handleNextStep: () => void;
  shiftType: string;
  setShiftType: React.Dispatch<React.SetStateAction<string>>;
  laborType: string;
  setLaborType: React.Dispatch<React.SetStateAction<string>>;
  materialType: string;
  setMaterialType: React.Dispatch<React.SetStateAction<string>>;
  clockInRoleTypes: string | undefined;
};
type MaterialType = {
  id: number;
  name: string;
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
  clockInRoleTypes,
}: TascoClockInFormProps) {
  const t = useTranslations("Clock");
  const [canProceed, setCanProceed] = useState(false);
  const [materialTypes, setMaterialTypes] = useState<MaterialType[]>([]);

  useEffect(() => {
    const fetchMaterialTypes = async () => {
      try {
        const materialTypesResponse = await fetch("/api/getMaterialTypes");
        const materialTypesData = await materialTypesResponse.json();
        setMaterialTypes(materialTypesData);
      } catch {
        console.error("Error fetching material types");
      }
    };

    fetchMaterialTypes();
  }, []);

  return (
    <Holds background={"white"} className="w-full h-full pb-4">
      <Contents width="section">
        <Grids rows={"8"} cols={"5"} gap={"5"} className="h-full w-full">
          {/* Back Button */}
          <Holds
            className="row-start-1 row-end-2 col-start-1 col-end-2 h-full w-full justify-center"
            onClick={handlePrevStep}
          >
            <Images
              titleImg="/turnBack.svg"
              titleImgAlt="back"
              position={"left"}
            />
          </Holds>

          {/* Selection Section */}
          <Holds className="row-start-2 row-end-9 col-start-1 col-end-6 h-full w-full p-2 ">
            <Grids rows={"6"}>
              {/* Only Show Material & Labor Type Selection for ABCDShift */}
              {clockInRoleTypes === "tascoEEquipment" && (
                <>
                  <Holds className="row-start-1 row-end-7 py-4 px-2 h-full w-full">
                    <CodeFinder
                      datatype={"equipment-operator"}
                      setSelectedOpt={setCanProceed}
                      setScannedId={undefined}
                    />
                  </Holds>
                  <Holds className="row-start-8 row-end-9 col-span-2 justify-center">
                    <Buttons
                      background={canProceed === false ? "lightGray" : "orange"}
                      className="py-2"
                      onClick={handleNextStep}
                      disabled={canProceed === false}
                    >
                      <Titles size={"h1"}>{t("Continue")}</Titles>
                    </Buttons>
                  </Holds>
                </>
              )}

              {clockInRoleTypes === "tascoAbcdEquipment" && (
                <>
                  <Holds className="row-start-1 row-end-2 p-2">
                    <Labels size={"p5"}>{t("SelectMaterialType")}</Labels>
                    <Selects
                      value={materialType}
                      onChange={(e) => setMaterialType(e.target.value)}
                    >
                      {materialTypes.map((option) => (
                        <option key={option.id} value={option.name}>
                          {option.name}
                        </option>
                      ))}
                    </Selects>
                  </Holds>
                  <Holds className="row-start-2 row-end-7 py-4 px-2 h-full w-full">
                    <CodeFinder
                      datatype={"equipment-operator"}
                      setSelectedOpt={setCanProceed}
                      setScannedId={undefined}
                    />
                  </Holds>
                  <Holds className="row-start-8 row-end-9 col-span-2 justify-center">
                    <Buttons
                      background={materialType === "" ? "lightGray" : "orange"}
                      className="py-2"
                      onClick={handleNextStep}
                      disabled={materialType === ""}
                    >
                      <Titles size={"h1"}>{t("Continue")}</Titles>
                    </Buttons>
                  </Holds>
                </>
              )}

              {clockInRoleTypes === "tascoAbcdLabor" && (
                <>
                  <Holds className="row-start-1 row-end-2 p-2">
                    <Labels size={"p5"}>{t("SelectMaterialType")}</Labels>
                    <Selects
                      value={materialType}
                      onChange={(e) => setMaterialType(e.target.value)}
                    >
                      {materialTypes.map((option) => (
                        <option key={option.id} value={option.name}>
                          {option.name}
                        </option>
                      ))}
                    </Selects>
                  </Holds>

                  <Holds className="row-start-8 row-end-9 col-span-2 justify-center">
                    <Buttons
                      background={materialType === "" ? "lightGray" : "orange"}
                      className="py-2"
                      onClick={handleNextStep}
                      disabled={materialType === ""}
                    >
                      <Titles size={"h1"}>{t("Continue")}</Titles>
                    </Buttons>
                  </Holds>
                </>
              )}
            </Grids>
          </Holds>
        </Grids>
      </Contents>
    </Holds>
  );
}
