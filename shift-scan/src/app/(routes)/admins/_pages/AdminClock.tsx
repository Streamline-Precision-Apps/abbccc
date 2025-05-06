"use client";
// import { useSavedCostCode } from "@/app/context/CostCodeContext";
// import { useScanData } from "@/app/context/JobSiteScanDataContext";
import { CreateTimeSheet } from "@/actions/timeSheetActions";
import { setAuthStep } from "@/app/api/auth";
import { useSavedCostCode } from "@/app/context/CostCodeContext";
import { useScanData } from "@/app/context/JobSiteScanDataContext";
import { useNotification } from "@/app/context/NotificationContext";
import { useTimeSheetData } from "@/app/context/TimeSheetIdContext";

import { Buttons } from "@/components/(reusable)/buttons";
import { Forms } from "@/components/(reusable)/forms";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import CodeFinder from "@/components/(search)/codeFinder";

import { Clock } from "@/components/clock";
import { useSession } from "next-auth/react";
import { SetStateAction, useEffect, useState } from "react";

export default function AdminClock({
  handleClose,
}: {
  handleClose: () => void;
}) {
  const { scanResult } = useScanData();
  const { savedCostCode } = useSavedCostCode();
  const { setTimeSheetData } = useTimeSheetData();
  const { setNotification } = useNotification();
  const date = new Date();
  const [J, setJ] = useState("");
  const [CC, setCc] = useState("");

  useEffect(() => {
    const jobsite = localStorage.getItem("jobSite");
    const costcode = localStorage.getItem("costCode");
    if (jobsite !== null && costcode !== null) {
      setJ(jobsite);
      setCc(costcode);
    }
  }, []);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append("jobsiteId", scanResult?.qrCode || J || "");
    formData.append("costcode", savedCostCode?.toString() || CC || "");
    formData.append("workType", "general");

    const response = await CreateTimeSheet(formData);
    if (response) {
      setAuthStep("success");
      const result = { id: response.id.toString() };
      setTimeSheetData(result);
      if (response.id !== null) {
        setNotification("Your Clock In was successful", "success");
      }
    } else {
      setNotification("Your Clock In Failed", "error");
    }
    handleClose();
  };
  const { data: session } = useSession();
  if (!session) return null;
  const { id } = session.user;
  return (
    <Holds className=" ">
      <Holds position={"row"}>
        <Holds>
          <CodeFinder
            datatype="jobsite"
            setSelectedOpt={() => {}}
            setScannedId={undefined}
          />
        </Holds>
        <Holds>
          <CodeFinder
            datatype="costcode"
            setSelectedOpt={() => {}}
            setScannedId={undefined}
          />
        </Holds>
      </Holds>
      <Holds>
        <Forms onSubmit={handleSubmit}>
          <Buttons type="submit" className="bg-app-green">
            <Clock time={date.getTime()} />
          </Buttons>
          <Inputs
            type="hidden"
            name="submitDate"
            value={new Date().toISOString()}
          />
          <Inputs type="hidden" name="userId" value={id} />
          <Inputs type="hidden" name="date" value={new Date().toISOString()} />

          <Inputs
            type="hidden"
            name="startTime"
            value={new Date().toISOString()}
          />
        </Forms>
      </Holds>
    </Holds>
  );
}
