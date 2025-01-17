"use client";
import { useSession } from "next-auth/react";
import { Buttons } from "../(reusable)/buttons";
import { Holds } from "../(reusable)/holds";
import { Grids } from "../(reusable)/grids";
import { Titles } from "../(reusable)/titles";
import { useTranslations } from "next-intl";
import { useCommentData } from "@/app/context/CommentContext";
import { useEffect, useState } from "react";
import Comment from "@/components/(clock)/comment";
import { Images } from "../(reusable)/images";
import { setWorkRole } from "@/actions/cookieActions";

type Props = {
  handleNextStep: () => void;
  setClockInRole: React.Dispatch<React.SetStateAction<string>>;
  clockInRole: string;
  option?: string;
  handleReturn?: () => void;
  handleReturnPath: () => void;
  type: string;
};
export default function MultipleRoles({
  handleNextStep,
  setClockInRole,
  clockInRole,
  option,
  handleReturn,
  handleReturnPath,
  type,
}: Props) {
  const [page, setPage] = useState<string>("switchJobs");
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
    setWorkRole(clockInRole);
    localStorage.setItem("clockInRole", clockInRole);
    handleNextStep();
  };

  useEffect(() => {
    if (type === "switchJobs") {
      setPage("switchJobs");
    } else {
      setPage("");
    }
  }, [type]);

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
      <Holds className="h-full w-full relative">
        <Holds
          className="absolute top-5 left-5 w-10"
          onClick={handleReturnPath}
        >
          <Images
            titleImg="/turnBack.svg"
            titleImgAlt="back"
            position={"left"}
            size={"full"}
          />
        </Holds>
        <Grids rows={"7"} gap={"5"} className="my-5 h-full w-full">
          <Holds className="row-start-1 row-end-3 h-full w-full justify-center">
            <Titles size={"h3"}>{t("PleaseChooseYourRole")}</Titles>
          </Holds>
          {tascoView === true && (
            <Holds className="h-full row-span-1">
              <Buttons
                onClick={() => {
                  selectView("tasco");
                }}
                background={"lightBlue"}
                className="w-5/6"
              >
                <Titles size={"h3"}>{t("TASCO")}</Titles>
              </Buttons>
            </Holds>
          )}
          {truckView === true && (
            <Holds className="h-full row-span-1">
              <Buttons
                onClick={() => {
                  selectView("truck");
                }}
                background={"lightBlue"}
                className="w-5/6"
              >
                <Titles size={"h3"}>{t("Truck")}</Titles>
              </Buttons>
            </Holds>
          )}
          {mechanicView === true && (
            <Holds className="h-full row-span-1">
              <Buttons
                onClick={() => {
                  selectView("mechanic");
                }}
                background={"lightBlue"}
                className="w-5/6"
              >
                <Titles size={"h3"}>{t("Mechanic")}</Titles>
              </Buttons>
            </Holds>
          )}
          {laborView === true && (
            <Holds className="h-full row-span-1">
              <Buttons
                onClick={() => {
                  selectView("general");
                }}
                background={"lightBlue"}
                className="w-5/6"
              >
                <Titles size={"h3"}>{t("General")}</Titles>
              </Buttons>
            </Holds>
          )}
          {option === "break" ? (
            <Holds className="h-full row-span-1">
              <Buttons
                onClick={handleReturn}
                background={"red"}
                className="w-5/6"
              >
                <Titles size={"h5"}>{t("ReturnToJobsite")}</Titles>
              </Buttons>
            </Holds>
          ) : null}
        </Grids>
      </Holds>
    );
  }
}
