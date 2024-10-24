"use client";
import "@/app/globals.css";
import { useState, ChangeEvent } from "react";
import { CreateInjuryForm } from "@/actions/injuryReportActions";
import { useTranslations } from "next-intl";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { Titles } from "@/components/(reusable)/titles";
import { Buttons } from "@/components/(reusable)/buttons";
import { useSession } from "next-auth/react";
import Checkbox from "@/components/(inputs)/checkbox";
import { Grids } from "@/components/(reusable)/grids";
import { TextAreas } from "@/components/(reusable)/textareas";

type FormProps = {
  base64String: string | null;
  setBase64String: (base64: string) => void;
  handleComplete: () => void;
  handleSubmitImage: () => void;
  handleNextStep: () => void;
};

export const InjuryReportContent = ({
  base64String,
  handleComplete,
  handleNextStep,
}: FormProps) => {
  const [supervisorChecked, setSupervisorChecked] = useState<boolean>(false);
  const [signatureChecked, setSignatureChecked] = useState<boolean>(false);
  const [textarea, setTextarea] = useState<string>("");
  const [error, setError] = useState<string | undefined>(undefined);
  const t = useTranslations("ClockOut");
  const { data: session } = useSession();
  if (!session) {
    return null;
  }
  const { id } = session.user;

  const handleSupervisorCheckboxChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setSupervisorChecked(event.currentTarget.checked);
  };
  const handleSignatureCheckboxChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setSignatureChecked(event.currentTarget.checked);
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
      setError(undefined);
      handleComplete();
      handleNextStep();
    } catch (error) {
      setError(t("FaildToSubmit"));
    }
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setTextarea(event.target.value);
  };

  return (
    <>
      <Contents width={"section"}>
        <Grids rows={"10"} gap={"5"}>
          <Holds position={"row"} className="h-full row-span-2 my-auto">
            <Holds size={"70"}>
              <Titles position={"left"} size="h3">
                {t("ContactedSupervisor")}
              </Titles>
            </Holds>
            <Holds size={"30"}>
              <Checkbox
                defaultChecked={supervisorChecked}
                onChange={handleSupervisorCheckboxChange}
                id={"1"}
                name={""}
                size={2}
              />
            </Holds>
          </Holds>

          <Holds className="row-span-4">
            <label htmlFor="incidentDescription">
              <Titles position={"left"} size="h3">
                {t("incidentDescription")}
              </Titles>
            </label>
            <TextAreas
              id="incidentDescription"
              value={textarea}
              onChange={handleChange}
              rows={5}
              minLength={1}
              maxLength={40}
              style={{ resize: "none", width: "100%", height: "100%" }}
              className="border-[3px] border-black"
            />
            {error && <p className="text-red-500">{error ?? ""}</p>}
          </Holds>

          <Holds className="row-span-2">
            <Holds className="my-auto border-[3px] border-black">
              {base64String ? (
                <img
                  src={base64String}
                  alt="Loading signature"
                  className="w-[30%] mx-auto"
                />
              ) : (
                <p>No Signature </p>
              )}
            </Holds>
          </Holds>
          <Holds position={"row"}>
            <Holds size={"70"}>
              <Titles position={"left"} size="h3">
                {t("SignatureVerify")}
              </Titles>
            </Holds>
            <Holds size={"30"}>
              <Checkbox
                defaultChecked={signatureChecked}
                onChange={handleSignatureCheckboxChange}
                id={"2"}
                name={""}
                size={2}
              />
            </Holds>
          </Holds>
          <Holds className="row-span-2">
            <Buttons onClick={handleSubmit}>
              <Titles>{t("SubmitButton")}</Titles>
            </Buttons>
          </Holds>
        </Grids>
      </Contents>
    </>
  );
};
