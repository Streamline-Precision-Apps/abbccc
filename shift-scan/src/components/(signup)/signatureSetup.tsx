"use client";
import React, { useState, useEffect } from "react";
import { uploadFirstSignature } from "@/actions/userActions";
import { Texts } from "../(reusable)/texts";
import { Holds } from "../(reusable)/holds";
import { useTranslations } from "next-intl";
import { Images } from "../(reusable)/images";
import { ProgressBar } from "./progressBar";
import { Button } from "../ui/button";
import { NModals } from "../(reusable)/newmodals";
import Signature from "@/app/(routes)/dashboard/clock-out/(components)/injury-verification/Signature";

interface SignatureSetupProps {
  id: string;
  handleNextStep: () => void;
  totalSteps: number;
  currentStep: number;
}

const SignatureSetup: React.FC<SignatureSetupProps> = ({
  id,
  handleNextStep,
  totalSteps,
  currentStep,
}) => {
  const [base64String, setBase64String] = useState<string | null>(null);
  const [editSignatureModalOpen, setEditSignatureModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [bannerMessage, setBannerMessage] = useState<string>("");

  const t = useTranslations("SignUpVirtualSignature");

  // Hide the banner after 5 seconds if it is shown
  useEffect(() => {
    if (showBanner) {
      const timer = setTimeout(() => {
        setShowBanner(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showBanner]);

  const handleSubmitImage = async () => {
    if (!base64String) {
      setBannerMessage("Please capture a signature before proceeding.");
      setShowBanner(true);
      return;
    }

    const formData = new FormData();
    formData.append("id", id);
    // Since base64String is a string, we can directly append it
    formData.append("signature", base64String);

    setIsSubmitting(true);
    try {
      await uploadFirstSignature(formData);
      handleNextStep(); // Proceed to the next step only if the image upload is successful
    } catch (error) {
      console.error("Error uploading signature:", error);
      setBannerMessage(
        "There was an error uploading your signature. Please try again.",
      );
      setShowBanner(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-[100vh] overflow-y-auto flex flex-col gap-1">
      <div className="w-full h-[10vh] flex flex-col justify-end gap-1 pb-4">
        <Texts text={"white"} className="justify-end" size={"sm"}>
          {t("AddASignature")}
        </Texts>
      </div>
      <div className="h-full flex flex-col bg-white border border-zinc-300 p-4 overflow-y-auto">
        <div className="max-w-[600px] w-[95%] px-2 flex flex-col mx-auto h-full overflow-auto no-scrollbar gap-4">
          <ProgressBar
            currentStep={
              base64String ? Math.min(currentStep + 1, totalSteps) : currentStep
            }
            totalSteps={totalSteps}
          />
          <div className=" h-full max-h-[60vh] flex flex-col items-center gap-8">
            <p className="text-xs text-gray-400">{t("AddYourBestSignature")}</p>
            <div>
              <Holds className="w-[300px] h-[200px] rounded-[10px] border-[3px] border-black justify-center items-center relative ">
                {base64String && (
                  <Images
                    titleImg={base64String}
                    titleImgAlt={t("Signature")}
                    className="justify-center items-center "
                    size={"50"}
                  />
                )}
                <Holds
                  background={"orange"}
                  className="absolute top-1 right-1 w-fit h-fit rounded-full border-[3px] border-black p-2"
                  onClick={() => setEditSignatureModalOpen(true)}
                >
                  <Images
                    titleImg="/formEdit.svg"
                    titleImgAlt={"Edit"}
                    className="max-w-5 h-auto object-contain"
                  />
                </Holds>
              </Holds>
            </div>
          </div>
          <div className="flex flex-col  mb-4">
            <Button
              className="bg-app-dark-blue"
              onClick={handleSubmitImage}
              disabled={isSubmitting}
            >
              <p className="text-white font-semibold text-base">
                {isSubmitting ? `${t("Submitting")}` : `${t("Next")}`}
              </p>
            </Button>
          </div>
        </div>

        <NModals
          handleClose={() => setEditSignatureModalOpen(false)}
          size={"xlWS"}
          isOpen={editSignatureModalOpen}
        >
          <Holds className="w-full h-full justify-center items-center">
            <Signature
              setBase64String={setBase64String}
              closeModal={() => setEditSignatureModalOpen(false)}
            />
          </Holds>
        </NModals>
      </div>
    </div>
  );
};

export default SignatureSetup;
