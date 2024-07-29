"use client";
import { useTranslations } from "next-intl";
import "@/app/globals.css";
import DashboardButtons from "@/components/dashboard-buttons";
import {
  clearAuthStep,
  getAuthStep,
  isDashboardAuthenticated,
} from "@/app/api/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Bases } from "@/components/(reusable)/bases";
import { Sections } from "@/components/(reusable)/sections";
import { Buttons } from "@/components/(reusable)/buttons";
import { Titles } from "@/components/(reusable)/titles";
import { Images } from "@/components/(reusable)/images";
import { Modals } from "@/components/(reusable)/modals";
import { Headers } from "@/components/(reusable)/headers";
import { Banners } from "@/components/(reusable)/banners";
import { Texts } from "@/components/(reusable)/texts";
import { Footers } from "@/components/(reusable)/footers";

export default function Index() {
  
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("dashboard");
  const router = useRouter();

  const [user, setUser] = useState<any>({
    firstName: "",
    lastName: "",
    date: "",
  });

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
        window.location.href = "/dashboard";
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

  useEffect(() => {
    // simulating an api call here
    const fetchData = async () => {
      const userData = {
        firstName: "Devun",
        lastName: "Durst",
        date: "05-03-2024",
        role: "Manager",
      };
      setUser(userData);
    };
    fetchData();
  }, []);

  return isDashboardAuthenticated() ? (
    <Bases variant={"default"} size={"default"}>
      <Sections size={"default"}>
        <Headers variant={"relative"} size={"default"}></Headers>
        <Banners variant={"default"} size={"default"}>
          <Titles variant={"default"} size={"h1"}>{t("Banner")}</Titles>
          <Texts variant={"default"} size={"p1"}>{t("Date", { date: user.date })}</Texts>
        </Banners>
        <Texts variant={"name"} size={"p1"}>{t("Name", { firstName: user.firstName, lastName: user.lastName })}</Texts>
        <DashboardButtons/>
        <Footers >{t("lN1")}</Footers>
      </Sections>
    </Bases>
  ) : (
    <></>
  );
}

function handleBeforeUnload(this: Window, ev: BeforeUnloadEvent) {
  throw new Error("Function not implemented.");
}