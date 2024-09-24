// Form.tsx
"use client";
import { useRef } from "react";
import { CreateInjuryForm } from "@/actions/injuryReportActions";
import { useTranslations } from "next-intl";

type FormProps = {
  userId: string;
  onFormSubmit: (date: string) => void;
  checked: boolean; // Add checked prop
  signature: string | null;
}

export const Form = ({ userId, onFormSubmit, checked, signature }: FormProps) => {
  const ref = useRef<HTMLFormElement>(null);
  const t = useTranslations("clock-out");

  const button = () => {
    ref.current?.requestSubmit();
  };

  return (
    <form action={CreateInjuryForm}>
      {/* Hidden inputs */}
      <input type="hidden" name="date" value={new Date().toString()} />
      <input
        type="checkbox"
        name="contactedSupervisor"
        value={checked ? "true" : "false"}
      />
      <input type="text" name="incidentDescription" value={""} />
      <input type="hidden" name="signature" value={signature ?? ""} />
      <input
        type="checkbox"
        name="verifyFormSignature"
        value={checked ? "true" : "false"}
      />
      <input type="hidden" name="Id" value={userId} />
      <button
        type="submit"
        className="bg-app-blue w-1/2 h-1/6 py-4 px-5 rounded-lg text-black font-bold mt-5"
      >
        {t("SubmitButton")}
      </button>
    </form>
  );
};
