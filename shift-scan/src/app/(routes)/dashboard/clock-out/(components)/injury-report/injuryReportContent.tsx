"use client";
import "@/app/globals.css";
import { useState, ChangeEvent, Dispatch, SetStateAction } from "react";
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
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";

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
      // add a way to report injury
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
          <Grids rows={"8"} gap={"5"} className="h-full w-full">
            <Holds className="h-full w-full row-start-1 row-end-2 ">
              <TitleBoxes onClick={prevStep}>
                <Holds className="h-full justify-end">
                  <Holds
                    position={"row"}
                    className="w-full justify-center gap-2"
                  >
                    <Titles size={"h2"}>{t("InjuryVerification")}</Titles>
                    <Images
                      titleImg="/clockOut.svg"
                      titleImgAlt="Verify"
                      size={"full"}
                      className="w-10 h-10"
                    />
                  </Holds>
                </Holds>
              </TitleBoxes>
            </Holds>

            {/* Describe What Happened */}
            <Holds className="row-start-2 row-end-4 h-full">
              <Contents width={"section"}>
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
              </Contents>
            </Holds>

            <Holds position={"row"} className="row-start-4 row-end-5">
              <Contents width={"section"}>
                <Holds position={"row"}>
                  <Holds size={"20"}>
                    <CheckBox
                      checked={supervisorChecked}
                      onChange={handleSupervisorCheckboxChange}
                      id={"1"}
                      name={""}
                      size={3}
                    />
                  </Holds>
                  <Holds size={"80"}>
                    <Titles position={"left"} size="h3">
                      {t("ContactedSupervisor")}
                    </Titles>
                  </Holds>
                </Holds>
              </Contents>
            </Holds>

            <Holds className="row-start-5 row-end-7 h-full">
              <Contents width={"section"}>
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
              </Contents>
            </Holds>
            <Holds position={"row"} className="row-start-7 row-end-8">
              <Contents width={"section"}>
                <Holds position={"row"}>
                  <Holds size={"20"}>
                    <CheckBox
                      checked={signatureChecked}
                      onChange={handleSignatureCheckboxChange}
                      id={"2"}
                      name={""}
                      size={3}
                    />
                  </Holds>
                  <Holds size={"80"}>
                    <Texts position={"left"} size="p3">
                      {t("SignatureVerify")}
                    </Texts>
                  </Holds>
                </Holds>
              </Contents>
            </Holds>
            <Holds className="row-start-8 row-end-9 h-full pb-5">
              <Contents width={"section"}>
                <Buttons
                  background={
                    textarea && signatureChecked ? "lightBlue" : "darkGray"
                  }
                  disabled={textarea && signatureChecked ? false : true}
                  onClick={handleSubmit}
                >
                  <Titles>{t("SubmitButton")}</Titles>
                </Buttons>
              </Contents>
            </Holds>
          </Grids>
        </Holds>
      </Contents>
    </Bases>
  );
};
