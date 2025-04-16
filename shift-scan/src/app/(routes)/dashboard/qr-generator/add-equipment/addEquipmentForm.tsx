"use client";
import React, { useState, useEffect } from "react";
import { Buttons } from "@/components/(reusable)/buttons";
import {
  createEquipment,
  equipmentTagExists,
} from "@/actions/equipmentActions";
import { useTranslations } from "next-intl";
import { Inputs } from "@/components/(reusable)/inputs";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Selects } from "@/components/(reusable)/selects";
import { Titles } from "@/components/(reusable)/titles";
import { Holds } from "@/components/(reusable)/holds";
import { Contents } from "@/components/(reusable)/contents";
import { JobCode } from "@/lib/types";
import { Grids } from "@/components/(reusable)/grids";
import { StateOptions } from "@/data/stateValues";
import { v4 as uuidv4 } from "uuid";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { useRouter } from "next/navigation";

export default function AddEquipmentForm() {
  const [equipmentTag, setEquipmentTag] = useState("EQUIPMENT");
  const t = useTranslations("Generator");
  const [eqCode, setEQCode] = useState("");
  const [jobsites, setJobsites] = useState<JobCode[]>([]); // List of jobsites
  const [searchTerm, setSearchTerm] = useState(""); // Search term
  const [filteredJobsites, setFilteredJobsites] = useState<JobCode[]>([]); // Filtered results
  const [selectedJobsite, setSelectedJobsite] = useState<JobCode | null>(null); // Selected jobsite
  const [isJobsiteDropdownOpen, setIsJobsiteDropdownOpen] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
    zipCode: "",
    temporaryEquipmentName: "",
    creationComment: "",
    creationReasoning: "",
  });

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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setEquipmentTag(e.target.value);
  };

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      await createEquipment(formData);
      console.log(`${t("CreateSuccess")}`);
    } catch (error) {
      console.error(`${t("CreateError")}`, error);
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
            <Grids rows={"9"} gap={"5"} className="h-full w-full pb-5">
              {/* Address Section */}
              <Holds className="row-start-1 row-end-4 h-full">
                <Holds className="py-3">
                  <Titles position={"left"} size={"h3"}>
                    {t("EquipmentInfo")}
                  </Titles>
                </Holds>
              </Holds>

              {/* Creation Details Section */}
              <Holds
                background={"white"}
                className="row-start-4 row-end-9 h-full"
              >
                <Holds className="pb-5">
                  <Titles position={"left"} size={"h3"}>
                    {t("CreationDetails")}
                  </Titles>
                </Holds>
                <Holds className="pb-3">
                  <Inputs
                    type="text"
                    name="temporaryEquipmentName"
                    value={formData.temporaryEquipmentName}
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
              <Holds className="row-start-9 row-end-10 h-full">
                <Buttons
                  background={isFormValid ? "green" : "darkGray"}
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                >
                  <Titles size={"h2"}>
                    {isSubmitting ? t("Submitting...") : t("CreateEquipment")}
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
//
//     background={"white"}
//     className="w-full h-full overflow-y-auto no-scrollbar"
//   >
//     <Contents width={"section"}>
//       <Inputs name="qrId" type="text" value={eqCode} disabled hidden />
//       <Holds>
//         <Labels size={"p6"} htmlFor="equipmentTag">
//           {t("Tag")}
//           <span className="text-red-500">*</span>
//         </Labels>
//         <Selects
//           id="equipmentTag"
//           name="equipmentTag"
//           onChange={handleChange}
//           required
//           className="text-sm"
//         >
//           <Options value="">{t("Select")}</Options>
//           <Options value="TRUCK">{t("Truck")}</Options>
//           <Options value="VEHICLE">{t("Vehicle")}</Options>
//           <Options value="TRAILER">{t("Trailer")}</Options>
//           <Options value="EQUIPMENT">{t("Equipment")}</Options>
//         </Selects>
//       </Holds>
//       <Holds>
//         <Labels size={"p6"} htmlFor="name">
//           {t("Name")} <span className="text-red-500">*</span>
//         </Labels>
//         <Inputs
//           id="name"
//           name="name"
//           type="text"
//           placeholder={`${t("NamePlaceholder")}`}
//           required
//           pattern="^[A-Za-z0-9\s]+$"
//           className="text-sm"
//         />
//       </Holds>
//       <Holds>
//         <Labels size={"p4"} htmlFor="description">
//           {t("EquipmentDescription")}{" "}
//           <span className="text-red-500">*</span>
//         </Labels>
//         <TextAreas
//           id="description"
//           name="description"
//           placeholder={`${t("DescriptionPlaceholder")}`}
//           required
//           maxLength={40}
//           className="text-sm"
//         />
//       </Holds>

//       <Holds>
//         <Labels size={"p4"} htmlFor="equipmentStatus">
//           {t("Status")} <span className="text-red-500">*</span>
//         </Labels>
//         <Selects
//           id="equipmentStatus"
//           name="equipmentStatus"
//           onChange={handleChange}
//           required
//           className="text-sm"
//         >
//           <Options value="">{t("Select")}</Options>
//           <Options value="OPERATIONAL">{t("Operational")}</Options>
//           <Options value="NEEDS_REPAIR">{t("NeedsRepair")}</Options>
//           <Options value="NEEDS_MAINTENANCE">
//             {t("NeedsMaintenance")}
//           </Options>
//         </Selects>
//       </Holds>

//       {equipmentTag === "TRUCK" ||
//       equipmentTag === "TRAILER" ||
//       equipmentTag === "VEHICLE" ? (
//         <>
//           <Holds>
//             <Labels size={"p4"}>
//               {t("Make")} <span className="text-red-500">*</span>
//               <Inputs
//                 id="make"
//                 name="make"
//                 type="text"
//                 placeholder={`${t("MakePlaceholder")}`}
//                 required={
//                   equipmentTag === "TRUCK" || equipmentTag === "TRAILER"
//                     ? true
//                     : false
//                 }
//                 className="text-sm"
//               />
//             </Labels>
//           </Holds>

//           <Holds>
//             <Labels size={"p4"}>
//               {t("Model")} <span className="text-red-500">*</span>
//               <Inputs
//                 id="model"
//                 name="model"
//                 type="text"
//                 placeholder={`${t("ModelPlaceholder")}`}
//                 required={
//                   equipmentTag === "TRUCK" || equipmentTag === "TRAILER"
//                     ? true
//                     : false
//                 }
//                 className="text-sm"
//               />
//             </Labels>
//           </Holds>

//           <Holds>
//             <Labels size={"p4"}>
//               {t("Year")} <span className="text-red-500">*</span>
//               <Inputs
//                 id="year"
//                 name="year"
//                 type="number"
//                 min="1900"
//                 max="2099"
//                 defaultValue={new Date().getFullYear()}
//                 step="1"
//                 placeholder={`${t("YearPlaceholder")}`}
//                 required={
//                   equipmentTag === "TRUCK" || equipmentTag === "TRAILER"
//                     ? true
//                     : false
//                 }
//                 className="text-sm"
//               />
//             </Labels>
//           </Holds>

//           <Holds>
//             <Labels size={"p4"}>
//               {t("LicensePlate")} <span className="text-red-500">*</span>
//               <Inputs
//                 id="licensePlate"
//                 name="licensePlate"
//                 type="text"
//                 placeholder={`${t("LicensePlatePlaceholder")}`}
//                 required={
//                   equipmentTag === "TRUCK" || equipmentTag === "TRAILER"
//                     ? true
//                     : false
//                 }
//                 className="text-sm"
//               />
//             </Labels>
//           </Holds>

//           <Holds>
//             <Labels size={"p4"}>
//               {t("RegistrationExpiration")}{" "}
//               <span className="text-red-500">*</span>
//               <Inputs
//                 id="registrationExpiration"
//                 name="registrationExpiration"
//                 type="date"
//                 required={
//                   equipmentTag === "TRUCK" || equipmentTag === "TRAILER"
//                     ? true
//                     : false
//                 }
//                 className="text-sm"
//               />
//             </Labels>
//           </Holds>

//           <Holds>
//             <Labels size={"p4"}>
//               {t("Mileage")} <span className="text-red-500">*</span>
//               <Inputs
//                 id="mileage"
//                 name="mileage"
//                 type="number"
//                 placeholder={`${t("MileagePlaceholder")}`}
//                 required={
//                   equipmentTag === "TRUCK" || equipmentTag === "TRAILER"
//                     ? true
//                     : false
//                 }
//                 className="text-sm"
//               />
//             </Labels>
//           </Holds>
//         </>
//       ) : null}
//       <Holds background={"white"} className="my-5">
//         <Labels size={"p3"}>
//           {t("JobsiteLocation")} <span className="text-red-500">*</span>
//         </Labels>
//         <Holds>
//           <Inputs
//             type="text"
//             id="jobsiteLocation"
//             name="jobsiteLocation"
//             placeholder={t("SelectJobsite")}
//             value={selectedJobsite?.qrId}
//             onClick={() => setIsJobsiteDropdownOpen(true)}
//             readOnly
//           />
//         </Holds>

//         {/* Modal for jobsite dropdown */}
//         <NModals
//           size={"xlWS"}
//           isOpen={isJobsiteDropdownOpen}
//           handleClose={() => setIsJobsiteDropdownOpen(false)}
//           background={"white"}
//         >
//           <Holds className="w-full h-full ">
//             {/* Search Input */}

//             <Inputs
//               type="text"
//               id="jobsiteSearch"
//               name="jobsiteSearch"
//               placeholder={t("SearchJobsite")}
//               className="p-2 border rounded w-full"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />

//             {/* Filtered Results */}
//             {filteredJobsites.length > 0 && (
//               <Holds className=" rounded-[10px] w-full  overflow-y-auto no-scrollbar p-4 gap-5">
//                 {filteredJobsites.map((jobCode: JobCode) => (
//                   <Buttons
//                     key={jobCode.id}
//                     type="button"
//                     onClick={() => {
//                       selectJobsite(jobCode);
//                       setIsJobsiteDropdownOpen(false);
//                     }}
//                     className="py-2"
//                   >
//                     {jobCode.name}
//                   </Buttons>
//                 ))}
//               </Holds>
//             )}
//           </Holds>
//         </NModals>
//       </Holds>
//       <Inputs id="qrId" name="qrId" type="hidden" value={eqCode} />
//       <Holds className="pb-5 ">
//         <Buttons background={"green"} type="submit" className="py-3">
//           <Titles size={"h3"}>{t("CreateNew")}</Titles>
//         </Buttons>
//       </Holds>
//     </Contents>
//   </Holds>
// </Forms>
