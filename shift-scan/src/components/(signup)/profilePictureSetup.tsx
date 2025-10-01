"use client";
import React, { useState } from "react";
import { updateUserImage } from "@/actions/userActions";
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
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const t = useTranslations("SignUpProfilePicture");

  const handleUpload = async (file: Blob) => {
    if (!userId) {
      console.warn("No user id");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("file", file, "profile.png");
      formData.append("folder", "profileImages");

      const res = await fetch("/api/uploadBlobs", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to upload image");
      }

      const { url } = await res.json();
      // Add cache-busting param to break browser cache
      const cacheBustedUrl = `${url}?t=${Date.now()}`;

      // Update user image URL in your database
      const updatingDb = await updateUserImage(userId, cacheBustedUrl);

      if (!updatingDb.success) {
        throw new Error("Error updating url in DB");
      }

      return cacheBustedUrl;
    } catch (err) {
      console.error("[Error uploading new image or updating DB:", err);
    }
  };

  const handleSubmitImage = async () => {
    // Check that we have an image blob
    if (!imageBlob) {
      return;
    }

    setIsSubmitting(true);
    try {
      await handleUpload(imageBlob);
      localStorage.setItem("userProfileImage", "Updating");
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
            <CameraComponent setImageBlob={setImageBlob} />
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
