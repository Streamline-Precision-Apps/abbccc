"use client";
import { useTranslations } from "next-intl";
import "@/app/globals.css";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { CustomSession } from "@/lib/types";
import Manager from "@/app/(routes)/dashboard/manager";
import { useState } from "react";
import Admin from "@/app/(routes)/admin/Admin";



export default function AdminButtons() {
  const [additionalButtonsType, setAdditionalButtonsType] = useState<
    string | null
  >(null);

  const handleResetButtons = () => {
    setAdditionalButtonsType(null);
  };

  const handleShowAdditionalButtons = (type: string) => {
    setAdditionalButtonsType(type);
  };
  return (
    <>
      <Admin
        additionalButtonsType={additionalButtonsType}
        handleResetButtons={handleResetButtons}
        handleShowAdditionalButtons={handleShowAdditionalButtons}
      />
    </>
  );
}
