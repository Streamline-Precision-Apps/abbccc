"use client";
import { useSession } from "next-auth/react";
import { Buttons } from "../(reusable)/buttons";
import { Holds } from "../(reusable)/holds";
import { Grids } from "../(reusable)/grids";
import { Titles } from "../(reusable)/titles";
import { useTranslations } from "next-intl";
import { useCommentData } from "@/app/context/CommentContext";
import { useEffect, useState } from "react";
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
};

export default function SwitchJobsMultiRoles({
  handleNextStep,
  setClockInRole,
  clockInRole,
  handleReturnPath,
  numberOfRoles,
}: Props) {
  const t = useTranslations("Clock");
  const { data: session } = useSession();
  const tascoView = session?.user.tascoView;
  const truckView = session?.user.truckView;
  const mechanicView = session?.user.mechanicView;
  const laborView = session?.user.laborView;
  const { setCommentData } = useCommentData();
  const [commentsValue, setCommentsValue] = useState<string>("");
  const [submittable, setSubmittable] = useState<boolean>(false);

  const selectView = (selectedRole: string) => {
    setClockInRole(selectedRole); // Updates state
  };

  const saveCurrentData = () => {
    setCommentData({ id: commentsValue }); // Ensure correct data structure
  };

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
                  titleImg="/turnBack.svg"
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
              background={submittable === false ? "grey" : "orange"}
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
                titleImg="/turnBack.svg"
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
              <Holds className=" w-full py-3 justify-center border-[3px] border-black rounded-[10px] shadow-[6px_6px_0px_grey]">
                <Holds className="h-full w-11/12 justify-center">
                  <Selects
                    className="bg-app-blue text-center"
                    value={clockInRole}
                    onChange={(e) => selectView(e.target.value)}
                  >
                    <option value="">{t("SelectWorkType")}</option>
                    {tascoView === true && (
                      <option value="tasco">{t("TASCO")}</option>
                    )}
                    {truckView === true && (
                      <option value="truck">{t("Truck")}</option>
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
            background={submittable === false ? "grey" : "orange"}
          >
            <Titles size={"h2"}>{t("Continue")}</Titles>
          </Buttons>
        </Holds>
      </Grids>
    </Holds>
  );
}
