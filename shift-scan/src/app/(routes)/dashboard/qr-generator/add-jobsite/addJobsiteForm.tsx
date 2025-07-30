"use client";
import { v4 as uuidv4 } from "uuid";
import React, { useState, useEffect } from "react";
import { Buttons } from "@/components/(reusable)/buttons";
import { createJobsite, jobExists } from "@/actions/jobsiteActions";
import { CheckBox } from "@/components/(inputs)/checkBox";
import { useTranslations } from "next-intl";
import { Inputs } from "@/components/(reusable)/inputs";
import { TextAreas } from "@/components/(reusable)/textareas";
import { useRouter } from "next/navigation";
import { Holds } from "@/components/(reusable)/holds";
import { Titles } from "@/components/(reusable)/titles";
import { Contents } from "@/components/(reusable)/contents";
import { Selects } from "@/components/(reusable)/selects";
import { Grids } from "@/components/(reusable)/grids";
import { StateOptions } from "@/data/stateValues";
import { useSession } from "next-auth/react";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";

export default function AddJobsiteForm() {
  const t = useTranslations("Generator");
  const { data: session } = useSession();
  const router = useRouter();
  const userId = session?.user.id;
  const [qrCode, setQrCode] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    code: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    temporaryJobsiteName: "",
    creationComment: "",
    creationReasoning: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form validation
  const isFormValid =
    formData.temporaryJobsiteName.trim() !== "" &&
    formData.creationComment.trim() !== "" &&
    formData.creationReasoning.trim() !== "" &&
    qrCode.trim() !== "" &&
    userId &&
    formData.address.trim() !== "" &&
    formData.code.trim() !== "" &&
    formData.city.trim() !== "" &&
    formData.state.trim() !== "" &&
    formData.zipCode.trim() !== "";

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Generate QR code on mount
  useEffect(() => {
    async function generateQrCode() {
      try {
        const result = uuidv4();
        setQrCode(result);
        const response = await jobExists(result);
        if (response) {
          setQrCode("");
          return generateQrCode();
        }
      } catch (error) {
        console.error("Failed to generate QR code:", error);
      }
    }
    generateQrCode();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || !userId) return;
    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      // Append all form data
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      formDataToSend.append("qrCode", qrCode);
      formDataToSend.append("createdById", userId);
      const response = await createJobsite(formDataToSend);
      if (response) {
        router.push("/dashboard/qr-generator");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Holds background={"white"} className="row-start-1 row-end-2 h-full">
        <TitleBoxes position={"row"} onClick={() => router.back()}>
          <Titles size={"h2"}>{t("NewJobsiteForm")}</Titles>
        </TitleBoxes>
      </Holds>
      <Holds background={"white"} className="row-start-2 row-end-8 h-full">
        <form onSubmit={handleSubmit} className="h-full w-full">
          <Contents width={"section"}>
            <Grids rows={"8"} gap={"5"} className="h-full w-full pb-5">
              {/* New Address Title and Checkbox */}

              {/* Address Section (conditionally rendered) */}

              <Holds className="row-start-1 row-end-3 h-full mt-4">
                {/* Client Name Input */}
                <Holds className="pb-3">
                  <Titles position={"left"} size={"h3"}>
                    {t("AddressInformation")}
                  </Titles>
                </Holds>

                <Holds className="pb-3">
                  <Inputs
                    type="text"
                    name="address"
                    value={formData.address}
                    placeholder={t("AddressInformation")}
                    className="text-xs pl-3 py-2"
                    onChange={handleInputChange}
                    required
                  />
                </Holds>

                <Holds className="pb-3">
                  <Inputs
                    type="text"
                    name="city"
                    value={formData.city}
                    placeholder={t("City")}
                    className="text-xs pl-3 py-2"
                    onChange={handleInputChange}
                    required
                  />
                </Holds>

                <Holds position={"row"} className="w-full pb-3 gap-x-3">
                  <Holds className="w-1/2">
                    <Selects
                      name="state"
                      value={formData.state}
                      className="text-xs py-2 text-center"
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select State</option>
                      {StateOptions.map((state) => (
                        <option key={state.value} value={state.value}>
                          {state.label}
                        </option>
                      ))}
                    </Selects>
                  </Holds>

                  <Holds className="w-1/2">
                    <Inputs
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      placeholder={t("ZipCode")}
                      className="text-xs py-2 text-center"
                      onChange={handleInputChange}
                      required
                    />
                  </Holds>
                </Holds>
              </Holds>

              {/* Creation Details Section */}
              <Holds
                background={"white"}
                className="row-start-4 row-end-6 h-full"
              >
                <Holds className="pb-3">
                  <Titles position={"left"} size={"h3"}>
                    {t("CreationDetails")}
                  </Titles>
                </Holds>

                <Holds className="pb-3">
                  <Inputs
                    type="text"
                    name="code"
                    value={formData.code}
                    placeholder={t("TemporaryJobsiteCode")}
                    className="text-xs pl-3 py-2"
                    onChange={handleInputChange}
                    required
                  />
                </Holds>

                <Holds className="pb-3">
                  <Inputs
                    type="text"
                    name="temporaryJobsiteName"
                    value={formData.temporaryJobsiteName}
                    placeholder={t("TemporaryJobsiteName")}
                    className="text-xs pl-3 py-2"
                    onChange={handleInputChange}
                    required
                  />
                </Holds>

                <Holds className="h-full pb-3">
                  <TextAreas
                    name="creationComment"
                    value={formData.creationComment}
                    placeholder={t("TemporaryJobsiteDescription")}
                    className="text-xs pl-3 h-full"
                    onChange={handleInputChange}
                    required
                  />
                </Holds>

                <Holds className="h-full pb-3">
                  <TextAreas
                    name="creationReasoning"
                    value={formData.creationReasoning}
                    placeholder={t("CreationReasoning")}
                    className="text-xs pl-3 h-full"
                    onChange={handleInputChange}
                    required
                  />
                </Holds>
              </Holds>

              {/* Submit Button */}
              <Holds className="row-start-10 row-end-11 h-full">
                <Buttons
                  background={isFormValid ? "green" : "darkGray"}
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                >
                  <Titles size={"h2"}>
                    {isSubmitting ? t("Submitting") : t("SubmitJobsite")}
                  </Titles>
                </Buttons>
              </Holds>
            </Grids>
          </Contents>
        </form>
      </Holds>
    </>
  );
}
