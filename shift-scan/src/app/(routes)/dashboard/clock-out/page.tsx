"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import "@/app/globals.css";
import ClockOutButtons from "@/components/clockOutButtons";
import {
  clearAuthStep,
  getAuthStep,
  isDashboardAuthenticated,
} from "@/app/api/auth";
import { useRouter } from "next/navigation";
import { Bases } from "@/components/(reusable)/bases";
import { Sections } from "@/components/(reusable)/sections";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";

export default function ClockOut() {
  const t = useTranslations("Clock-out");
  const router = useRouter();

  const [user, setUser] = useState<any>({
    firstName: "",
    lastName: "",
    date: "",
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handlePopstate = () => {
      if (isDashboardAuthenticated()) {
        window.location.href = "/dashboard/clock-out";
      }
    };
    // Attach beforeunload event listener
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopstate);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopstate);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulating an API call here
        const userData = {
          firstName: "Devun",
          lastName: "Durst",
          date: "05-03-2024",
          role: "Manager",
        };
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user data", error);
        setError("Failed to fetch user data. Please try again later.");
      }
    };
    fetchData();
  }, []);

  if (!isDashboardAuthenticated()) {
    return null;
  }

  return (
    <Bases>
      <Sections size={"titleBox"}>
        <TitleBoxes
          title={t("Title")}
          titleImg="/profile.svg"
          titleImgAlt="Team"
          variant={"default"}
          size={"default"}
        />
      </Sections>
      {error && <div className="text-red-500">{error}</div>}
      <ClockOutButtons />
    </Bases>
  );
}

function handleBeforeUnload(this: Window, ev: BeforeUnloadEvent) {
  throw new Error("Function not implemented.");
}
