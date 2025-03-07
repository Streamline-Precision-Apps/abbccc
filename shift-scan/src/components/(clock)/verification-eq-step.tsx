"use client";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useEQScanData } from "@/app/context/equipmentContext";
import { useScanData } from "@/app/context/JobSiteScanDataContext";
import { CreateEmployeeEquipmentLog } from "@/actions/equipmentActions";
import { Contents } from "../(reusable)/contents";
import { Equipment } from "@/lib/types";
import { useSession } from "next-auth/react";
import { Holds } from "../(reusable)/holds";
import Spinner from "../(animations)/spinner";
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
  const [loading, setLoading] = useState(true);
  const { scanResult, setScanResult } = useScanData();
  const [equipment, setEquipmentList] = useState<Equipment[]>([]);
  //   const [selectedEquipment, setEquipment] = useState<Equipment | null>(null);
  const { data: session } = useSession();

  const router = useRouter();

  useEffect(() => {
    const fetchEquipmentList = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/getEquipmentList");
        const data = await response.json();
        setEquipmentList(data);
      } catch (error) {
        console.error("Error fetching equipment list:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEquipmentList();
  }, []);

  // Handle local storage logic after hooks
  useEffect(() => {
    if (!scanResult?.data) {
      const jobSiteId = localStorage.getItem("jobSite");
      setScanResult({ data: jobSiteId || "" });
    }
  }, [scanResult, setScanResult]);

  // If no session, show a loading state instead of returning early
  if (!session) {
    return (
      <Holds>
        <Spinner />
      </Holds>
    );
  }

  const { id } = session.user;

  if (loading) {
    return (
      <Holds>
        <Spinner />
      </Holds>
    );
  }

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("equipmentId", scanEQResult?.data || "");
    formData.append("jobsiteId", scanResult?.data || "");
    formData.append("startTime", new Date().toString());
    formData.append("employeeId", id || "");
    const result = await CreateEmployeeEquipmentLog(formData);
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
