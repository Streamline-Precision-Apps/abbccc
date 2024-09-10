"use client";
import "@/app/globals.css";
import { useState, useEffect, ChangeEvent } from "react";
import Checkbox from "../injury-verification/checkBox";
import Signature from "../injury-verification/Signature";
import { CreateInjuryForm } from "@/actions/injuryReportActions";
import { useTranslations } from "next-intl";
import { Contents } from "@/components/(reusable)/contents";
import { Sections } from "@/components/(reusable)/sections";
import { Titles } from "@/components/(reusable)/titles";
import { Buttons } from "@/components/(reusable)/buttons";

type FormProps = {
  base64String: string | null;
  setBase64String: (base64: string) => void;
  handleComplete: () => void;
  handleSubmitImage: () => void;
};

export const InjuryReportContent = ({
  base64String,
  setBase64String,
  handleComplete,
  handleSubmitImage,
}: FormProps) => {
  const [checked, setChecked] = useState<boolean>(false);
  const [textarea, setTextarea] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("clock-out");

  const handleCheckboxChange = (newChecked: boolean) => {
    setChecked(newChecked);
  };

  const handleSubmit = async () => {
    if (!textarea) {
      setError("Please describe what happened.");
      return;
    }
    if (!base64String) {
      setError("Please add a signature.");
      return;
    }
    const formData = new FormData();
    formData.append("contactedSupervisor", checked.toString());
    formData.append("incidentDescription", textarea);
    formData.append("signedForm", "true");
    try {
      await CreateInjuryForm(formData); // I don't like the way this is put together, I am going to re-work it.
      setError(null);
      handleComplete(); // Call handleComplete on success
    } catch (error) {
      setError(t("FaildToSubmit"));
    }
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setTextarea(event.target.value);
  };

  return (
    <>
      <Sections size="titleBox">
        <Contents variant="rowCenter">
          <Titles size="h4">{t("ContactedSupervisor")}</Titles>
          <Checkbox checked={checked} onChange={handleCheckboxChange} />
        </Contents>
      </Sections>
      <Sections size="titleBox">
        <label htmlFor="comment">
          <Titles size="h4">{t("Comment")}</Titles>
        </label>
        <textarea
          id="comment"
          className="w-full h-full flex col text-center border-2 border-black rounded-2xl bg-gray-200"
          value={textarea}
          onChange={handleChange}
          required
        />
        <div className="flex flex-col text-center">
          <label htmlFor="signature">{t("Signature")}</label>
          <Signature
            setBase64String={setBase64String}
            base64string={base64String}
            handleSubmitImage={handleSubmitImage}
          />
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </Sections>
      <Buttons onClick={handleSubmit}>{t("SubmitButton")}</Buttons>
    </>
  );
};
