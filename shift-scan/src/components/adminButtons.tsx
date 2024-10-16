"use client";
import "@/app/globals.css";
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
