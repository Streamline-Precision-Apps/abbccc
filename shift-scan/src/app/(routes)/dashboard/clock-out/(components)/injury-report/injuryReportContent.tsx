"use client";
import "@/app/globals.css";
import { useState, ChangeEvent, useEffect } from "react";
import Checkbox from "../injury-verification/checkBox";
import Signature from "../injury-verification/Signature";
import { useSavedInjuryReportData } from "@/app/context/InjuryReportDataContext";
import { CreateInjuryForm } from "@/actions/injuryReportActions";  // Import the server action
import { useTranslations } from "next-intl";
import { Contents } from "@/components/(reusable)/contents";
import { Sections } from "@/components/(reusable)/sections";
import { Titles } from "@/components/(reusable)/titles";
import { Buttons } from "@/components/(reusable)/buttons";
type FormProps = {
  handleNextStep: () => void
}

export const InjuryReportContent = ({handleNextStep}: FormProps) => {
  const [checked, setChecked] = useState<boolean>(false);
  const [textarea, setTextarea] = useState<string>("");
  const [signatureBlob, setSignatureBlob] = useState<Blob | null>(null);
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { savedInjuryReportData, setSavedInjuryReportData } =
    useSavedInjuryReportData();
  const t = useTranslations("clock-out");


  useEffect(() => {
    if (savedInjuryReportData) {
      setChecked(savedInjuryReportData.contactedSupervisor);
      setTextarea(savedInjuryReportData.incidentDescription);
      if (savedInjuryReportData.signatureBlob) {
        const url = URL.createObjectURL(
          new Blob([savedInjuryReportData.signatureBlob])
        );
        setSignatureUrl(url);
      }
    }
  }, [savedInjuryReportData]);

  const handleCheckboxChange = (newChecked: boolean) => {
    setChecked(newChecked);
  };

  const handleSignatureEnd = (blob: Blob) => {
    try {
      if (blob) {
        setSignatureBlob(blob);
        const url = URL.createObjectURL(blob);
        setSignatureUrl(url);
      } else {
        throw new Error("Failed to capture signature. Please try again.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setTextarea(event.target.value);
  };

  const handleSubmit = async () => {
    if (!textarea) {
      setError("Please describe what happened.");
      return;
    }
    const formData = new FormData();
    formData.append("contactedSupervisor", checked.toString());
    formData.append("incidentDescription", textarea);
    if (signatureBlob) {
      formData.append("signature", signatureBlob);
    }
    try {
      await CreateInjuryForm(formData);  // Use the server action to create the form
      setSavedInjuryReportData({
        contactedSupervisor: checked,
        incidentDescription: textarea,
        signatureBlob: signatureBlob ? await signatureBlob.text() : "",
      });
      setError(null);
      // Add success feedback, e.g., redirect or show a message
    } catch (error) {
      setError(t("FaildToSubmit"));
    }
  };

  useEffect(() => {
    return () => {
      if (signatureUrl) {
        URL.revokeObjectURL(signatureUrl);
      }
    };
  }, [signatureUrl]);

  return (
    <>
          <Sections size={"titleBox"}>
          <Contents variant={"rowCenter"}>
          <Titles size={"h4"}>{t("ContactedSupervisor")}</Titles>
            <Checkbox checked={checked} onChange={handleCheckboxChange} />
          </Contents>
        </Sections>
        <Sections size={"titleBox"}>
          <label htmlFor="comment"><Titles size={"h4"}>{t("Comment")}</Titles></label>
          <textarea
            id="comment"
            className="w-full h-full flex col text-center border-2 border-black rounded-2xl bg-gray-200"
            value={textarea}
            onChange={handleChange}
            required
          />
        <div className="flex flex-col text-center">
          <label htmlFor="signature">{t("Signature")}</label>
          <Signature onEnd={handleSignatureEnd} />
          {signatureUrl && (
            <img
              id="signature"
              className="w-36 h-auto mt-4 border-2 border-black rounded-2xl bg-gray-200"
              src={signatureUrl}
              alt="Signature"
              
            />
          )}
          {error && <p className="text-red-500">{error}</p>}
        </div>
        </Sections>
        <Buttons onClick={handleNextStep}>{t("SubmitButton")}</Buttons>
    </>
  );
};
