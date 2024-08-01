"use client";
import { useTranslations } from "next-intl";
import "@/app/globals.css";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { CustomSession } from "@/lib/types";
import { User } from "@/app/(routes)/dashboard/user";
import { Manager } from "@/app/(routes)/dashboard/manager";
import { useState } from "react";

export default function DashboardButtons() {
  const t = useTranslations("EmployeeCards");
  const router = useRouter();
  const { data: session } = useSession() as { data: CustomSession | null };
  const user = session?.user;
  const [additionalButtonsType, setAdditionalButtonsType] = useState<string | null>(null);

  const handleShowManagerButtons = () => {
    setAdditionalButtonsType(null);
  };

  const handleShowAdditionalButtons = (type: string) => {
    setAdditionalButtonsType(type);
  };

  if (
    user?.permission === "ADMIN" ||
    user?.permission === "SUPERADMIN" ||
    user?.permission === "MANAGER" ||
    user?.permission === "PROJECTMANAGER"
  ) {
    return (
      <div className="grid grid-cols-2 grid-rows-2 gap-4 w-full m-4 p-4">
        <Manager show={!additionalButtonsType} />
        <User
          additionalButtonsType={additionalButtonsType}
          handleShowManagerButtons={handleShowManagerButtons}
          handleShowAdditionalButtons={handleShowAdditionalButtons}
        />
      </div>
    );
  } else {
    return (
      <div className="grid grid-cols-2 grid-rows-2 gap-4 w-full m-4 p-4">
        <User
          additionalButtonsType={additionalButtonsType}
          handleShowManagerButtons={handleShowManagerButtons}
          handleShowAdditionalButtons={handleShowAdditionalButtons}
        />
      </div>
    );
  }
}