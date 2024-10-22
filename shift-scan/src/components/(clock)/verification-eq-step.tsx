"use client";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useEQScanData } from "@/app/context/equipmentContext";
import { useScanData } from "@/app/context/JobSiteScanDataContext";
import { CreateEmployeeEquipmentLog } from "@/actions/equipmentActions";
import { Titles } from "../(reusable)/titles";
import { Forms } from "../(reusable)/forms";
import { Contents } from "../(reusable)/contents";
import { Buttons } from "../(reusable)/buttons";
import { TextAreas } from "../(reusable)/textareas";
import { Labels } from "../(reusable)/labels";
import { Inputs } from "../(reusable)/inputs";
import { Images } from "../(reusable)/images";
import { TitleBoxes } from "../(reusable)/titleBoxes";
import { Equipment } from "@/lib/types";
import { useSession } from "next-auth/react";
import { Holds } from "../(reusable)/holds";
import Spinner from "../(animations)/spinner";
import { Grids } from "../(reusable)/grids";

type VerifyProcessProps = {
  handleNextStep: () => void;
  type: string;
  option?: string;
};

const VerificationEQStep: React.FC<VerifyProcessProps> = ({
  handleNextStep,
}) => {
  const t = useTranslations("Clock");
  const { scanEQResult } = useEQScanData();
  const [loading, setLoading] = useState(true);
  const { scanResult, setScanResult } = useScanData();
  const [equipment, setEquipmentList] = useState<Equipment[]>([]);
  //   const [selectedEquipment, setEquipment] = useState<Equipment | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchEquipmentList = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/getEquipmentList");
        const data = await response.json();
        setEquipmentList(data);
      } catch (error) {
        console.error("Error fetching equipment list:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEquipmentList();
  }, []);

  // Handle local storage logic after hooks
  useEffect(() => {
    if (!scanResult?.data) {
      const jobSiteId = localStorage.getItem("jobSite");
      setScanResult({ data: jobSiteId || "" });
    }
  }, [scanResult, setScanResult]);

  // If no session, show a loading state instead of returning early
  if (!session) {
    return (
      <Holds>
        <Spinner />
      </Holds>
    );
  }

  const { id } = session.user;

  if (loading) {
    return (
      <Holds>
        <Spinner />
      </Holds>
    );
  }

  return (
    <>
      <Contents width={"section"}>
        <Grids rows={"5"} gap={"5"}>
          <Holds background={"white"} className="row-span-1 h-full">
            <TitleBoxes
              title={t("VerifyEquipment")}
              titleImg="/equipment.svg"
              titleImgAlt="Equipment icon"
            />
          </Holds>
          <Holds background={"white"} className="row-span-4 h-full">
            <Contents width={"section"}>
              <Forms
                action={CreateEmployeeEquipmentLog}
                onSubmit={() => handleNextStep()}
                className="h-full my-5"
              >
                <Grids rows={"5"}>
                  {/*If image is not found it will be null */}
                  {equipment?.find(
                    (equipment) => equipment.qrId === scanEQResult?.data
                  )?.image ? (
                    <Holds className="row-span-1 h-full ">
                      <Holds size={"30"}>
                        <Images
                          titleImg={
                            equipment?.find(
                              (equipment) =>
                                equipment.qrId === scanEQResult?.data
                            )?.image ?? ""
                          }
                          titleImgAlt="
                      Equipment Image not found"
                          className="rounded-full border-[3px] border-black "
                        />
                      </Holds>
                    </Holds>
                  ) : null}
                  <Holds className=" h-full  row-span-1">
                    <Labels>
                      {t("Equipment-result")}
                      <Inputs
                        defaultValue={
                          equipment?.find(
                            (equipment) => equipment.qrId === scanEQResult?.data
                          )?.name
                        }
                      />
                    </Labels>
                  </Holds>

                  {/* this in put is for displaying the id */}
                  <Inputs
                    type="hidden"
                    value={scanEQResult?.data || ""}
                    className="p-2 text-center"
                    readOnly
                  />
                  <Holds className="row-span-2 h-full ">
                    <Labels>
                      {t("Equipment-notes-title")}

                      <TextAreas
                        name="comment"
                        className="p-2 border-2 border-black w-full"
                        rows={5}
                        placeholder="You get 40 characters for notes. You can edit notes later."
                        maxLength={40}
                      />
                    </Labels>
                  </Holds>
                  <Holds size={"full"} className=" h-full row-span-1 ">
                    <Holds size={"80"} className="">
                      <Buttons
                        background={"lightBlue"}
                        type="submit"
                        className="my-auto"
                      >
                        <Titles>{t("Next-btn")}</Titles>
                      </Buttons>
                    </Holds>
                  </Holds>

                  <Inputs
                    type="hidden"
                    name="equipmentId"
                    value={scanEQResult?.data || ""}
                  />
                  <Inputs
                    type="hidden"
                    name="jobsiteId"
                    value={scanResult?.data || ""}
                  />
                  <Inputs
                    type="hidden"
                    name="startTime"
                    value={new Date().toISOString()}
                  />
                  <Inputs type="hidden" name="employeeId" value={id || ""} />
                </Grids>
              </Forms>
            </Contents>
          </Holds>
        </Grids>
      </Contents>
    </>
  );
};

export default VerificationEQStep;
