"use client";

import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";

import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Selects } from "@/components/(reusable)/selects";
import { TextAreas } from "@/components/(reusable)/textareas";

import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction } from "react";
import { LeaveRequest } from "@/lib/types";

export function RequestMainCreate({
  leaveRequest,
  setLeaveRequest,
}: {
  leaveRequest: LeaveRequest;
  setLeaveRequest: Dispatch<SetStateAction<LeaveRequest>>;
}) {
  const t = useTranslations("Admins");

  return (
    <Holds background={"white"} className="w-full h-full p-3">
      <Grids rows={"5"} cols={"4"} gap={"5"} className="w-full h-full px-3">
        <Holds>
          {/* Optional Title Input */}
          <Labels size={"p4"} htmlFor="title">
            {t("TitleOptional")}
          </Labels>
          <Inputs
            type="text"
            id="title"
            value={leaveRequest.name}
            onChange={(e) => {
              setLeaveRequest((prevLeaveRequest) => ({
                ...prevLeaveRequest,
                name: e.target.value,
              }));
            }}
          />
        </Holds>
        <Holds>
          <Labels size={"p4"} htmlFor="requestType">
            {t("RequestType")}
          </Labels>
          <Selects
            id="requestType"
            value={leaveRequest.requestType}
            onChange={(e) => {
              setLeaveRequest((prevLeaveRequest) => ({
                ...prevLeaveRequest,
                requestType: e.target.value,
              }));
            }}
          >
            <option value="">{t("SelectRequestType")}</option>
            <option value="PAID_VACATION">{t("PaidVacation")}</option>
            <option value="SICK">{t("Sick")}</option>
            <option value="MILITARY">{t("Military")}</option>
            <option value="FAMILY_MEDICAL">{t("FamilyMedical")}</option>
            <option value="NON_PAID_PERSONAL">{t("NonPaidPersonal")}</option>
          </Selects>
        </Holds>
        <Holds>
          <Labels size={"p4"} htmlFor="startDate">
            {t("StartDate")}
          </Labels>
          <Inputs
            type="date"
            id="startDate"
            value={leaveRequest.requestedStartDate.slice(0, 10)}
            onChange={(e) => {
              setLeaveRequest((prevLeaveRequest) => ({
                ...prevLeaveRequest,
                requestedStartDate: e.target.value,
              }));
            }}
          />
        </Holds>
        <Holds>
          <Labels size={"p4"} htmlFor="endDate">
            {t("EndDate")}
          </Labels>
          <Inputs
            type="date"
            id="endDate"
            value={leaveRequest.requestedEndDate.slice(0, 10)}
            onChange={(e) => {
              setLeaveRequest((prevLeaveRequest) => ({
                ...prevLeaveRequest,
                requestedEndDate: e.target.value,
              }));
            }}
          />
        </Holds>
        <Holds className="row-start-2 row-end-5 col-span-4 h-full w-full">
          <Grids cols={"5"} gap={"5"}>
            <Holds className="col-span-5 h-full ">
              <Labels size={"p4"} htmlFor="comment">
                {t("Comment")}
              </Labels>
              <TextAreas
                rows={5}
                maxLength={40}
                value={leaveRequest.comment || ""}
                onChange={(e) =>
                  setLeaveRequest((prevLeaveRequest) => ({
                    ...prevLeaveRequest,
                    comment: e.target.value,
                  }))
                }
                style={{ resize: "none" }}
              />
            </Holds>
          </Grids>
        </Holds>
      </Grids>
    </Holds>
  );
}
