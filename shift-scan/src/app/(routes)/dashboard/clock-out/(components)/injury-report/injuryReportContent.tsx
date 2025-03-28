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
import { Bases } from "@/components/(reusable)/bases";
import { Images } from "@/components/(reusable)/images";
import { Labels } from "@/components/(reusable)/labels";

type FormProps = {
  base64String: string | null;
  handleNextStep: () => void;
  setBase64String?: Dispatch<SetStateAction<string>>;
  handleComplete?: () => Promise<void>;
  handleSubmitImage?: () => Promise<void>;
  prevStep: () => void;
};

export const InjuryReportContent = ({
  base64String,
  handleNextStep,
  prevStep,
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
    <Bases>
      <Contents>
        <Holds background={"white"} className="h-full w-full">
          <Contents width={"section"}>
            <Grids rows={"8"} gap={"5"} className="h-full w-full py-4">
              <Holds className="h-full w-full row-start-1 row-end-2 ">
                <Grids
                  rows={"2"}
                  cols={"5"}
                  gap={"3"}
                  className=" h-full w-full"
                >
                  <Holds
                    className="row-start-1 row-end-2 col-start-1 col-end-2 h-full w-full justify-center"
                    onClick={prevStep}
                  >
                    <Images
                      titleImg="/turnBack.svg"
                      titleImgAlt="back"
                      position={"left"}
                    />
                  </Holds>
                  <Holds className="row-start-2 row-end-3 col-span-5 h-full w-full justify-center">
                    <Grids
                      cols={"5"}
                      rows={"1"}
                      className="h-full w-full relative"
                    >
                      <Holds className="col-start-1 col-end-5 h-full w-full justify-center">
                        <Titles size={"h2"}>{t("InjuryVerification")}</Titles>
                      </Holds>
                      <Holds className="col-start-4 col-end-5 h-full w-full justify-center absolute">
                        <Images
                          titleImg="/clock-out.svg"
                          titleImgAlt="Verify"
                          size={"full"}
                          className="w-10 h-10"
                        />
                      </Holds>
                    </Grids>
                  </Holds>
                </Grids>
              </Holds>
              {/* Describe What Happened */}
              <Holds className="row-start-2 row-end-4 h-full">
                <Labels type="title" size={"p4"} htmlFor="incidentDescription">
                  {t("incidentDescription")}
                </Labels>
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

              <Holds position={"row"} className="row-start-4 row-end-5">
                <Holds size={"80"}>
                  <Titles position={"left"} size="h3">
                    {t("ContactedSupervisor")}
                  </Titles>
                </Holds>
                <Holds size={"20"}>
                  <CheckBox
                    checked={supervisorChecked}
                    onChange={handleSupervisorCheckboxChange}
                    id={"1"}
                    name={""}
                    size={3}
                  />
                </Holds>
              </Holds>

              <Holds position={"row"} className="row-start-5 row-end-6">
                <Holds size={"80"}>
                  <Titles position={"left"} size="h3">
                    {t("SignatureVerify")}
                  </Titles>
                </Holds>
                <Holds size={"20"}>
                  <CheckBox
                    checked={signatureChecked}
                    onChange={handleSignatureCheckboxChange}
                    id={"2"}
                    name={""}
                    size={3}
                  />
                </Holds>
              </Holds>
              <Holds className="row-start-6 row-end-8 h-full">
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
              <Holds className="row-start-8 row-end-9 h-full">
                <Buttons
                  background={
                    textarea && base64String && signatureChecked
                      ? "lightBlue"
                      : "darkGray"
                  }
                  disabled={textarea && signatureChecked ? false : true}
                  onClick={handleSubmit}
                >
                  <Titles>{t("SubmitButton")}</Titles>
                </Buttons>
              </Holds>
            </Grids>
          </Contents>
        </Holds>
      </Contents>
    </Bases>
  );
};
