"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Selects } from "@/components/(reusable)/selects";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Texts } from "@/components/(reusable)/texts";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction } from "react";
import { LeaveRequest } from "@/lib/types";

export function RequestMain({
  leaveRequest,
  setLeaveRequest,
  isSignatureShowing,
  setIsSignatureShowing,
  signature,
}: {
  leaveRequest: LeaveRequest;
  setLeaveRequest: Dispatch<SetStateAction<LeaveRequest>>;
  isSignatureShowing: boolean;
  setIsSignatureShowing: Dispatch<SetStateAction<boolean>>;
  signature: string;
}) {
  const t = useTranslations("Admins");

  return (
    <Holds background={"white"} className="w-full h-full p-3">
      <Grids rows={"5"} cols={"5"} gap={"5"} className="w-full h-full px-3">
        <Holds className="row-start-1 row-end-2 col-start-1 col-end-2 h-full ">
          {/* Optional Title Input */}
          <Labels size={"p4"} htmlFor="title">
            {t("TitleOptional")}
          </Labels>
          <Inputs
            type="text"
            id="title"
            disabled
            value={leaveRequest.name}
            onChange={(e) => {
              setLeaveRequest((prevLeaveRequest) => ({
                ...prevLeaveRequest,
                name: e.target.value,
              }));
            }}
          />
        </Holds>
        <Holds className="row-start-1 row-end-2 col-start-2 col-end-3 h-full ">
          <Labels size={"p4"} htmlFor="requestType">
            {t("RequestType")}
          </Labels>
          <Selects
            id="requestType"
            value={leaveRequest.requestType}
            disabled
            onChange={(e) => {
              setLeaveRequest((prevLeaveRequest) => ({
                ...prevLeaveRequest,
                requestType: e.target.value,
              }));
            }}
          >
            <option value="PAID_VACATION">{t("PaidVacation")}</option>
            <option value="SICK">{t("Sick")}</option>
            <option value="MILITARY">{t("Military")}</option>
            <option value="FAMILY_MEDICAL">{t("FamilyMedical")}</option>
            <option value="NON_PAID_PERSONAL">{t("NonPaidPersonal")}</option>
          </Selects>
        </Holds>
        <Holds className="row-start-1 row-end-2 col-start-3 col-end-4 h-full ">
          <Labels size={"p4"} htmlFor="startDate">
            {t("StartDate")}
          </Labels>
          <Inputs
            type="date"
            id="startDate"
            disabled
            value={leaveRequest.requestedStartDate.slice(0, 10)}
            onChange={(e) => {
              setLeaveRequest((prevLeaveRequest) => ({
                ...prevLeaveRequest,
                requestedStartDate: e.target.value,
              }));
            }}
          />
        </Holds>
        <Holds className="row-start-1 row-end-2 col-start-4 col-end-5 h-full ">
          <Labels size={"p4"} htmlFor="endDate">
            {t("EndDate")}
          </Labels>
          <Inputs
            type="date"
            id="endDate"
            disabled
            value={leaveRequest.requestedEndDate.slice(0, 10)}
            onChange={(e) => {
              setLeaveRequest((prevLeaveRequest) => ({
                ...prevLeaveRequest,
                requestedEndDate: e.target.value,
              }));
            }}
          />
        </Holds>
        <Holds className="row-start-1 row-end-2 col-start-5 col-end-6 h-full ">
          <Labels size={"p4"} htmlFor="decidedBy">
            {t("DecidedBy")}
          </Labels>
          <Inputs
            type="text"
            id="decidedBy"
            disabled
            value={leaveRequest.decidedBy || ""}
            onChange={(e) => {
              setLeaveRequest((prevLeaveRequest) => ({
                ...prevLeaveRequest,
                requestedEndDate: e.target.value,
              }));
            }}
          />
        </Holds>
        <Holds className="row-start-2 row-end-5 col-span-5 h-full w-full">
          <Grids cols={"5"} gap={"5"}>
            <Holds className="col-span-4 h-full ">
              <Labels size={"p4"} htmlFor="comment">
                {t("MangerComment")}
              </Labels>
              <TextAreas
                maxLength={40}
                value={leaveRequest.managerComment || ""}
                onChange={(e) =>
                  setLeaveRequest((prevLeaveRequest) => ({
                    ...prevLeaveRequest,
                    managerComment: e.target.value,
                  }))
                }
                className="w-full h-full"
                style={{ resize: "none" }}
              />
            </Holds>
            <Holds className="col-span-1 h-full">
              {isSignatureShowing || leaveRequest.signature ? (
                signature ? (
                  <>
                    <Labels size={"p4"}>{t("Signature")}</Labels>
                    <Holds className="w-full h-full items-center justify-center border-2 border-black rounded-[10px] ">
                      <Images
                        className="w-20 h-20 rounded-full bg-cover bg-center"
                        titleImg={signature}
                        titleImgAlt={"signature"}
                      />
                    </Holds>
                  </>
                ) : (
                  <Holds className="w-full h-full items-center justify-center border-2 border-black rounded-[10px] ">
                    <Texts className="text-center" size={"p4"}>
                      {t("NoSignatureFound")}
                    </Texts>
                  </Holds>
                )
              ) : (
                <>
                  <Labels size={"p4"}>{t("Signature")}</Labels>
                  <Holds className="h-full w-full items-center justify-center ">
                    <Buttons
                      onClick={() => {
                        setIsSignatureShowing(true);
                      }}
                      className="h1/2"
                    >
                      {t("ClickToSign")}
                    </Buttons>
                  </Holds>
                </>
              )}
            </Holds>
          </Grids>
        </Holds>
      </Grids>
    </Holds>
  );
}
