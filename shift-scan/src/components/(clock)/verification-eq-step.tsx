"use client";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useEQScanData } from "@/app/context/equipmentContext";
import { useScanData } from "@/app/context/JobSiteContext";
import { useSavedCostCode } from "@/app/context/CostCodeContext";
import { useSavedClockInTime } from "@/app/context/ClockInTimeContext";
import { useSavedTimeSheetData } from "@/app/context/TimeSheetIdContext";
import { useSavedUserData } from "@/app/context/UserContext";
import { CreateEmployeeEquipmentLog } from "@/actions/equipmentActions";

type Equipment = {
  id: string;
  name: string;
};

type VerifyProcessProps = {
  id: string | null;
  handleNextStep: () => void;
  type: string;
  equipment: Equipment[];
};

const VerificationEQStep: React.FC<VerifyProcessProps> = ({
  id,
  type,
  handleNextStep,
  equipment,
}) => {
  const [filteredEquipmentName, setFilteredEquipmentName] = useState<string | null>(null);
  const t = useTranslations("clock");
  const { scanEQResult } = useEQScanData();
  const { scanResult } = useScanData();
  const { clockInTime, setClockInTime } = useSavedClockInTime();
  const { savedUserData } = useSavedUserData();
  const [filteredEquipment, setFilteredEquipment] = useState<Equipment | undefined>();

  useEffect(() => {
    if (scanEQResult?.data) {
      const result = equipment.filter((item) => item.id === scanEQResult.data);
      setFilteredEquipmentName(result.length > 0 ? result[0].name : null);
      console.log(result);
    }
  }, [scanEQResult, equipment]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (id === null) {
        throw new Error("User id does not exist");
      }

      const formData = new FormData();
      formData.append("employee_id", id?.toString() || "");
      formData.append("jobsite_id", scanResult?.data || "");
      formData.append("equipment_id", scanEQResult?.data || "");
      formData.append("start_time", new Date().toISOString());
      await CreateEmployeeEquipmentLog(formData);

      handleNextStep();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <h1 className="flex justify-center text-2xl font-bold pt-10 pb-10">
        Title Verify
      </h1>
      <form
        onSubmit={handleSubmit}
        className="h-full bg-white flex flex-col items-center rounded-t-2xl"
      >
        <label htmlFor="name">Equipment Scanned</label>
        <input
          type="text"
          name="name"
          value={scanEQResult?.data || ""}
          className="p-2 text-center"
          readOnly
        />
        <label htmlFor="equipment_notes" className="">
          Notes
        </label>
        <textarea
          name="equipment_notes"
          className="p-2 border-2 border-black w-full"
          placeholder="Enter notes here..."
        />
        <button
          type="submit"
          className="bg-app-blue w-full h-1/6 py-4 rounded-lg text-black font-bold mt-5"
        >
          Next
        </button>
        <input type="text" name="equipment_id" value={scanEQResult?.data || ""} />
        <input type="text" name="jobsite_id" value={scanResult?.data || ""} />
        <input type="text" name="start_time" value={new Date().toISOString()} />
        <input type="text" name="employee_id" value={savedUserData?.id || ""} />
      </form>
    </>
  );
};

export default VerificationEQStep;