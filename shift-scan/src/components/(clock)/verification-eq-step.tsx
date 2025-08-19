"use client";
import React, { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useEQScanData } from "@/app/context/equipmentContext";
import { useScanData } from "@/app/context/JobSiteScanDataContext";
import { CreateEmployeeEquipmentLog } from "@/actions/equipmentActions";
import { executeOfflineFirstAction } from "@/utils/offlineFirstWrapper";
import { Contents } from "../(reusable)/contents";
import { useSession } from "next-auth/react";
import { Holds } from "../(reusable)/holds";
import { Grids } from "../(reusable)/grids";
import CodeStep from "./code-step";
import { Buttons } from "../(reusable)/buttons";
import { Titles } from "../(reusable)/titles";
import { useRouter } from "next/navigation";

type VerifyProcessProps = {
  handleNextStep: () => void;
  handlePrevStep: () => void;
  handleScannedPrevStep: () => void;
  scanned: boolean;
};

const VerificationEQStep: React.FC<VerifyProcessProps> = ({
  handleNextStep,
  handlePrevStep,
  handleScannedPrevStep,
  scanned,
}) => {
  const t = useTranslations("Clock");
  const { scanEQResult } = useEQScanData();
  const { scanResult, setScanResult } = useScanData();
  const { data: session } = useSession();

  const router = useRouter();
  // Handle local storage logic after hooks
  useEffect(() => {
    if (!scanResult?.qrCode) {
      const jobSiteId = localStorage.getItem("jobSite");
      setScanResult({
        qrCode: jobSiteId || "",
        name: "",
      });
    }
  }, [scanResult, setScanResult]);

  const id = session?.user.id;
  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("equipmentId", scanEQResult?.data || "");
    formData.append("jobsiteId", scanResult?.qrCode || "");
    formData.append("startTime", new Date().toString());
    formData.append("employeeId", id || "");

    const result = await executeOfflineFirstAction(
      "CreateEmployeeEquipmentLog",
      CreateEmployeeEquipmentLog,
      formData,
    );
    if (result) {
      router.push("/dashboard/equipment");
    }
  };

  return (
    <Holds background={"white"} className="h-full w-full">
      <Contents>
        <Grids rows={"8"} gap={"5"} className="h-full w-full py-5">
          <Holds className="h-full w-full row-span-7">
            <CodeStep
              datatype="equipment"
              handlePrevStep={handlePrevStep}
              handleScannedPrevStep={handleScannedPrevStep}
              scanned={scanned}
            />
          </Holds>
          <Buttons
            onClick={(e) => {
              e.preventDefault();
              onSubmit(e);
            }}
            background="orange"
            className="py-2"
          >
            <Titles size={"h2"}>{t("SubmitSelection")}</Titles>
          </Buttons>
        </Grids>
      </Contents>
    </Holds>
  );
};

export default VerificationEQStep;
