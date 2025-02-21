"use client";
import {
  CreateTimeSheet,
  updateTimeSheetBySwitch,
} from "@/actions/timeSheetActions";
import { setAuthStep } from "@/app/api/auth";
import { useSavedCostCode } from "@/app/context/CostCodeContext";
import { useScanData } from "@/app/context/JobSiteScanDataContext";
import { useTimeSheetData } from "@/app/context/TimeSheetIdContext";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Forms } from "@/components/(reusable)/forms";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import CodeFinder from "@/components/(search)/codeFinder";

import { Clock } from "@/components/clock";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function AdminSwitch({
  handleClose,
}: {
  handleClose: () => void;
}) {
  const { scanResult } = useScanData();
  const { savedCostCode } = useSavedCostCode();
  const { setTimeSheetData } = useTimeSheetData();
  const date = new Date();
  const [j, setJ] = useState("");
  const [cc, setCc] = useState("");

  useEffect(() => {
    const jobsite = localStorage.getItem("jobSite");
    const costcode = localStorage.getItem("costCode");
    if (jobsite !== null && costcode !== null) {
      setJ(jobsite);
      setCc(costcode);
    }
  }, []);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      // the endind of the job begins on an error it cancels the action
      console.log("Switch jobs starts");

      const localeValue = localStorage.getItem("savedtimeSheetData");
      const tId = JSON.parse(localeValue || "{}").id;
      const formData2 = new FormData();
      formData2.append("id", tId?.toString() || "");
      formData2.append("endTime", new Date().toISOString());
      formData2.append("timesheetComments", "");
      formData2.append("appComment", "Switched jobs");

      await updateTimeSheetBySwitch(formData2);

      const formData = new FormData();
      formData.append("submitDate", new Date().toISOString());
      formData.append("userId", id?.toString() || "");
      formData.append("date", new Date().toISOString());
      formData.append("jobsiteId", scanResult?.data || j || "");
      formData.append("costcode", savedCostCode?.toString() || cc || "");
      formData.append("startTime", new Date().toISOString());
      formData.append("endTime", "");

      const response = await CreateTimeSheet(formData);
      const result = { id: response.id.toString() };
      setTimeSheetData(result);
      setAuthStep("success");
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };
  const { data: session } = useSession();
  if (!session) return null;
  const { id } = session.user;
  return (
    <Holds className="w-full h-full">
      <Contents width={"section"}>
        <Grids cols={"2"} gap={"5"}>
          <Holds className="col-span-1 overflow-y-hidden h-[300px]">
            <CodeFinder
              datatype={"jobsite"}
              setSelectedOpt={() => {}}
              setScannedId={undefined}
            />
          </Holds>
          <Holds className=" col-span-1 overflow-y-hidden h-[300px] ">
            <CodeFinder
              datatype="costcode"
              setSelectedOpt={() => {}}
              setScannedId={undefined}
            />
          </Holds>

          <Holds className="col-span-2">
            <Forms onSubmit={handleSubmit}>
              <Buttons type="submit" className="bg-app-orange">
                <Clock time={date.getTime()} />
              </Buttons>
              <Inputs
                type="hidden"
                name="submitDate"
                value={new Date().toISOString()}
              />
              <Inputs type="hidden" name="userId" value={id} />
              <Inputs
                type="hidden"
                name="date"
                value={new Date().toISOString()}
              />

              <Inputs
                type="hidden"
                name="startTime"
                value={new Date().toISOString()}
              />
            </Forms>
          </Holds>
        </Grids>
      </Contents>
    </Holds>
  );
}
