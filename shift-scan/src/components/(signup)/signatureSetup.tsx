"use client";
import React, { useState, useEffect } from "react";
import { Buttons } from "../(reusable)/buttons";
import { uploadFirstSignature } from "@/actions/userActions";
import Signature from "./signature";
import { Banners } from "@/components/(reusable)/banners";
import { Texts } from "../(reusable)/texts";
import { Holds } from "../(reusable)/holds";
import { Grids } from "../(reusable)/grids";
import { TitleBoxes } from "../(reusable)/titleBoxes";
import { Contents } from "../(reusable)/contents";
import { Titles } from "../(reusable)/titles";
import { useTranslations } from "next-intl";

interface SignatureSetupProps {
  id: string;
  handleNextStep: () => void;
}

const SignatureSetup: React.FC<SignatureSetupProps> = ({
  id,
  handleNextStep,
}) => {
  const [base64String, setBase64String] = useState<string>("");
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
        "There was an error uploading your signature. Please try again."
      );
      setShowBanner(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Banner for error or feedback */}
      {showBanner && (
        <Holds
          style={{ position: "fixed", top: 0, width: "100%", zIndex: 1000 }}
        >
          <Banners background="red">
            <Texts size="p6">{bannerMessage}</Texts>
          </Banners>
        </Holds>
      )}
      <Grids rows="10" gap="5" className="mb-5">
        <Holds background="white" className="row-span-1 h-full justify-center">
          <TitleBoxes
            title={t("AddASignature")}
            titleImg="/signature.svg"
            titleImgAlt="Signature Setup"
            type="titleOnly"
            className="my-auto"
          />
        </Holds>
        <Holds background="white" className="row-span-8 h-full py-5">
          <Contents width="section">
            <Texts size="p4">{t("LetsAddASignature")}</Texts>
            <Holds className="h-full">
              {/* Signature component where the signature is captured */}
              <Signature setBase64String={setBase64String} />
            </Holds>
          </Contents>
        </Holds>
        <Holds className="row-span-1 h-full">
          <Buttons
            onClick={handleSubmitImage}
            background={base64String ? "orange" : "darkGrey"}
            disabled={isSubmitting}
          >
            <Titles>{isSubmitting ? "Submitting..." : "Next"}</Titles>
          </Buttons>
        </Holds>
      </Grids>
    </>
  );
};

export default SignatureSetup;
