"use client";
import { useTranslations } from "next-intl";
import "@/app/globals.css";
import Modal from "@/components/modal";
import DashboardButtons from "@/components/dashboard-buttons";
import {
  clearAuthStep,
  getAuthStep,
  isDashboardAuthenticated,
} from "@/app/api/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Index() {
  const settingsPage = () => {
    router.push("/hamburger/settings");
  };
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
    <div className="flex flex-col items-center space-y-4 ">
      <button onClick={() => setIsOpen(true)}>
        <p>Hamburger Menu</p>
      </button>
      <Modal handleClose={() => setIsOpen(false)} isOpen={isOpen}>
        <button onClick={() => settingsPage()} className="close-btn">
          <p>Settings</p>
        </button>
      </Modal>
      {/* <UseModal show={true} onClose={CloseModal} children={<h1>Modal Content</h1>} /> */}
      <h1>{t("Banner")}</h1>
      <h2>
        {t("Name", { firstName: user.firstName, lastName: user.lastName })}
      </h2>
      <h2>{t("Date", { date: user.date })}</h2>
      <br />
      <DashboardButtons />
      <h2>{t("lN1")}</h2>
    </div>
  ) : (
    <></>
  );
}

function handleBeforeUnload(this: Window, ev: BeforeUnloadEvent) {
  throw new Error("Function not implemented.");
}
