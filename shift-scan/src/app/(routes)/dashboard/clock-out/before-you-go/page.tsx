"use client";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import "@/app/globals.css";
// import UseModal from '@/components/modal';
import Checkbox from "@/app/(routes)/dashboard/clock-out/checkBox";
import {
  clearAuthStep,
  getAuthStep,
  isDashboardAuthenticated,
} from "@/app/api/auth";
import { useRouter } from "next/navigation";

export default function Index() {
  // TODO: Add translations
  // const t = useTranslations("beforeYouGo");

  const router = useRouter();
  const handleCheckboxChange = (newChecked: boolean) => {
    setChecked(newChecked);
  };
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const handlePopstate = () => {
      if (isDashboardAuthenticated()) {
        window.location.href = "/before-you-go";
      }
    };
    // Attach beforeunload event listener
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Attach popstate event listener (for handling back navigation)
    window.addEventListener("popstate", handlePopstate);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopstate);
    };
  }, []);

  return (
    <div className="flex flex-col items-center space-y-4 ">
      <h1 className="text-3xl font-bold">
        I have completed and logged all forms, equipment, and all other items
        required of me today.
      </h1>
      <Checkbox checked={checked} onChange={handleCheckboxChange} />
      <div className="w-1/4 ">
        {/* {t("button")} */}
        {checked ? (
          <div>
            <button
              className="bg-app-green text-black font-bold text-xl flex justify-center w-full py-4 border border-gray-400  font-bold rounded"
              onClick={() => {
                router.push("/dashboard/clock-out/injury-verification");
              }}
            >
              {/* {t("button")} */}Clock out
            </button>
            <button
              className="bg-app-green text-black font-bold text-xl flex justify-center w-full py-4 border border-gray-400  font-bold rounded"
              onClick={() => {
                router.push("/dashboard/clock-out/break");
              }}
            >
              {/* {t("button")} */}start break
            </button>
          </div>
        ) : (
          <button
            className="bg-app-red text-black font-bold text-xl flex justify-center w-full py-4 border border-gray-400  font-bold rounded"
            onClick={() => {
              router.push("/dashboard");
            }}
          >
            {/* {t("button")} */}Return to Dashboard
          </button>
        )}
      </div>
    </div>
  );
}

function handleBeforeUnload(this: Window, ev: BeforeUnloadEvent) {
  throw new Error("Function not implemented.");
}
