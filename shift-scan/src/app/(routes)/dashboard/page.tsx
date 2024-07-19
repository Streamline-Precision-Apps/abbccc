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
import ButtonRout from "@/components/button";

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
    <div className="mt-16 h-screen lg:w-1/2 block m-auto">
      <div className="h-full bg-white flex flex-col items-center p-5 rounded-t-2xl">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gray-300 w-1/4 py-2 rounded-lg text-black font-bold mt-5"
        >
          <p>Hamburger Menu</p>
        </button>
        <Modal handleClose={() => setIsOpen(false)} isOpen={isOpen}>
          <ButtonRout
            href="/hamburger/settings"
            text="Settings"
            color="bg-orange-500"
            width="w-full"
            height="h-12"
          />
          <ButtonRout
            href="/hamburger/inbox"
            text="Inbox"
            color="bg-blue-500"
            width="w-full"
            height="h-12"
          />
          <ButtonRout
            href="/hamburger/profile"
            text="Profile"
            color="bg-green-500"
            width="w-full"
            height="h-12"
          />
        </Modal>
        <h1 className="text-3xl my-5">{t("Banner")}</h1>
        <h2 className="text-xl my-2">
          {t("Name", { firstName: user.firstName, lastName: user.lastName })}
        </h2>
        <h2 className="text-xl my-2">{t("Date", { date: user.date })}</h2>
        <br />
        <DashboardButtons />
        <h2 className="text-xl my-5">{t("lN1")}</h2>
      </div>
    </div>
  ) : (
    <></>
  );
}

function handleBeforeUnload(this: Window, ev: BeforeUnloadEvent) {
  throw new Error("Function not implemented.");
}