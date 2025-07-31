"use client";
import React, { useState, useEffect } from "react";
import { uploadFirstImage } from "@/actions/userActions";
import CameraComponent from "../(camera)/camera";
import { Texts } from "../(reusable)/texts";
import { useTranslations } from "next-intl";
import { ProgressBar } from "./progressBar";
import { Button } from "../ui/button";

type prop = {
  userId: string;
  handleNextStep: () => void;
  totalSteps: number;
  currentStep: number;
};

export default function ProfilePictureSetup({
  userId,
  handleNextStep,
  totalSteps,
  currentStep,
}: prop) {
  const [base64String, setBase64String] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const t = useTranslations("SignUpProfilePicture");

  const handleSubmitImage = async () => {
    if (!base64String) {
      return;
    }

    const formData = new FormData();
    formData.append("id", userId);

    formData.append("image", base64String);

    setIsSubmitting(true);
    try {
      await uploadFirstImage(formData);
      handleNextStep(); // Proceed to the next step only if the image upload is successful
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-[100vh] overflow-y-auto flex flex-col gap-1">
      <div className="w-full h-[10vh] flex flex-col justify-end gap-1 pb-4">
        <Texts text={"white"} className="justify-end" size={"sm"}>
          {t("AddProfilePicture")}
        </Texts>
      </div>
      <div className="h-[90vh] flex flex-col bg-white border border-zinc-300 p-4 overflow-y-auto no-scrollbar">
        <div className="max-w-[600px] w-[95%] px-2 flex flex-col mx-auto h-full  gap-4">
          <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

          <div className=" h-full max-h-[50vh] flex flex-col items-center">
            <CameraComponent setBase64String={setBase64String} />
          </div>
          <div className="flex flex-col mb-4">
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
      </div>
    </div>
  );
}
