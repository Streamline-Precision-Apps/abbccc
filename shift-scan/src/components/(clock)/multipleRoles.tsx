"use client";
import { useSession } from "next-auth/react";
import { Buttons } from "../(reusable)/buttons";
import { Holds } from "../(reusable)/holds";
import { Grids } from "../(reusable)/grids";
import { Titles } from "../(reusable)/titles";
import { useTranslations } from "next-intl";
import { useCommentData } from "@/app/context/CommentContext";
import { use, useEffect, useState } from "react";
import Comment from "@/components/(clock)/comment";
import { Images } from "../(reusable)/images";
import { Selects } from "../(reusable)/selects";
import { Contents } from "../(reusable)/contents";
import { select } from "@nextui-org/theme";

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
export default function MultipleRoles({
  handleNextStep,
  setClockInRole,
  clockInRole,
  option,
  handleReturn,
  handleReturnPath,
  type,
  numberOfRoles,
}: Props) {
  const [page, setPage] = useState("");
  const t = useTranslations("Clock");
  const { data: session } = useSession();
  const tascoView = session?.user.tascoView;
  const truckView = session?.user.truckView;
  const mechanicView = session?.user.mechanicView;
  const laborView = session?.user.laborView;
  const { setCommentData } = useCommentData();
  const [commentsValue, setCommentsValue] = useState("");

  const selectView = (clockInRole: string) => {
    setClockInRole(clockInRole);
    handleNextStep();
  };

  const switchJobs = () => {
    setCommentData({ id: commentsValue }); // Ensure correct data structure
    setPage("");
    if (clockInRole !== "") {
      handleNextStep();
    }
  };

  if (page === "switchJobs") {
    return (
      <Comment
        handleClick={switchJobs}
        clockInRole={clockInRole}
        setCommentsValue={setCommentsValue}
        commentsValue={commentsValue}
      />
    );
  } else {
    return (
      <Holds background={"white"} className="h-full w-full">
        <Contents width={"section"} className="h-full py-5">
          <Grids rows={"8"} gap={"5"} className="h-full w-full">
            <Holds className="row-start-1 row-end-2 h-full w-full justify-center ">
              <Grids rows={"2"} cols={"5"} gap={"3"} className=" h-full w-full">
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
                <Holds className="row-start-2 row-end-3 col-span-5 h-full w-full justify-center">
                  <Titles size={"h1"}> {t("ScanJobSite")}</Titles>
                </Holds>
              </Grids>
            </Holds>
            {numberOfRoles > 1 && (
              <Holds className="p-1 justify-center border-[3px] border-black rounded-[10px] shadow-[6px_6px_0px_grey]">
                <Selects
                  className="bg-app-blue text-center p-3"
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
            )}
            <Holds
              className={
                "h-full w-full row-start-3 row-end-7 border-[3px] border-black rounded-[10px] p-3 "
              }
            >
              <Holds className="h-full w-full justify-center border-[3px] border-black rounded-[10px]">
                <Images
                  titleImg="/camera.svg"
                  titleImgAlt="clockIn"
                  position={"center"}
                  size={"40"}
                />
              </Holds>
            </Holds>
            {numberOfRoles >= 1 && option !== "break" && (
              <Holds className="row-start-8 row-end-9 h-full w-full justify-center">
                <Buttons
                  onClick={handleNextStep}
                  disabled
                  background={"darkGray"}
                >
                  <Titles size={"h2"}>{t("StartCamera")}</Titles>
                </Buttons>
              </Holds>
            )}
            {numberOfRoles === 1 && (
              <Holds className="row-start-7 row-end-8 h-full w-full justify-center">
                <Buttons onClick={handleNextStep} background={"green"}>
                  <Titles size={"h2"}>{t("ScanJobsite")}</Titles>
                </Buttons>
              </Holds>
            )}
            {option === "break" ? (
              <Holds className="row-start-8 row-end-9 h-full w-full justify-center">
                <Buttons onClick={handleReturn} background={"orange"}>
                  <Titles size={"h2"}>{t("ReturnToPrevShift")}</Titles>
                </Buttons>
              </Holds>
            ) : null}
          </Grids>
        </Contents>
      </Holds>
    );
  }
}
