"use client";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, useParams } from "next/navigation";
import { useScanData } from "../../../../context/JobSiteContext";
import { useSavedCostCode } from "../../../../context/CostCodeContext";
import RedirectAfterDelay from "@/components/redirectAfterDelay";
import { getAuthStep, isAuthenticated } from "@/app/api/auth";
import { useSavedClockInTime } from "@/app/context/ClockInTimeContext";
import { useSavedTimeSheetData } from "@/app/context/TimeSheetIdContext";


const SuccessPage: React.FC = () => {
    const Params = useParams<{id : string}>();
    const t = useTranslations("page5");
    const router = useRouter();
    const { scanResult } = useScanData();
    const { savedCostCode } = useSavedCostCode();
    const { clockInTime, setClockInTime } = useSavedClockInTime();
    const [authStep, setAuthStepState] = useState<string | null>(null); 
    const { savedTimeSheetData, setSavedTimeSheetData} = useSavedTimeSheetData();

    useEffect(() => {
        setAuthStepState(getAuthStep());
    }, []);

    useEffect(() => {
        if (!isAuthenticated()) {
            // router.push('/'); // Redirect to login page if not authenticated
        } else if (authStep !== "success") {
        console.log(authStep); 

        setSavedTimeSheetData(Params); 
        }
    }, [authStep, router]);

    useEffect(() => {
        if (clockInTime === null) {
            setClockInTime(new Date());
        }
    }, [clockInTime, setClockInTime]);

    if (!isAuthenticated() || authStep !== "success") {
        return null;
    }

    return (
      <div className="mt-16 h-screen lg:w-1/2 block m-auto">
          <div className="h-full bg-white flex flex-col items-center p-5 rounded-t-2xl">
              <h1 className="text-3xl my-5">{t("lN1")}</h1>
              <div className="bg-pink-100 h-1/2 w-1/2 flex flex-col items-center p-5 rounded-t-2xl text-xl">
                  <h2 className="my-5">{t("lN2")} {scanResult?.data}</h2>
                  <h2 className="my-5">{t("lN3")} {savedCostCode}</h2>
              {clockInTime && (
                  <h2 className="my-5">{t("lN4a")} 
                      {clockInTime.toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "numeric",
                          second: "numeric",
                          hour12: true,
                      })}
                  </h2>
              )}
              </div>
              <p className="my-5">{t("lN4")}</p>
              <RedirectAfterDelay delay={10000} to="/dashboard" />
          </div>
      </div>
  );
};

export default SuccessPage;