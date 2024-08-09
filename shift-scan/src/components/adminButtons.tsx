"use client";
import { useTranslations } from "next-intl";
import "@/app/globals.css";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { CustomSession } from "@/lib/types";
import { Manager } from "@/app/(routes)/dashboard/manager";
import { useState } from "react";
import { Admin } from "@/app/(routes)/admin/Admin";



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
    <div className="grid grid-cols-2 grid-rows-2 gap-4 w-full m-4 p-4">
      <Admin
        additionalButtonsType={additionalButtonsType}
        handleResetButtons={handleResetButtons}
        handleShowAdditionalButtons={handleShowAdditionalButtons}
      />
    </div>
  );
}
