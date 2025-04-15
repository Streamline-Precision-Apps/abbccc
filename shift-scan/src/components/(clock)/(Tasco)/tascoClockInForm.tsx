"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { Selects } from "@/components/(reusable)/selects";
import { Grids } from "@/components/(reusable)/grids";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Titles } from "@/components/(reusable)/titles";
import { EquipmentSelector } from "../(General)/equipmentSelector";

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
  returnPathUsed: boolean;
  setStep: Dispatch<SetStateAction<number>>;
  equipment: Option;
  setEquipment: Dispatch<SetStateAction<Option>>;
};
type MaterialType = {
  id: number;
  name: string;
};
type Option = {
  code: string;
  label: string;
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
  returnPathUsed,
  setStep,
  equipment,
  setEquipment,
}: TascoClockInFormProps) {
  const t = useTranslations("Clock");
  const [materialTypes, setMaterialTypes] = useState<MaterialType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMaterialTypes = async () => {
      setLoading(true);
      try {
        const materialTypesResponse = await fetch("/api/getMaterialTypes");
        const materialTypesData = await materialTypesResponse.json();
        setMaterialTypes(materialTypesData);
      } catch {
        console.error("Error fetching material types");
      } finally {
        setLoading(false);
      }
    };

    fetchMaterialTypes();
  }, []);

  return (
    <Holds
      background={"white"}
      className={loading ? " h-full w-full py-5" : "w-full h-full py-5"}
    >
      <Contents width="section">
        <Grids rows={"8"} gap={"5"} className="h-full w-full">
          {/* Back Button */}
          <Holds className="h-full w-full row-start-1 row-end-2">
            <TitleBoxes
              className="flex justify-center items-center h-full w-full"
              onClick={returnPathUsed ? () => setStep(1) : handlePrevStep}
              type="Custom"
              title={""}
              titleImg={""}
              titleImgAlt={""}
            >
              <>
                {clockInRoleTypes === "tascoAbcdLabor" && (
                  <Titles>{t("SelectMaterialType")}</Titles>
                )}
                {clockInRoleTypes === "tascoAbcdEquipment" && (
                  <Titles size={"h3"}>
                    {t("SelectMaterialTypeAndEquipment")}
                  </Titles>
                )}
                {clockInRoleTypes === "tascoEEquipment" && (
                  <Titles>{t("Title-equipment-operator")}</Titles>
                )}
              </>
            </TitleBoxes>
          </Holds>

          {/* Selection Section */}

          <Holds className="row-start-2 row-end-9  h-full w-full ">
            <Grids rows={"6"}>
              {/* Only Show Material & Labor Type Selection for ABCDShift */}
              {clockInRoleTypes === "tascoEEquipment" && (
                <>
                  <Holds className="row-start-1 row-end-7 py-4  h-full w-full">
                    <EquipmentSelector
                      onEquipmentSelect={(equipment) => {
                        if (equipment) {
                          setEquipment(equipment); // Update the equipment state with the full Option object
                        } else {
                          setEquipment({ code: "", label: "" }); // Reset if null
                        }
                      }}
                      initialValue={equipment}
                    />
                  </Holds>
                  <Holds className="row-start-8 row-end-9 col-span-2 justify-center">
                    <Buttons
                      background={
                        equipment.code === "" ? "lightGray" : "orange"
                      }
                      className="py-2"
                      onClick={handleNextStep}
                      disabled={equipment.code === ""}
                    >
                      <Titles size={"h1"}>{t("Continue")}</Titles>
                    </Buttons>
                  </Holds>
                </>
              )}

              {clockInRoleTypes === "tascoAbcdEquipment" && (
                <>
                  <Holds className="row-start-1 row-end-2 p-2">
                    <Selects
                      value={materialType || ""}
                      onChange={(e) => setMaterialType(e.target.value)}
                      className="text-center"
                    >
                      <option value="">{t("SelectMaterialType")}</option>
                      {materialTypes.map((option) => (
                        <option key={option.id} value={option.name}>
                          {option.name}
                        </option>
                      ))}
                    </Selects>
                  </Holds>
                  <Holds className="row-start-2 row-end-7 py-4 h-full w-full">
                    <EquipmentSelector
                      onEquipmentSelect={(equipment) => {
                        if (equipment) {
                          setEquipment(equipment); // Update the equipment state with the full Option object
                        } else {
                          setEquipment({ code: "", label: "" }); // Reset if null
                        }
                      }}
                      initialValue={equipment}
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
                    <Selects
                      value={materialType || ""}
                      onChange={(e) => setMaterialType(e.target.value)}
                    >
                      <option value="">{t("SelectMaterialType")}</option>
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
