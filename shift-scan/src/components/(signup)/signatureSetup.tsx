"use client";
import React, { useState, useEffect } from "react";
import { Buttons } from "../(reusable)/buttons";
import { uploadFirstSignature } from "@/actions/userActions";
import Signature from "./signature";
import { Banners } from "@/components/(reusable)/banners";

const SignatureSetup = ({
  id,
  handleNextStep,
}: {
  id: string;
  handleNextStep: any;
}) => {
  const [base64String, setBase64String] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showBanner, setShowBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState("");

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
      setBannerMessage("Please capture a signature before proceeding.");
      setShowBanner(true);
      return;
    }

    const formData = new FormData();
    formData.append("id", id);
    formData.append("Signature", base64String);

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
      {/* Show the banner at the top of the page */}
      {showBanner && (
        <div style={{ position: "fixed", top: 0, width: "100%", zIndex: 1000 }}>
          <Banners background="red">{bannerMessage}</Banners>
        </div>
      )}

      <div style={{ textAlign: "center", padding: "20px" }}>
        <p>
          Set up personal signature. Be sure to sign it well. It will be used on
          every form.
        </p>

        <div style={{ margin: "20px 0" }}>
          {/* Integrating Signature component */}
          <Signature setBase64String={setBase64String} />
        </div>

        <Buttons
          onClick={handleSubmitImage}
          style={{ backgroundColor: "orange", color: "black" }}
          disabled={isSubmitting} // Disable the button while submitting
        >
          {isSubmitting ? "Submitting..." : "Next"}
        </Buttons>
      </div>
    </>
  );
};

export default SignatureSetup;
