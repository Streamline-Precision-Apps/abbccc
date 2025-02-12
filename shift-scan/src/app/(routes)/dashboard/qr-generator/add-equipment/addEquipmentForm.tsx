"use client";
import React, { useState, useEffect, SetStateAction, Dispatch } from "react";
import { Buttons } from "@/components/(reusable)/buttons";
import {
  createEquipment,
  equipmentTagExists,
} from "@/actions/equipmentActions";
import { useTranslations } from "next-intl";
import { Forms } from "@/components/(reusable)/forms";
import { Inputs } from "@/components/(reusable)/inputs";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Labels } from "@/components/(reusable)/labels";
import { Selects } from "@/components/(reusable)/selects";
import { Options } from "@/components/(reusable)/options";
import { Titles } from "@/components/(reusable)/titles";
import { Holds } from "@/components/(reusable)/holds";
import { Contents } from "@/components/(reusable)/contents";
import { JobCode } from "@/lib/types";
import { NModals } from "@/components/(reusable)/newmodals";

type AddEquipmentFormProps = {
  handler: () => void;
  setBanner: Dispatch<SetStateAction<boolean>>;
  setBannerText: Dispatch<SetStateAction<string>>;
};

export default function AddEquipmentForm({
  setBannerText,
  handler,
  setBanner,
}: AddEquipmentFormProps) {
  const [equipmentTag, setEquipmentTag] = useState("EQUIPMENT");
  const t = useTranslations("Generator");
  const [eqCode, setEQCode] = useState("");
  const [jobsites, setJobsites] = useState<JobCode[]>([]); // List of jobsites
  const [searchTerm, setSearchTerm] = useState(""); // Search term
  const [filteredJobsites, setFilteredJobsites] = useState<JobCode[]>([]); // Filtered results
  const [selectedJobsite, setSelectedJobsite] = useState<JobCode | null>(null); // Selected jobsite
  const [isJobsiteDropdownOpen, setIsJobsiteDropdownOpen] = useState(false);

  const randomQrCode = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "EQ-TEMP-";
    for (let i = 0; i < 5; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    console.log(result);
    return result;
  };

  useEffect(() => {
    async function generateQrCode() {
      try {
        const result = randomQrCode();
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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setEquipmentTag(e.target.value);
  };

  function handleRoute() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      setBanner(false);
      setBannerText("");
      window.history.back();
    }, 1000);
  }

  useEffect(() => {
    const fetchJobsites = async () => {
      try {
        const jobsitesRes = await fetch("/api/getAllJobsites");
        const jobsites = await jobsitesRes.json();
        setJobsites(jobsites as JobCode[]);
        setFilteredJobsites(jobsites); // Initialize with all jobsites
      } catch (error) {
        console.error(`${t("CreateError")}`, error);
      }
    };
    fetchJobsites();
  }, [t]);

  useEffect(() => {
    // Filter jobsites based on search term
    const filtered = jobsites.filter((job) =>
      job.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredJobsites(filtered);
  }, [searchTerm, jobsites]);

  const selectJobsite = (jobCode: JobCode) => {
    setSelectedJobsite(jobCode);
    setSearchTerm(jobCode.name); // Set input value to the selected jobsite name
    setFilteredJobsites([]); // Hide the dropdown
  };

  return (
    <Forms
      action={createEquipment}
      onSubmit={() => {
        setBanner(true);
        setBannerText(`${t("Banner-Text")}`);
        handler();
        handleRoute();
      }}
      className="w-full h-full py-5"
    >
      <Holds
        background={"white"}
        className="w-full h-full overflow-y-auto no-scrollbar"
      >
        <Contents width={"section"}>
          <Inputs name="qrId" type="text" value={eqCode} disabled hidden />
          <Holds>
            <Labels size={"p6"} htmlFor="equipmentTag">
              {t("Tag")}
              <span className="text-red-500">*</span>
            </Labels>
            <Selects
              id="equipmentTag"
              name="equipmentTag"
              onChange={handleChange}
              required
              className="text-sm"
            >
              <Options value="">{t("Select")}</Options>
              <Options value="TRUCK">{t("Truck")}</Options>
              <Options value="VEHICLE">{t("Vehicle")}</Options>
              <Options value="TRAILER">{t("Trailer")}</Options>
              <Options value="EQUIPMENT">{t("Equipment")}</Options>
            </Selects>
          </Holds>
          <Holds>
            <Labels size={"p6"} htmlFor="name">
              {t("Name")} <span className="text-red-500">*</span>
            </Labels>
            <Inputs
              id="name"
              name="name"
              type="text"
              placeholder={`${t("NamePlaceholder")}`}
              required
              pattern="^[A-Za-z0-9\s]+$"
              className="text-sm"
            />
          </Holds>
          <Holds>
            <Labels size={"p4"} htmlFor="description">
              {t("EquipmentDescription")}{" "}
              <span className="text-red-500">*</span>
            </Labels>
            <TextAreas
              id="description"
              name="description"
              placeholder={`${t("DescriptionPlaceholder")}`}
              required
              maxLength={40}
              className="text-sm"
            />
          </Holds>

          <Holds>
            <Labels size={"p4"} htmlFor="equipmentStatus">
              {t("Status")} <span className="text-red-500">*</span>
            </Labels>
            <Selects
              id="equipmentStatus"
              name="equipmentStatus"
              onChange={handleChange}
              required
              className="text-sm"
            >
              <Options value="">{t("Select")}</Options>
              <Options value="OPERATIONAL">{t("Operational")}</Options>
              <Options value="NEEDS_REPAIR">{t("NeedsRepair")}</Options>
              <Options value="NEEDS_MAINTENANCE">
                {t("NeedsMaintenance")}
              </Options>
            </Selects>
          </Holds>

          {equipmentTag === "TRUCK" ||
          equipmentTag === "TRAILER" ||
          equipmentTag === "VEHICLE" ? (
            <>
              <Holds>
                <Labels size={"p4"}>
                  {t("Make")} <span className="text-red-500">*</span>
                  <Inputs
                    id="make"
                    name="make"
                    type="text"
                    placeholder={`${t("MakePlaceholder")}`}
                    required={
                      equipmentTag === "TRUCK" || equipmentTag === "TRAILER"
                        ? true
                        : false
                    }
                    className="text-sm"
                  />
                </Labels>
              </Holds>

              <Holds>
                <Labels size={"p4"}>
                  {t("Model")} <span className="text-red-500">*</span>
                  <Inputs
                    id="model"
                    name="model"
                    type="text"
                    placeholder={`${t("ModelPlaceholder")}`}
                    required={
                      equipmentTag === "TRUCK" || equipmentTag === "TRAILER"
                        ? true
                        : false
                    }
                    className="text-sm"
                  />
                </Labels>
              </Holds>

              <Holds>
                <Labels size={"p4"}>
                  {t("Year")} <span className="text-red-500">*</span>
                  <Inputs
                    id="year"
                    name="year"
                    type="number"
                    min="1900"
                    max="2099"
                    defaultValue={new Date().getFullYear()}
                    step="1"
                    placeholder={`${t("YearPlaceholder")}`}
                    required={
                      equipmentTag === "TRUCK" || equipmentTag === "TRAILER"
                        ? true
                        : false
                    }
                    className="text-sm"
                  />
                </Labels>
              </Holds>

              <Holds>
                <Labels size={"p4"}>
                  {t("LicensePlate")} <span className="text-red-500">*</span>
                  <Inputs
                    id="licensePlate"
                    name="licensePlate"
                    type="text"
                    placeholder={`${t("LicensePlatePlaceholder")}`}
                    required={
                      equipmentTag === "TRUCK" || equipmentTag === "TRAILER"
                        ? true
                        : false
                    }
                    className="text-sm"
                  />
                </Labels>
              </Holds>

              <Holds>
                <Labels size={"p4"}>
                  {t("RegistrationExpiration")}{" "}
                  <span className="text-red-500">*</span>
                  <Inputs
                    id="registrationExpiration"
                    name="registrationExpiration"
                    type="date"
                    required={
                      equipmentTag === "TRUCK" || equipmentTag === "TRAILER"
                        ? true
                        : false
                    }
                    className="text-sm"
                  />
                </Labels>
              </Holds>

              <Holds>
                <Labels size={"p4"}>
                  {t("Mileage")} <span className="text-red-500">*</span>
                  <Inputs
                    id="mileage"
                    name="mileage"
                    type="number"
                    placeholder={`${t("MileagePlaceholder")}`}
                    required={
                      equipmentTag === "TRUCK" || equipmentTag === "TRAILER"
                        ? true
                        : false
                    }
                    className="text-sm"
                  />
                </Labels>
              </Holds>
            </>
          ) : null}
          <Holds background={"white"} className="my-5">
            <Labels size={"p3"}>
              {t("JobsiteLocation")} <span className="text-red-500">*</span>
            </Labels>
            <Holds>
              <Inputs
                type="text"
                id="jobsiteLocation"
                name="jobsiteLocation"
                placeholder={t("SelectJobsite")}
                value={selectedJobsite?.qrId}
                onClick={() => setIsJobsiteDropdownOpen(true)}
                readOnly
              />
            </Holds>

            {/* Modal for jobsite dropdown */}
            <NModals
              size={"xlWS"}
              isOpen={isJobsiteDropdownOpen}
              handleClose={() => setIsJobsiteDropdownOpen(false)}
              background={"white"}
            >
              <Holds className="w-full h-full ">
                {/* Search Input */}

                <Inputs
                  type="text"
                  id="jobsiteSearch"
                  name="jobsiteSearch"
                  placeholder={t("SearchJobsite")}
                  className="p-2 border rounded w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                {/* Filtered Results */}
                {filteredJobsites.length > 0 && (
                  <Holds className=" rounded-[10px] w-full  overflow-y-auto no-scrollbar p-4 gap-5">
                    {filteredJobsites.map((jobCode: JobCode) => (
                      <Buttons
                        key={jobCode.id}
                        type="button"
                        onClick={() => {
                          selectJobsite(jobCode);
                          setIsJobsiteDropdownOpen(false);
                        }}
                        className="py-2"
                      >
                        {jobCode.name}
                      </Buttons>
                    ))}
                  </Holds>
                )}
              </Holds>
            </NModals>
          </Holds>
          <Inputs id="qrId" name="qrId" type="hidden" value={eqCode} />
          <Holds className="pb-5 ">
            <Buttons background={"green"} type="submit" className="py-3">
              <Titles size={"h3"}>{t("CreateNew")}</Titles>
            </Buttons>
          </Holds>
        </Contents>
      </Holds>
    </Forms>
  );
}
