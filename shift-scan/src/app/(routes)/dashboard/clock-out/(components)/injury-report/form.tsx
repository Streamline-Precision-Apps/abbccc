// Form.tsx
"use client";
import { useRef } from "react";
import { CreateInjuryForm } from "@/actions/injuryReportActions";
import { useTranslations } from "next-intl";

interface FormProps {
  employeeId: string;
  onFormSubmit: (date: string) => void;
  checked: boolean; // Add checked prop
}

export const Form = ({ employeeId, onFormSubmit, checked }: FormProps) => {
  const ref = useRef<HTMLFormElement>(null);
  const t = useTranslations("clock-out");

  const button = () => {
    ref.current?.requestSubmit();
  };

  return (
    <form action={CreateInjuryForm}>
      {/* Hidden inputs */}
      <input type="hidden" name="user_id" value={employeeId} />
      <input type="hidden" name="submit_date" value={new Date().toString()} />
      <input type="hidden" name="date" value={new Date().toString()} />
      <input
        type="hidden"
        name="contacted_supervisor"
        value={checked ? "true" : "false"}
      />
      <input type="hidden" name="incident_description" value={""} />
      <button
        type="submit"
        className="bg-app-blue w-1/2 h-1/6 py-4 px-5 rounded-lg text-black font-bold mt-5"
      >
        {t("SubmitButton")}
      </button>
    </form>
  );
};
