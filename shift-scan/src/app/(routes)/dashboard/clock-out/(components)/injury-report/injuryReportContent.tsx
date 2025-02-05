"use client";
import "@/app/globals.css";
import { useState, ChangeEvent, Dispatch, SetStateAction } from "react";
import { CreateInjuryForm } from "@/actions/injuryReportActions";
import { useTranslations } from "next-intl";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { Titles } from "@/components/(reusable)/titles";
import { Buttons } from "@/components/(reusable)/buttons";
import { useSession } from "next-auth/react";
import { Grids } from "@/components/(reusable)/grids";
import { TextAreas } from "@/components/(reusable)/textareas";
import { CheckBox } from "@/components/(inputs)/checkBox";
import { Texts } from "@/components/(reusable)/texts";

type FormProps = {
  base64String: string | null;
  handleNextStep: () => void;
  setBase64String?: Dispatch<SetStateAction<string>>;
  handleComplete?: () => Promise<void>;
  handleSubmitImage?: () => Promise<void>;
};

export const InjuryReportContent = ({
  base64String,
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
        {error && (
          <Texts size="p6" className="text-red-500">
            {error ?? ""}
          </Texts>
        )}
        <Grids rows={"7"} gap={"5"}>
          <Holds className="row-start-1 row-end-3">
            <label htmlFor="incidentDescription">
              <Titles position={"left"} size="h4">
                {t("incidentDescription")}
              </Titles>
            </label>
            <TextAreas
              id="incidentDescription"
              value={textarea}
              onChange={handleChange}
              minLength={1}
              maxLength={500}
              style={{ resize: "none", width: "100%", height: "100%" }}
              className="border-[3px] border-black"
            />
          </Holds>

          <Holds position={"row"} className="row-start-3 row-end-4">
            <Holds size={"70"}>
              <Titles position={"left"} size="h3">
                {t("ContactedSupervisor")}
              </Titles>
            </Holds>
            <Holds size={"30"}>
              <CheckBox
                defaultChecked={supervisorChecked}
                onChange={handleSupervisorCheckboxChange}
                id={"1"}
                name={""}
                size={3}
              />
            </Holds>
          </Holds>

          <Holds position={"row"} className="row-start-4 row-end-5">
            <Holds size={"70"}>
              <Titles position={"left"} size="h3">
                {t("SignatureVerify")}
              </Titles>
            </Holds>
            <Holds size={"30"}>
              <CheckBox
                defaultChecked={signatureChecked}
                onChange={handleSignatureCheckboxChange}
                id={"2"}
                name={""}
                size={3}
              />
            </Holds>
          </Holds>
          <Holds className="row-start-5 row-end-7 h-full">
            <Holds className="h-full my-auto border-[3px] border-black rounded-[10px]">
              {base64String ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={base64String}
                  alt="Loading signature"
                  className="w-[40%] m-auto"
                />
              ) : (
                <p>No Signature </p>
              )}
            </Holds>
          </Holds>
          <Holds className="row-start-7 row-end-9 h-full">
            <Buttons
              background={
                textarea && base64String && signatureChecked
                  ? "lightBlue"
                  : "grey"
              }
              disabled={textarea && signatureChecked ? false : true}
              onClick={handleSubmit}
            >
              <Titles>{t("SubmitButton")}</Titles>
            </Buttons>
          </Holds>
        </Grids>
      </Contents>
    </>
  );
};
