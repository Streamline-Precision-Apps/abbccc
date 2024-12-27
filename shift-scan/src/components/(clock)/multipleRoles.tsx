"use client";
import { useSession } from "next-auth/react";
import { Buttons } from "../(reusable)/buttons";
import { Holds } from "../(reusable)/holds";
import { Grids } from "../(reusable)/grids";
import { Titles } from "../(reusable)/titles";
import { useTranslations } from "next-intl";
import { TextAreas } from "../(reusable)/textareas";
import { useCommentData } from "@/app/context/CommentContext";
import { useEffect, useState } from "react";
import { Texts } from "../(reusable)/texts";

type Props = {
  handleNextStep: () => void;
  setClockInRole: React.Dispatch<React.SetStateAction<string>>;
  clockInRole: string;
  option?: string;
  handleReturn?: () => void;
  type: string;
};
export default function MultipleRoles({
  handleNextStep,
  setClockInRole,
  option,
  handleReturn,
  type,
}: Props) {
  const [page, setPage] = useState<string>("switchJobs");
  const t = useTranslations("Clock");
  const { data: session } = useSession();
  const tascoView = session?.user.tascoView;
  const truckView = session?.user.truckView;
  const mechanicView = session?.user.mechanicView;
  const { setCommentData } = useCommentData();
  const [commentsValue, setCommentsValue] = useState("");

  const selectView = (clockInRole: string) => {
    setClockInRole(clockInRole);
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
  };

  if (page === "switchJobs") {
    return (
      <Holds className="h-full w-full">
        <Grids rows={"7"} gap={"5"} className="my-5 h-full w-full">
          <Holds className="row-start-1 row-end-2 h-full w-full justify-center">
            <Titles size={"h3"}>{t("PleaseLeaveACommentOfWhatYouDid")}</Titles>
          </Holds>
          <Holds className="h-full row-span-6">
            <Grids rows={"5"} gap={"2"}>
              <Holds className="row-span-4 h-full w-full items-center relative">
                <TextAreas
                  onChange={(e) => {
                    setCommentsValue(e.target.value);
                  }}
                  placeholder={t("TodayIDidTheFollowing")}
                  className="w-[90%] h-full"
                  maxLength={40}
                  style={{ resize: "none" }}
                />

                <Texts
                  size={"p2"}
                  className={`${
                    commentsValue.length === 40
                      ? "text-red-500 absolute bottom-5 left-2"
                      : "absolute bottom-5 left-[10%]"
                  }`}
                >
                  {commentsValue.length}/40
                </Texts>
              </Holds>

              <Holds className="row-span-1 h-full w-full justify-center">
                <Buttons
                  onClick={() => {
                    switchJobs();
                  }}
                  background={"lightBlue"}
                  className="w-[90%] h-5/6"
                >
                  <Titles size={"h3"}>{t("Submit")}</Titles>
                </Buttons>
              </Holds>
            </Grids>
          </Holds>
        </Grids>
      </Holds>
    );
  } else {
    return (
      <Holds className="h-full w-full">
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
