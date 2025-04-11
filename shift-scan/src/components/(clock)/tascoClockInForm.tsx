"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { Selects } from "@/components/(reusable)/selects";
import { Grids } from "@/components/(reusable)/grids";
import { useTranslations } from "next-intl";
import { Images } from "../(reusable)/images";
import { Titles } from "../(reusable)/titles";
import { Dispatch, SetStateAction, use, useEffect, useState } from "react";
import CodeFinder from "../(search)/codeFinder";
import { Labels } from "../(reusable)/labels";
import { TitleBoxes } from "../(reusable)/titleBoxes";
import { useOperator } from "@/app/context/operatorContext";
import Spinner from "../(animations)/spinner";

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
  returnPathUsed,
  setStep,
}: TascoClockInFormProps) {
  const t = useTranslations("Clock");
  const { equipmentId } = useOperator();
  const [canProceed, setCanProceed] = useState(false);
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

  useEffect(() => {
    if (equipmentId) {
      setCanProceed(true);
    }
  }, [equipmentId]);

  return (
    <Holds
      background={"white"}
      className={
        loading ? "animate-pulse h-full w-full py-5" : "w-full h-full py-5"
      }
    >
      <Contents width="section">
        <Grids rows={"8"} gap={"5"} className="h-full w-full">
          {/* Back Button */}
          <Holds className="h-full w-full row-start-1 row-end-2">
            <TitleBoxes
              title={
                clockInRoleTypes === "tascoAbcdLabor"
                  ? t("SelectMaterialType")
                  : clockInRoleTypes === "tascoAbcdEquipment"
                  ? t("SelectMaterialTypeAndEquipment")
                  : clockInRoleTypes === "tascoEEquipment"
                  ? t("Title-equipment-operator")
                  : ""
              }
              titleImg="/mechanic.svg"
              titleImgAlt="Mechanic"
              onClick={returnPathUsed ? () => setStep(1) : handlePrevStep}
              type="noIcon-NoHref"
            />
          </Holds>

          {/* Selection Section */}

          {loading ? (
            <Holds className=" animate-pulse flex justify-center items-center h-full w-full row-start-2 row-end-7">
              <Spinner size={50} />
            </Holds>
          ) : (
            <Holds className="row-start-2 row-end-9  h-full w-full ">
              <Grids rows={"6"}>
                {/* Only Show Material & Labor Type Selection for ABCDShift */}
                {clockInRoleTypes === "tascoEEquipment" && (
                  <>
                    <Holds className="row-start-1 row-end-7 py-4 px-2 h-full w-full">
                      <CodeFinder
                        datatype={"equipment-operator"}
                        setSelectedOpt={setCanProceed}
                        setScannedId={undefined}
                        initialValue={
                          equipmentId
                            ? { code: equipmentId, label: equipmentId }
                            : null
                        }
                        initialSearchTerm={equipmentId || ""}
                      />
                    </Holds>
                    <Holds className="row-start-8 row-end-9 col-span-2 justify-center">
                      <Buttons
                        background={
                          canProceed === false ? "lightGray" : "orange"
                        }
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
                    <Holds className="row-start-2 row-end-7 py-4 px-2 h-full w-full">
                      <CodeFinder
                        datatype={"equipment-operator"}
                        setSelectedOpt={setCanProceed}
                        setScannedId={undefined}
                        initialValue={
                          equipmentId
                            ? { code: equipmentId, label: equipmentId }
                            : null
                        }
                        initialSearchTerm={equipmentId || ""}
                      />
                    </Holds>
                    <Holds className="row-start-8 row-end-9 col-span-2 justify-center">
                      <Buttons
                        background={
                          materialType === "" ? "lightGray" : "orange"
                        }
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
                        background={
                          materialType === "" ? "lightGray" : "orange"
                        }
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
          )}
        </Grids>
      </Contents>
    </Holds>
  );
}
