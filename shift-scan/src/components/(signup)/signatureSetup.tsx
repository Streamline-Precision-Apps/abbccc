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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

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
    <div className="h-dvh w-full flex flex-col">
      {/*Header - fixed at top*/}
      <div className="w-full h-[10%] flex flex-col justify-end py-3">
        <Texts text={"white"} className="justify-end" size={"sm"}>
          {t("AddASignature")}
        </Texts>
      </div>
      <div className="bg-white w-full h-[40px] border border-slate-200 flex flex-col justify-center gap-1">
        <div className="w-[95%] max-w-[600px] mx-auto">
          <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        </div>
      </div>
      {/*Middle - scrollable content*/}
      <div className="flex-1 overflow-y-auto no-scrollbar bg-white pb-[200px]">
        <div className="max-w-[600px] w-[95%] p-4 px-2 flex flex-col mx-auto gap-4">
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
        </div>

        <Dialog
          open={editSignatureModalOpen}
          onOpenChange={() => setEditSignatureModalOpen(false)}
        >
          <DialogContent className="max-w-3xl w-full rounded-lg">
            <div className="mt-4">
              <Signature
                setBase64String={setBase64String}
                closeModal={() => setEditSignatureModalOpen(false)}
              />
            </div>
          </DialogContent>
        </Dialog>

        {/* <NModals
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
        </NModals> */}
      </div>

      {/*Footer - fixed at bottom*/}
      <div className="w-full h-[10%] bg-white border-t border-slate-200 px-4 py-2">
        <Button
          className={
            base64String ? "bg-app-dark-blue w-full" : "bg-gray-300 w-full"
          }
          onClick={handleSubmitImage}
          disabled={isSubmitting}
        >
          <p className="text-white font-semibold text-base">
            {isSubmitting ? `${t("Submitting")}` : `${t("Next")}`}
          </p>
        </Button>
      </div>
    </div>
  );
};

export default SignatureSetup;
