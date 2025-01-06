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

export function RequestHeader({
  leaveRequest,
  setLeaveRequest,
}: {
  leaveRequest: LeaveRequest;
  setLeaveRequest: Dispatch<SetStateAction<LeaveRequest>>;
}) {
  const t = useTranslations("Admins");
  const [commentOpened, setCommentOpened] = useState(false);
  return (
    <Holds
      background={"white"}
      className={`h-full w-full col-span-2 rounded-[10px] ${
        commentOpened ? "row-span-4" : "row-span-2"
      }`}
    >
      {commentOpened ? (
        <Grids cols={"10"} rows={"5"} className="w-full h-full px-3">
          {/* Image for employee*/}
          <Holds className="row-start-1 row-end-3 col-start-1 col-end-3 ">
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
          <Holds className="row-start-1 row-end-3 col-start-3 col-end-7">
            <Inputs
              type={"text"}
              readOnly={true}
              name={"firstName"}
              className=" text-[20px] font-bold h-16 px-5"
              value={
                leaveRequest.employee.firstName +
                " " +
                leaveRequest.employee.lastName
              }
            />
          </Holds>
          {/* Eployee comment*/}
          <Holds className="flex flex-row row-start-3 row-end-4 col-start-9 col-end-11">
            <Holds position={"right"} className="flex flex-row ">
              <Texts text={"black"} size={"p6"} className="font-bold">{`${t(
                "EmployeeComment"
              )}`}</Texts>
              <Images
                className="ml-2 w-full h-full rounded bg-cover bg-center"
                titleImg={"/comment.svg"}
                titleImgAlt={"Employee Image"}
                size={"30"}
                onClick={() => setCommentOpened(!commentOpened)}
              />
            </Holds>
          </Holds>
          <Holds className="row-start-3 row-end-6 col-start-1 col-end-11">
            <TextAreas
              variant={"default"}
              readOnly={true}
              name={"comment"}
              className=" text-[20px] h-full"
              rows={2}
              style={{ resize: "none" }}
              value={
                leaveRequest.comment.length > 0
                  ? leaveRequest.comment
                  : t("NoComment")
              }
              maxLength={40}
            />
          </Holds>
          <Holds className="row-start-1 row-end-3 col-start-9 col-end-11">
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
        // If comment is not opened
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
          <Holds className="row-start-1 row-end-4 col-start-3 col-end-7">
            <Inputs
              type={"text"}
              readOnly={true}
              name={"firstName"}
              className=" text-[20px] font-bold h-16 px-5"
              value={
                leaveRequest.employee.firstName +
                " " +
                leaveRequest.employee.lastName
              }
            />
          </Holds>
          {/* Date request was submitted*/}
          <Holds className="row-start-4 row-end-5 col-start-3 col-end-6">
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
          <Holds className="flex flex-row row-start-4 row-end-5 col-start-9 col-end-11">
            <Holds position={"right"} className="flex flex-row ">
              <Texts text={"black"} size={"p6"} className="font-bold">{`${t(
                "EmployeeComment"
              )}`}</Texts>
              <Images
                className="ml-2 w-full h-full rounded bg-cover bg-center"
                titleImg={"/comment.svg"}
                titleImgAlt={"Employee Image"}
                size={"30"}
                onClick={() => setCommentOpened(!commentOpened)}
              />
            </Holds>
          </Holds>
          {/* Request status*/}
          <Holds className="row-start-1 row-end-4 col-start-9 col-end-11">
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
