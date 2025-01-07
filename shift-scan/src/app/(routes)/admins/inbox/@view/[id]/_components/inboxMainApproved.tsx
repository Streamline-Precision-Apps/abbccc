"use client";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Selects } from "@/components/(reusable)/selects";
import { TextAreas } from "@/components/(reusable)/textareas";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction } from "react";
import { LeaveRequest } from "@/lib/types";

export function RequestMainApproved({
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
        <Holds className="row-start-1 row-end-2 col-start-1 col-end-2 h-full ">
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
        <Holds className="row-start-1 row-end-2 col-start-2 col-end-3 h-full ">
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
        <Holds className="row-start-1 row-end-2 col-start-3 col-end-4 h-full ">
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
        <Holds className="row-start-1 row-end-2 col-start-4 col-end-5 h-full ">
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

        <Holds className="row-start-2 row-end-6 col-span-4 h-full w-full">
          <Grids cols={"1"}>
            <Holds className="col-start-1 col-end-2 h-full ">
              <Labels size={"p4"} htmlFor="comment">
                {t("EmployeeComment")}
              </Labels>
              <TextAreas
                rows={6}
                maxLength={40}
                value={leaveRequest.comment || ""}
                disabled
                style={{ resize: "none" }}
              />
            </Holds>
          </Grids>
        </Holds>
      </Grids>
    </Holds>
  );
}
