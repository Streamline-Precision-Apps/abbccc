"use client";
import "@/app/globals.css";
import { useState, ChangeEvent } from "react";
import { Checkbox } from "../injury-verification/checkBox";
import { Signature } from "../injury-verification/Signature";
import { CreateInjuryForm } from "@/actions/injuryReportActions";
import { useTranslations } from "next-intl";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/Holds";
import { Titles } from "@/components/(reusable)/titles";
import { Buttons } from "@/components/(reusable)/buttons";
import { useSession } from "next-auth/react";

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
  const [supervisorChecked, setSupervisorChecked] = useState<boolean>(false);
  const [signatureChecked, setSignatureChecked] = useState<boolean>(false);
  const [textarea, setTextarea] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("clock-out");
  const { data: session } = useSession();
  if (!session) {
    return null;
  }
  const { id } = session.user;

  const handleSupervisorCheckboxChange = (newChecked: boolean) => {
    setSupervisorChecked(newChecked);
  };
  const handleSignatureCheckboxChange = (newChecked: boolean) => {
    setSignatureChecked(newChecked);
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
    if (!signatureChecked) {
      setError("Please verify your signature.");
      return;
    }

    const formData = new FormData();
    formData.append("contactedSupervisor", supervisorChecked.toString());
    formData.append("incidentDescription", textarea);
    formData.append("signedForm", "true");
    formData.append("signature", base64String ?? "");
    formData.append("verifyFormSignature", signatureChecked.toString());
    formData.append("date", new Date().toISOString());
    formData.append("userId", id);

    try {
      await CreateInjuryForm(formData);
      setError(null);
      handleComplete();
    } catch (error) {
      setError(t("FaildToSubmit"));
    }
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setTextarea(event.target.value);
  };

  return (
    <>
      <Holds size="titleBox">
        <Contents variant="rowCenter">
          <Titles size="h4">{t("ContactedSupervisor")}</Titles>
          <Checkbox checked={checked} onChange={handleCheckboxChange} />
        </Contents>
        </Holds>
        <Holds size="titleBox">
        <label htmlFor="comment">
          <Titles size="h4">{t("Comment")}</Titles>
        </label>
        <textarea
          id="incidentDescription"
          value={textarea}
          onChange={handleChange}
          required
        />
        <div className="flex flex-col text-center">
          <label htmlFor="signature">{t("Signature")}</label>
          <Signature
            setBase64String={setBase64String}
            base64string={base64String}
            // handleSubmitImage={handleSubmitImage}
          />
          {error && <p className="text-red-500">{error}</p>}
        </div>
        </Holds>
      <Buttons onClick={handleSubmit}>{t("SubmitButton")}</Buttons>
    </>
  );
};
