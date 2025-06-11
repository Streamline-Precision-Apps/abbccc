"use client";
import { Holds } from "@/components/(reusable)/holds";
import { useEffect, useState } from "react";
import SelectEquipment from "./SelectEquipment";
import EquipmentScanner from "./EquipmentScanner";
import EquipmentSelectorView from "./EquipmentSelector";
type Option = {
  id: string;
  label: string;
  code: string;
};
export default function ScanEquipment() {
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [method, setMethod] = useState<"Scan" | "Select" | "">("");
  const [equipmentQr, setEquipmentQr] = useState<string | null>(null);
  const [equipment, setEquipment] = useState<Option>({
    id: "",
    label: "",
    code: "",
  });
  const [jobSite, setJobSite] = useState<Option>({
    id: "",
    label: "",
    code: "",
  });

  useEffect(() => {
    const getJobsite = async () => {
      const jobsiteResult = await fetch("/api/getRecentJobDetails");
      const jobsiteData = await jobsiteResult.json();
      setJobSite({
        id: jobsiteData.id,
        label: jobsiteData.name,
        code: jobsiteData.qrId,
      });
    };
    getJobsite();
  }, []);

  return (
    <>
      <Holds className="h-full">
        {step === 1 ? (
          <SelectEquipment
            setStep={setStep}
            setMethod={setMethod}
            error={error}
            setError={setError}
          />
        ) : step === 2 ? (
          <>
            {method === "Scan" ? (
              <EquipmentScanner
                setError={setError}
                setStep={setStep}
                setMethod={setMethod}
                setEquipmentQr={setEquipmentQr}
                equipmentQr={equipmentQr}
                jobSite={jobSite}
              />
            ) : method === "Select" ? (
              <EquipmentSelectorView
                setStep={setStep}
                setMethod={setMethod}
                setEquipment={setEquipment}
                equipment={equipment}
                jobSite={jobSite}
              />
            ) : null}
          </>
        ) : null}
      </Holds>
    </>
  );
}
