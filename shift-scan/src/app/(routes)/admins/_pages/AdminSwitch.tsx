"use client";
import { CreateTimeSheet } from "@/actions/timeSheetActions";
import useFetchAllData from "@/app/(content)/FetchData";
import { setAuthStep } from "@/app/api/auth";
import { useSavedCostCode } from "@/app/context/CostCodeContext";
import { useScanData } from "@/app/context/JobSiteScanDataContext";
import { useTimeSheetData } from "@/app/context/TimeSheetIdContext";
import CodeStep from "@/components/(clock)/code-step";
import { Buttons } from "@/components/(reusable)/buttons";
import { Forms } from "@/components/(reusable)/forms";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";

import { Clock } from "@/components/clock";
import { useSession } from "next-auth/react";

export default function AdminSwitch({
  handleClose,
}: {
  handleClose: () => void;
}) {
  useFetchAllData(); //  the data fetching call
  const { scanResult } = useScanData();
  const { savedCostCode } = useSavedCostCode();
  const { setTimeSheetData } = useTimeSheetData();
  const date = new Date();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (scanResult !== null && savedCostCode !== null) {
      formData.append("jobsiteId", scanResult?.data || "");
      formData.append("costcode", savedCostCode?.toString() || "");
    } else {
      const j = JSON.parse(localStorage.getItem("jobSite") || "{}");
      formData.append("jobsiteId", j);

      const cc = JSON.parse(localStorage.getItem("costCode") || "{}");
      formData.append("costcode", cc);
    }
    const response = await CreateTimeSheet(formData);
    if (response) {
      setAuthStep("success");
      const result = { id: response.id.toString() };
      setTimeSheetData(result);
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
          <CodeStep datatype="jobsite" />
        </Holds>
        <Holds>
          <CodeStep datatype="costcode" />
        </Holds>
      </Holds>
      <Holds>
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
