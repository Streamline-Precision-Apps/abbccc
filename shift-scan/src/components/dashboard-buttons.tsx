"use client";
import { useTranslations } from "next-intl";
import "@/app/globals.css";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { CustomSession } from "@/lib/types";
import { User } from "@/app/(routes)/dashboard/user";
import { Manager } from "@/app/(routes)/dashboard/manager";
import { useState } from "react";
import { Equipment, Logs } from "@/lib/types";
import { Contents } from "./(reusable)/contents";


interface DashboardButtonsProps {
  logs: Logs[]; // Use the consistent Logs type
  locale: string;
}

export default function DashboardButtons({ logs, locale }: DashboardButtonsProps) {
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
      <Contents variant={"widgetSection"} size={"test"}>
        <Manager show={!additionalButtonsType}/>
        <User
          additionalButtonsType={additionalButtonsType}
          handleShowManagerButtons={handleShowManagerButtons}
          handleShowAdditionalButtons={handleShowAdditionalButtons}
          logs={logs} // Pass logs to User component
          locale={locale}
        />
      </Contents>
    );
  } else {
    return (
      <Contents variant={"widgetSection"} size={"test"}>
        <User
          additionalButtonsType={additionalButtonsType}
          handleShowManagerButtons={handleShowManagerButtons}
          handleShowAdditionalButtons={handleShowAdditionalButtons}
          logs={logs} // Pass logs to User component
          locale={locale}
        />
      </Contents>
    );
  }
}
