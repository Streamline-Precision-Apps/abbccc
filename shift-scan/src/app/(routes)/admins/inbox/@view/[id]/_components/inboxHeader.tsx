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
import { Labels } from "@/components/(reusable)/labels";

export function RequestHeader({
  initialLeaveRequest,
  leaveRequest,
  setLeaveRequest,
}: {
  initialLeaveRequest: LeaveRequest;
  leaveRequest: LeaveRequest;
  setLeaveRequest: Dispatch<SetStateAction<LeaveRequest>>;
}) {
  const t = useTranslations("Admins");
  const [commentOpened, setCommentOpened] = useState(false);

  return (
    <Holds
      background={"white"}
      className={`h-full w-full col-span-2 rounded-[10px] ${
        commentOpened ? "row-span-3" : "row-span-2"
      }`}
    >
      {commentOpened ? (
        /* ============================================================================================================================================*/

        /* =================================================   ** If comment is Opened  **     =======================================================*/

        /* ==========================================================================================================================================*/
        <Grids cols={"10"} rows={"3"} gap={"5"} className="w-full h-full p-3">
          {/* Image for employee*/}
          <Holds className="row-start-1 row-end-2 col-start-1 col-end-2 h-full w-full">
            <Images
              className={`w-full rounded-full  ${
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
            />
          </Holds>
          {/* Input for employee name*/}
          <Holds className="row-start-1 row-end-2 col-start-2 col-end-6 h-full w-full">
            <Inputs
              type={"text"}
              readOnly={true}
              name={"firstName"}
              className="font-bold pl-5 h-full text-[20px]"
              value={
                leaveRequest.employee.firstName +
                " " +
                leaveRequest.employee.lastName
              }
            />
          </Holds>

          {/* Date request was submitted*/}
          <Holds className="row-start-1 row-end-2 col-start-6 col-end-9">
            <Texts
              position={"left"}
              text={"black"}
              size={"p6"}
              className="font-bold"
            >{`${t("DateCreated")}: ${new Date(
              leaveRequest.createdAt
            ).toLocaleString("en-US", {
              day: "numeric",
              month: "numeric",
              year: "numeric",
            })}`}</Texts>
          </Holds>
          <Holds className="row-start-2 row-end-4 col-start-1 col-end-11 h-full">
            {initialLeaveRequest.status === "PENDING" ? (
              <>
                <Holds position={"row"}>
                  <Labels
                    size={"p4"}
                    htmlFor="comment"
                    className="flex flex-row w-full"
                  >
                    {t("EmployeeComment")}
                    <Holds className="w-[20%] h-full">
                      <Images
                        className="ml-2 w-full h-full rounded bg-cover bg-center"
                        titleImg={"/comment.svg"}
                        titleImgAlt={"Employee Image"}
                        onClick={() => setCommentOpened(!commentOpened)}
                      />
                    </Holds>
                  </Labels>
                </Holds>
                {/* Employee comment*/}
                <TextAreas
                  variant={"default"}
                  readOnly={true}
                  name={"comment"}
                  className=" text-[20px] h-full"
                  style={{ resize: "none" }}
                  value={
                    leaveRequest.comment.length > 0
                      ? leaveRequest.comment
                      : t("NoComment")
                  }
                  maxLength={40}
                />
              </>
            ) : (
              <>
                <Holds position={"row"}>
                  <Labels
                    size={"p4"}
                    htmlFor="managerComment"
                    className="flex flex-row"
                  >
                    {t("MangerComment")}
                    <Holds className="w-[25%] h-full">
                      <Images
                        className="ml-2 w-full h-full rounded bg-cover bg-center"
                        titleImg={"/comment.svg"}
                        titleImgAlt={"Employee Image"}
                        onClick={() => setCommentOpened(!commentOpened)}
                      />
                    </Holds>
                  </Labels>
                </Holds>
                {/* Manager comment*/}
                <TextAreas
                  variant={"default"}
                  readOnly={true}
                  name={"managerComment"}
                  className=" text-[20px] h-full"
                  style={{ resize: "none" }}
                  value={
                    leaveRequest.managerComment.length > 0
                      ? leaveRequest.managerComment
                      : t("NoComment")
                  }
                  maxLength={40}
                />
              </>
            )}
          </Holds>
          <Holds className="row-start-1 row-end-2 col-start-9 col-end-11">
            <Selects
              name="status"
              value={leaveRequest.status}
              onChange={(e) => {
                setLeaveRequest((prevLeaveRequest) => ({
                  ...prevLeaveRequest,
                  status: e.target.value,
                }));
              }}
              className={`${
                leaveRequest.status === "PENDING"
                  ? "bg-app-orange"
                  : leaveRequest.status === "APPROVED"
                  ? "bg-app-green"
                  : "bg-app-red"
              } w-full h-16 px-5 text-[20px] font-bold`}
            >
              <Options value="PENDING">{t("Pending")}</Options>
              <Options value="APPROVED">{t("Approved")}</Options>
              <Options value="DENIED">{t("Denied")}</Options>
            </Selects>
          </Holds>
        </Grids>
      ) : (
        /* ============================================================================================================================================*/

        /* ==================================================   ** If comment is closed  **     =======================================================*/

        /* ==========================================================================================================================================*/
        <Grids cols={"10"} rows={"3"} className="w-full h-full p-3">
          {/* Image for employee*/}
          <Holds className="row-start-1 row-end-4 col-start-1 col-end-3 h-full w-full">
            <Images
              className={`w-full  rounded-full bg-cover bg-center ${
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
            />
          </Holds>
          {/* Input for employee name*/}
          <Holds className="row-start-1 row-end-3 col-start-3 col-end-7 h-full w-full py-2">
            <Inputs
              type={"text"}
              readOnly={true}
              name={"firstName"}
              className=" text-[24px] font-bold pl-5 h-full w-full"
              value={
                leaveRequest.employee.firstName +
                " " +
                leaveRequest.employee.lastName
              }
            />
          </Holds>
          {/* Date request was submitted*/}
          <Holds className="row-start-3 row-end-4 col-start-3 col-end-6 h-full w-full justify-end">
            <Texts
              position={"left"}
              text={"black"}
              size={"p6"}
              className="font-bold"
            >{`${t("DateCreated")}: ${new Date(
              leaveRequest.createdAt
            ).toLocaleString("en-US", {
              day: "numeric",
              month: "numeric",
              year: "numeric",
            })}`}</Texts>
          </Holds>
          {/* Date request was submitted*/}
          <Holds className="flex flex-row row-start-3 row-end-4 col-start-7 col-end-11 h-full w-full">
            <Holds position={"right"} className="flex flex-row ">
              <Holds className="w-[90%] h-full">
                {initialLeaveRequest.status === "PENDING" ? (
                  <>
                    {/* Employee comment*/}
                    <Texts
                      text={"black"}
                      position={"right"}
                      size={"p6"}
                      className="font-bold"
                    >{`${t("EmployeeComment")}`}</Texts>
                  </>
                ) : (
                  <>
                    {/* Manager comment*/}
                    <Texts
                      text={"black"}
                      position={"right"}
                      size={"p6"}
                      className="font-bold"
                    >{`${t("MangerComment")}`}</Texts>
                  </>
                )}
              </Holds>
              <Holds className="w-[10%]">
                <Images
                  className="ml-2 w-full h-full rounded bg-cover bg-center"
                  titleImg={"/comment.svg"}
                  titleImgAlt={"Employee Image"}
                  onClick={() => setCommentOpened(!commentOpened)}
                />
              </Holds>
            </Holds>
          </Holds>
          {/* Request status*/}
          <Holds className="row-start-1 row-end-3 col-start-9 col-end-11 ">
            <Selects
              name="status"
              value={leaveRequest.status}
              onChange={(e) => {
                setLeaveRequest((prevLeaveRequest) => ({
                  ...prevLeaveRequest,
                  status: e.target.value,
                }));
              }}
              className={`${
                leaveRequest.status === "PENDING"
                  ? "bg-app-orange"
                  : leaveRequest.status === "APPROVED"
                  ? "bg-app-green"
                  : "bg-app-red"
              } w-full h-16 px-5 text-[20px] font-bold`}
            >
              <Options value="PENDING">{t("Pending")}</Options>
              <Options value="APPROVED">{t("Approved")}</Options>
              <Options value="DENIED">{t("Denied")}</Options>
            </Selects>
          </Holds>
        </Grids>
      )}
    </Holds>
  );
}
