import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import "@/app/globals.css";
// import UseModal from '@/components/modal';
import Checkbox from "@/components/(inputs)/checkBox";
import {
  clearAuthStep,
  getAuthStep,
  isDashboardAuthenticated,
} from "@/app/api/auth";
import { useRouter } from "next/navigation";

export default function Index() {
  // TODO: Add translations
  const t = useTranslations("beforeYouGo");

  const router = useRouter();

  useEffect(() => {
    if (!isDashboardAuthenticated()) {
      console.log("Not authenticated");
      console.log(getAuthStep());
      // router.push('/'); // Redirect to login page if not authenticated
    }
    if (getAuthStep() !== "success") {
      router.push("/"); // Redirect to QR page if steps are not followed
    }
  }, []);

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

  return isDashboardAuthenticated() ? (
    <div className="flex flex-col items-center space-y-4 ">
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <Checkbox />
      <button
        className="bg-green-300 hover:bg-gray-400 text-gray-800 font-semibold py-8 px-16 border border-gray-400  font-bold rounded"
        onClick={() => {
          clearAuthStep();
          router.push("/");
        }}
      >
        {t("button")}
      </button>
    </div>
  ) : (
    <></>
  );
}

function handleBeforeUnload(this: Window, ev: BeforeUnloadEvent) {
  throw new Error("Function not implemented.");
}
