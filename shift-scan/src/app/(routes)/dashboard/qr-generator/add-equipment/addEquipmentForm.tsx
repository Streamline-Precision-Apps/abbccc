"use client";
import React, { useState, useEffect, useRef } from "react";
import { Buttons } from "@/components/(reusable)/buttons";
import {
  createEquipment,
  equipmentTagExists,
} from "@/actions/equipmentActions";
import { useTranslations } from "next-intl";
import { Inputs } from "@/components/(reusable)/inputs";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Selects } from "@/components/(reusable)/selects";
import { NModals } from '@/components/(reusable)/newmodals';
import { JobsiteSelector } from '@/components/(clock)/(General)/jobsiteSelector';
import { Titles } from "@/components/(reusable)/titles";
import { Holds } from "@/components/(reusable)/holds";
import { Contents } from "@/components/(reusable)/contents";
import { JobCode } from "@/lib/types";
import { Grids } from "@/components/(reusable)/grids";
import { v4 as uuidv4 } from "uuid";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Texts } from "@/components/(reusable)/texts";
import { Images } from "@/components/(reusable)/images";

export default function AddEquipmentForm() {
  const t = useTranslations("Generator");
  const { data: session } = useSession();
  const router = useRouter();
  const userId = session?.user.id;
  const [eqCode, setEQCode] = useState("");
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Always initialize as arrays
  const [jobsites, setJobsites] = useState<JobCode[]>([]);
  const [filteredJobsites, setFilteredJobsites] = useState<JobCode[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValidation, setFormValidation] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    equipmentTag: '',
    make: '',
    model: '',
    year: '',
    licensePlate: '',
    registration: '',
    mileage: '',
    temporaryEquipmentName: '',
    creationComment: '',
    creationReasoning: '',
    jobsiteLocation: '',
  });

  // Modal state for jobsite selector
  const [jobsiteModalOpen, setJobsiteModalOpen] = useState(false);
  const [selectedJobsite, setSelectedJobsite] = useState<{ id: string; name: string } | null>(null);

  // Replace your current validation constants with this function
  const validateForm = () => {
    if (formData.equipmentTag === "EQUIPMENT") {
      return formData.equipmentTag.trim() !== "" &&
        formData.temporaryEquipmentName.trim() !== "" &&
        formData.creationReasoning.trim() !== "" &&
        formData.jobsiteLocation.trim() !== "" &&
        eqCode.trim() !== "" &&
        userId
        ? true
        : false;
    } else if (
      formData.equipmentTag === "TRUCK" ||
      formData.equipmentTag === "VEHICLE"
    ) {
      return formData.equipmentTag.trim() !== "" &&
        formData.make.trim() !== "" &&
        formData.model.trim() !== "" &&
        formData.year.trim() !== "" &&
        formData.licensePlate.trim() !== "" &&
        formData.registration.trim() !== "" &&
        formData.mileage.trim() !== "" &&
        formData.temporaryEquipmentName.trim() !== "" &&
        formData.creationReasoning.trim() !== "" &&
        formData.jobsiteLocation.trim() !== "" &&
        eqCode.trim() !== "" &&
        userId
        ? true
        : false;
    }
    return false;
  };

  // Update validation whenever form data changes
  useEffect(() => {
    setFormValidation(validateForm());
  }, [formData, eqCode, userId]);

  useEffect(() => {
    async function generateQrCode() {
      try {
        const result = uuidv4();
        setEQCode(result);
        const response = await equipmentTagExists(result);
        if (response) {
          setEQCode("");
          return generateQrCode();
        }
      } catch (error) {
        console.error(`${t("GenerateError")}`, error);
      }
    }
    generateQrCode();
  }, [t]);

  useEffect(() => {
    const fetchJobsites = async () => {
      try {
        const jobsitesRes = await fetch("/api/getAllJobsites");
        const jobsites = await jobsitesRes.json();
        setJobsites(jobsites as JobCode[]);
        setFilteredJobsites(jobsites);
      } catch (error) {
        console.error(`${t("CreateError")}`, error);
      }
    };
    fetchJobsites();
  }, [t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formValidation || !userId) return;

    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      formDataToSend.append("eqCode", eqCode);
      formDataToSend.append("createdById", userId || "");

      const response = await createEquipment(formDataToSend);
      if (!response.success) {
        return;
      }

      router.push("/dashboard/qr-generator");
    } catch (error) {
      console.error(`${t("CreateError")}`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const handleRegistrationClick = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  };

  return (
    <>
      <Holds background="white" className="row-start-1 row-end-2 h-full">
        <TitleBoxes onClick={() => router.back()}>
          <Titles size={"h2"}>{t("NewEquipmentForm")}</Titles>
        </TitleBoxes>
      </Holds>
      <Holds background="white" className="row-start-2 row-end-8 h-full">
        <form onSubmit={handleSubmit} className="h-full w-full">
          <Contents width={"section"}>
            <Grids rows={"8"} gap={"5"} className="h-full w-full pb-5">
              {/* Address Section */}
              <Holds className="row-start-1 row-end-5 h-full">
                <Holds className="py-3">
                  <Holds className="pb-3">
                    <Titles position={"left"} size={"h3"}>
                      {t("EquipmentInfo")}
                    </Titles>
                  </Holds>
                  <Holds className="pb-3">
                    <Selects
                      value={formData.equipmentTag}
                      onChange={handleInputChange}
                      name="equipmentTag"
                      className={`text-xs text-center h-full py-2 ${
                        formData.equipmentTag === "" && "text-app-dark-gray"
                      }`}
                    >
                      <option value="" disabled>
                        {t("SelectEquipmentType")}
                      </option>
                      <option value="VEHICLE">{t("Vehicle")}</option>
                      <option value="TRUCK">{t("Truck")}</option>
                      <option value="EQUIPMENT">{t("Equipment")}</option>
                    </Selects>
                  </Holds>
                  {(formData.equipmentTag === "TRUCK" ||
                    formData.equipmentTag === "VEHICLE") && (
                    <>
                      <Holds position={"row"} className="pb-3 gap-x-2">
                        <Holds className="w-1/2">
                          <Inputs
                            type="text"
                            name="make"
                            value={formData.make}
                            placeholder={t("Make")}
                            className="text-xs pl-3 py-2"
                            onChange={handleInputChange}
                            required
                          />
                        </Holds>
                        <Holds className="w-1/2">
                          <Inputs
                            type="text"
                            name="model"
                            value={formData.model}
                            placeholder={t("Model")}
                            className="text-xs pl-3 py-2"
                            onChange={handleInputChange}
                            required
                          />
                        </Holds>
                      </Holds>
                      <Holds position={"row"} className="pb-3 gap-x-2">
                        <Holds className="w-1/2">
                          <Inputs
                            type="number"
                            name="year"
                            min="1900"
                            max={new Date().getFullYear()}
                            value={formData.year}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value.length <= 4) {
                                handleInputChange(e);
                              }
                            }}
                            placeholder={t("Year")}
                            className="text-xs pl-3 py-2"
                            required
                          />
                        </Holds>
                        <Holds className="w-1/2">
                          <Inputs
                            type="text"
                            name="licensePlate"
                            value={formData.licensePlate}
                            placeholder={t("LicensePlate")}
                            className="text-xs pl-3 py-2"
                            onChange={handleInputChange}
                            required
                          />
                        </Holds>
                      </Holds>
                      <Holds position={"row"} className="w-full gap-x-2">
                        <Holds className="w-1/2 h-full relative">
                          {/* Date Input - Hidden visually but still functional */}
                          <input
                            type="date"
                            name="registration"
                            value={formData.registration}
                            onChange={handleInputChange}
                            ref={dateInputRef}
                            required
                            className="absolute opacity-0 w-full h-full" // Hide visually but remain clickable
                          />
                          {/* Custom Date Picker UI */}
                          <Holds
                            background={"white"}
                            position={"row"}
                            onClick={() => handleRegistrationClick()}
                            className="w-full h-full px-3 border-black border-[3px] flex items-center justify-between relative "
                          >
                            <Texts size={"p7"} className="text-app-dark-gray ">
                              {formData.registration
                                ? new Date(
                                    formData.registration
                                  ).toLocaleDateString()
                                : t("Registration")}
                            </Texts>
                            <img
                              className="w-4 h-4"
                              src={"/calendar.svg"}
                              alt={"Calendar Icon"}
                            />
                          </Holds>
                        </Holds>
                        <Holds className="w-1/2 h-full">
                          <Inputs
                            type="text"
                            name="mileage"
                            value={formData.mileage}
                            placeholder={t("Mileage")}
                            className="text-xs pl-3 py-2"
                            onChange={handleInputChange}
                            required
                          />
                        </Holds>
                      </Holds>
                    </>
                  )}
                </Holds>
              </Holds>

              {/* Creation Details Section */}
              <Holds className="row-start-5 row-end-8 h-full">
                <Holds className="pb-3">
                  <Titles position={"left"} size={"h3"}>
                    {t("CreationDetails")}
                  </Titles>
                </Holds>
                <Holds className="pb-3">
                  <Inputs
                    type="text"
                    name="temporaryEquipmentName"
                    value={formData.temporaryEquipmentName}
                    placeholder={t("TemporaryEquipmentName")}
                    className="text-xs pl-3 py-2"
                    onChange={handleInputChange}
                    required
                  />
                </Holds>

                <Holds className="pb-3">
                  <Inputs
                    type="text"
                    name="jobsiteLocation"
                    value={selectedJobsite?.name || ''}
                    placeholder={t('SelectJobSite')}
                    className="text-xs text-center h-full py-2 cursor-pointer"
                    onClick={() => setJobsiteModalOpen(true)}
                    readOnly
                    required
                  />
                </Holds>

                {/* Jobsite Selector Modal */}
                <NModals
                  background="white"
                  size="xlW"
                  isOpen={jobsiteModalOpen}
                  handleClose={() => setJobsiteModalOpen(false)}
                >
                  <Holds background="white" className="w-full h-full p-2">
                    <JobsiteSelector
                      useJobSiteId={true}
                      onJobsiteSelect={(jobsite) => {
                        if (jobsite) {
                          setSelectedJobsite({ id: jobsite.code, name: jobsite.label });
                          setFormData((prev) => ({
                            ...prev,
                            jobsiteLocation: jobsite.code,
                          }));
                        }
                        setJobsiteModalOpen(false);
                      }}
                      initialValue={
                        selectedJobsite
                          ? { id: selectedJobsite.id, code: selectedJobsite.id, label: selectedJobsite.name }
                          : undefined
                      }
                    />
                  </Holds>
                </NModals>

                <Holds className="h-full pb-3">
                  <TextAreas
                    name="creationReasoning"
                    value={formData.creationReasoning}
                    placeholder={t("EQCreationReasoning")}
                    className="text-xs pl-3 h-full"
                    onChange={handleInputChange}
                    required
                  />
                </Holds>
              </Holds>

              {/* Submit Button */}
              <Holds className="row-start-8 row-end-9 h-full">
                <Buttons
                  background={formValidation ? "green" : "darkGray"}
                  type="submit"
                  disabled={!formValidation || isSubmitting}
                >
                  <Titles size={"h2"}>
                    {isSubmitting ? t("Submitting") : t("CreateEquipment")}
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
