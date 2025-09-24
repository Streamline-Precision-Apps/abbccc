"use client";
import { useSession } from "next-auth/react";
import { Buttons } from "../(reusable)/buttons";
import { Holds } from "../(reusable)/holds";
import { Grids } from "../(reusable)/grids";
import { Titles } from "../(reusable)/titles";
import { useTranslations } from "next-intl";
import { useCommentData } from "@/app/context/CommentContext";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Images } from "../(reusable)/images";
import { Selects } from "../(reusable)/selects";
import { TextAreas } from "../(reusable)/textareas";
import { Texts } from "../(reusable)/texts";
import { Labels } from "../(reusable)/labels";

type Props = {
  handleNextStep: () => void;
  setClockInRole: React.Dispatch<React.SetStateAction<string | undefined>>;
  clockInRole: string | undefined;
  option?: string;
  handleReturn?: () => void;
  handleReturnPath: () => void;
  type: string;
  numberOfRoles: number;
  clockInRoleTypes: string | undefined;
  setClockInRoleTypes: Dispatch<SetStateAction<string | undefined>>;
  clockOutComment: string | undefined;
  mechanicView: boolean;
  laborView: boolean;
  truckView: boolean;
  tascoView: boolean;
};

export default function SwitchJobsMultiRoles({
  handleNextStep,
  setClockInRole,
  clockInRole,
  handleReturnPath,
  numberOfRoles,
  clockInRoleTypes,
  setClockInRoleTypes,
  clockOutComment,
  mechanicView,
  laborView,
  truckView,
  tascoView,
}: Props) {
  const t = useTranslations("Clock");
  const { data: session } = useSession();
  const { setCommentData } = useCommentData();
  const [commentsValue, setCommentsValue] = useState<string>("");
  const [submittable, setSubmittable] = useState<boolean>(false);

  const selectView = (selectedRoleType: string) => {
    setClockInRoleTypes(selectedRoleType);

    // Map the selected role type to the main clock-in role
    if (
      selectedRoleType === "tascoAbcdLabor" ||
      selectedRoleType === "tascoAbcdEquipment" ||
      selectedRoleType === "tascoEEquipment"
    ) {
      setClockInRole("tasco");
    } else if (
      selectedRoleType === "truckDriver" ||
      selectedRoleType === "truckEquipmentOperator" ||
      selectedRoleType === "truckLabor"
    ) {
      setClockInRole("truck");
    } else if (selectedRoleType === "mechanic") {
      setClockInRole("mechanic");
    } else if (selectedRoleType === "general") {
      setClockInRole("general");
    } else {
      setClockInRole(undefined); // Handle undefined or invalid cases
    }
  };

  const saveCurrentData = () => {
    setCommentData({ id: commentsValue }); // Ensure correct data structure
  };

  useEffect(() => {
    setCommentsValue(clockOutComment || "");
  }, [clockOutComment]);

  useEffect(() => {
    setSubmittable(commentsValue.length >= 3);
  }, [commentsValue]);

  if (numberOfRoles === 1) {
    return (
      <Holds background={"white"} className="h-full w-full">
        <Grids rows={"7"} gap={"5"} className="h-full w-full p-3 pb-5">
          <Holds className="row-start-1 row-end-4 h-full w-full justify-center ">
            <Grids rows={"5"} cols={"5"} gap={"3"} className=" h-full w-full">
              <Holds
                className="row-start-1 row-end-2 col-start-1 col-end-2 h-full w-full justify-center"
                onClick={handleReturnPath}
              >
                <Images
                  titleImg="/arrowBack.svg"
                  titleImgAlt="back"
                  position={"left"}
                />
              </Holds>

              <Holds className="row-start-2 row-end-6 col-start-1 col-end-6  h-full w-full justify-center">
                <Holds className="h-full w-[95%] justify-center relative">
                  <Labels size={"p4"} className="text-left">
                    {t("PreviousJobComment")}
                  </Labels>
                  <TextAreas
                    name="comments"
                    value={commentsValue}
                    onChange={(e) => {
                      setCommentsValue(e.target.value);
                    }}
                    placeholder={t("TodayIDidTheFollowing")}
                    className="w-full h-full"
                    maxLength={40}
                    style={{ resize: "none" }}
                  />

                  <Texts
                    size={"p2"}
                    className={`${
                      commentsValue.length === 40
                        ? "text-red-500 absolute bottom-5 right-2"
                        : "absolute bottom-5 right-2"
                    }`}
                  >
                    {commentsValue.length}/40
                  </Texts>
                </Holds>
              </Holds>
            </Grids>
          </Holds>
          <Holds className="row-start-4 row-end-6 h-full w-full justify-center"></Holds>
          <Holds className="row-start-7 row-end-8 h-full w-full justify-center">
            <Buttons
              disabled={!submittable}
              onClick={() => {
                saveCurrentData();
                handleNextStep();
              }}
              background={submittable === false ? "darkGray" : "orange"}
            >
              <Titles size={"h2"}>{t("Continue")}</Titles>
            </Buttons>
          </Holds>
        </Grids>
      </Holds>
    );
  }

  return (
    <Holds background={"white"} className="h-full w-full">
      <Grids rows={"7"} gap={"5"} className="h-full w-full p-3 pb-5">
        <Holds className="row-start-1 row-end-4 h-full w-full justify-center ">
          <Grids rows={"5"} cols={"5"} gap={"3"} className=" h-full w-full">
            <Holds
              className="row-start-1 row-end-2 col-start-1 col-end-2 h-full w-full justify-center"
              onClick={handleReturnPath}
            >
              <Images
                titleImg="/arrowBack.svg"
                titleImgAlt="back"
                position={"left"}
              />
            </Holds>

            <Holds className="row-start-2 row-end-6 col-start-1 col-end-6  h-full w-full justify-center">
              <Holds className="h-full w-[95%] justify-center relative">
                <Labels size={"p4"} className="text-left">
                  {t("PreviousJobComment")}
                </Labels>
                <TextAreas
                  onChange={(e) => {
                    setCommentsValue(e.target.value);
                  }}
                  value={commentsValue}
                  placeholder={t("TodayIDidTheFollowing")}
                  className="w-full h-full"
                  maxLength={40}
                  style={{ resize: "none" }}
                />

                <Texts
                  size={"p2"}
                  className={`${
                    commentsValue.length === 40
                      ? "text-red-500 absolute bottom-5 right-2"
                      : "absolute bottom-5 right-2"
                  }`}
                >
                  {commentsValue.length}/40
                </Texts>
              </Holds>
            </Holds>
          </Grids>
        </Holds>
        <Holds className="row-start-4 row-end-6 h-full w-full justify-center">
          <Grids rows={"3"}>
            <Holds className="row-start-2 row-end-4 h-full w-full justify-center">
              <Titles size={"h1"} className=" ">
                {t("ChangeIfNecessary")}
              </Titles>
              <Holds className=" w-full py-3 justify-center ">
                <Holds className="h-full w-11/12 justify-center">
                  <Selects
                    className="bg-app-blue text-center"
                    value={clockInRoleTypes}
                    onChange={(e) => selectView(e.target.value)}
                  >
                    <option value="">{t("SelectWorkType")}</option>
                    {tascoView === true && (
                      <>
                        <option value="tascoAbcdLabor">
                          {t("TASCOABCDLabor")}
                        </option>
                        <option value="tascoAbcdEquipment">
                          {t("TASCOABCDEquipmentOperator")}
                        </option>
                        <option value="tascoEEquipment">
                          {t("TASCOEEquipmentOperator")}
                        </option>
                      </>
                    )}
                    {truckView === true && (
                      <>
                        <option value="truckDriver">{t("TruckDriver")}</option>
                        {/* <option value="truckEquipmentOperator">
                          {t("TruckEquipmentOperator")}
                        </option>
                        <option value="truckLabor">{t("TruckLabor")}</option> */}
                      </>
                    )}
                    {mechanicView === true && (
                      <option value="mechanic">{t("Mechanic")}</option>
                    )}
                    {laborView === true && (
                      <option value="general">{t("General")}</option>
                    )}
                  </Selects>
                </Holds>
              </Holds>
            </Holds>
          </Grids>
        </Holds>
        <Holds className="row-start-7 row-end-8 h-full w-full justify-center">
          <Buttons
            disabled={!submittable}
            onClick={() => {
              saveCurrentData();
              handleNextStep();
            }}
            background={submittable === false ? "darkGray" : "orange"}
          >
            <Titles size={"h2"}>{t("Continue")}</Titles>
          </Buttons>
        </Holds>
      </Grids>
    </Holds>
  );
}
