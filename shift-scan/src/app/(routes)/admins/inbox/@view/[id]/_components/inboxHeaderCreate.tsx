"use client";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Inputs } from "@/components/(reusable)/inputs";
import { Options } from "@/components/(reusable)/options";
import { Selects } from "@/components/(reusable)/selects";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Texts } from "@/components/(reusable)/texts";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction, useState } from "react";
import { LeaveRequest } from "@/lib/types";
import { set } from "zod";
import { NModals } from "@/components/(reusable)/newmodals";

export function RequestHeaderCreate({
  leaveRequest,
  setLeaveRequest,
  setUserModelOpen,
  userModalOpen,
}: {
  leaveRequest: LeaveRequest;
  setLeaveRequest: Dispatch<SetStateAction<LeaveRequest>>;
  setUserModelOpen: Dispatch<SetStateAction<boolean>>;
  userModalOpen: boolean;
}) {
  const t = useTranslations("Admins");
  const [commentOpened, setCommentOpened] = useState(false);
  return (
    <>
      <Holds
        background={"white"}
        className={`h-full w-full col-span-2 rounded-[10px] row-span-2
        }`}
      >
        <Grids cols={"10"} rows={"3"} className="w-full h-full p-3 ">
          {/* Image for employee*/}
          <Holds className="row-start-1 row-end-4 col-start-1 col-end-3 ">
            <Images
              className={`w-full h-full rounded-full bg-cover bg-center ${
                leaveRequest.employee.image.length > 0
                  ? "border-[3px] border-black"
                  : ""
              }`}
              titleImg={
                leaveRequest.employee.image.length > 0
                  ? leaveRequest.employee.image
                  : "/person.svg"
              }
              titleImgAlt={"Employee Image"}
              size={"60"}
            />
          </Holds>
          {/* Input for employee name*/}
          <Holds
            className="row-start-2 row-end-3 col-start-3 col-end-7 border-[3px] border-black h-full rounded-[10px]"
            onClick={() => setUserModelOpen(true)}
          >
            <Texts
              position={"left"}
              text={"black"}
              size={"p6"}
              className="font-bold"
            >{`${leaveRequest.employee.firstName} ${leaveRequest.employee.lastName}`}</Texts>
          </Holds>
          {/* Date request was submitted*/}
          <Holds className="row-start-3 row-end-4 col-start-3 col-end-6">
            <Texts
              position={"left"}
              text={"black"}
              size={"p6"}
              className="font-bold"
            >{`${t("TodaysDate")}: ${new Date(new Date()).toLocaleString(
              "en-US",
              {
                day: "numeric",
                month: "numeric",
                year: "numeric",
              }
            )}`}</Texts>
          </Holds>

          {/* Request status*/}
          <Holds className="row-start-1 row-end-5 col-start-9 col-end-11">
            <Selects
              name="status"
              value={leaveRequest.status}
              className={`${
                leaveRequest.status === "PENDING"
                  ? "bg-app-orange"
                  : leaveRequest.status === "APPROVED"
                  ? "bg-app-green"
                  : "bg-app-red"
              } w-full h-16 px-5 text-[20px] font-bold`}
            >
              <Options value="APPROVED">{t("Approved")}</Options>
            </Selects>
          </Holds>
        </Grids>
      </Holds>
      <NModals
        size={"medH"}
        background={"default"}
        isOpen={userModalOpen}
        handleClose={() => setUserModelOpen(false)}
      >
        <Holds position={"row"} className="w-full h-full p-3"></Holds>
      </NModals>
    </>
  );
}
