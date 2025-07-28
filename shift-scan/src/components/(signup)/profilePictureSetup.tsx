"use client";
import React, { useState, useEffect } from "react";
import { Buttons } from "../(reusable)/buttons";
import { uploadFirstImage } from "@/actions/userActions";
import CameraComponent from "../(camera)/camera";
import { Banners } from "@/components/(reusable)/banners";
import { Holds } from "../(reusable)/holds";
import { Grids } from "../(reusable)/grids";
// import { Images } from "../(reusable)/images";
import { Texts } from "../(reusable)/texts";
import { Contents } from "../(reusable)/contents";
import { Titles } from "../(reusable)/titles";
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
  const [showBanner, setShowBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState("");

  const t = useTranslations("SignUpProfilePicture");

  useEffect(() => {
    if (showBanner) {
      const timer = setTimeout(() => {
        setShowBanner(false);
      }, 5000); // Banner disappears after 5 seconds

      return () => clearTimeout(timer); // Clear the timeout if the component unmounts
    }
  }, [showBanner]);

  const handleSubmitImage = async () => {
    if (!base64String) {
      setBannerMessage("Please capture or select an image before proceeding.");
      setShowBanner(true);
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
      setBannerMessage(
        "There was an error uploading your image. Please try again."
      );
      setShowBanner(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-[100vh] overflow-y-auto flex flex-col gap-1">
      <div className="w-full h-full max-h-28 flex flex-col justify-end gap-1 pb-4">
        <Texts text={"white"} className="justify-end" size={"sm"}>
          {t("AddProfilePicture")}
        </Texts>
      </div>
      <div className="h-full flex flex-col bg-white border border-zinc-300 p-4 overflow-y-auto">
        <Contents>
          <div className="max-w-[600px] w-full flex flex-col mx-auto h-full gap-4">
            <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

            <div className=" h-full flex flex-col items-center gap-8">
              <Contents width={"section"}>
                <Holds className="h-full">
                  {/* Integrating CameraComponent */}
                  <CameraComponent setBase64String={setBase64String} />
                </Holds>
              </Contents>
            </div>
            <div className="flex flex-col  mt-4">
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
        </Contents>
      </div>
    </div>
  );
}
