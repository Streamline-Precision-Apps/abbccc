"use client";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Options } from "@/components/(reusable)/options";
import { Selects } from "@/components/(reusable)/selects";
import { Texts } from "@/components/(reusable)/texts";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction } from "react";
import { LeaveRequest } from "@/lib/types";
import { NModals } from "@/components/(reusable)/newmodals";
import { Inputs } from "@/components/(reusable)/inputs";

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
            position={"row"}
            className="row-start-2 row-end-3 col-start-3 col-end-7 h-full border-[3px] border-black rounded-[10px]"
          >
            <Grids cols={"5"} rows={"1"} gap={"2"} className="w-full h-full">
              <Holds className="w-full h-full col-span-1">
                <Images
                  className="w-full h-full rounded-full bg-cover bg-center"
                  titleImg={"/magnifyingGlass.svg"}
                  titleImgAlt={"Employee Image"}
                  size={"50"}
                />
              </Holds>
              <Inputs
                type="text"
                placeholder={t("SelectEmployee")}
                value={
                  leaveRequest.employee.firstName &&
                  leaveRequest.employee.lastName
                    ? `${leaveRequest.employee.firstName} ${leaveRequest.employee.lastName}`
                    : ""
                }
                readOnly={true}
                className="w-full h-full text-[22px] font-bold text-black border-none col-span-3 focus-visible:outline-none"
                onClick={() => setUserModelOpen(true)}
              />
              <Holds className="w-full h-full col-span-1">
                <Images
                  className="w-full h-full rounded-full bg-cover bg-center"
                  titleImg={"/x.svg"}
                  titleImgAlt={"Employee Image"}
                  size={"50"}
                  onClick={() => {
                    console.log("click");
                    setLeaveRequest({
                      ...leaveRequest,
                      employee: {
                        ...leaveRequest.employee,
                        firstName: "",
                        lastName: "",
                        image: "",
                      },
                    });
                  }}
                />
              </Holds>
            </Grids>
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
              <Options value="PENDING">{t("Pending")}</Options>
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
