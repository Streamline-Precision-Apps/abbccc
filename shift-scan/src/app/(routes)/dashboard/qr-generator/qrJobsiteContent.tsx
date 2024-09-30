"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import React, { useState, useEffect } from "react";
import { Modals } from "@/components/(reusable)/modals";
import QRCode from "qrcode";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Titles } from "@/components/(reusable)/titles";
import { Contents } from "@/components/(reusable)/contents";
import { Texts } from "@/components/(reusable)/texts";
import { Images } from "@/components/(reusable)/images";
import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { JobCodes } from "@/lib/types";
import SearchBar from "@/components/(search)/searchbar";
import SearchSelect from "@/components/(search)/searchSelect";
import { Selects } from "@/components/(reusable)/selects";
import { Options } from "@/components/(reusable)/options";

export default function QrJobsiteContent() {
  const [selectedJobSiteName, setSelectedJobSiteName] = useState<string>("");
  const [selectedJobSite, setSelectedJobSite] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generatedList, setGeneratedList] = useState<JobCodes[]>([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const router = useRouter();
  const t = useTranslations("QrJobsiteContent");

  const handleGenerate = async () => {
    if (selectedJobSite) {
      try {
        const url = await QRCode.toDataURL(selectedJobSite);
        setQrCodeUrl(url);
        setIsModalOpen(true);
      } catch (err) {
        console.error(err);
      }
    } else {
      console.log("No job site selected");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobsiteResponse = await fetch("/api/getJobsites");

        if (!jobsiteResponse.ok) {
          throw new Error("Failed to fetch job sites");
        }

        const jobSites = await jobsiteResponse.json();
        setGeneratedList(jobSites);
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // Set loading to false even if there is an error
      }
    };

    fetchData();
  }, []);

  const handleNew = () => {
    router.push("/dashboard/qr-generator/add-new-jobsite");
  };

  // Handle the selection from SearchSelect
  const handleSearchSelectChange = (selectedOption: JobCodes) => {
    setSelectedJobSite(selectedOption.qrId);
    setSelectedJobSiteName(selectedOption.name);
  };

  return (
    <>
      {loading ? (
        <Holds size={"first"}>
          <Selects>
            <Options>
              {t("Loading")}
            </Options>
          </Selects>
          <Holds position={"row"} size={"full"} className="justify-between items-center p-4">
            <Buttons background={"orange"} onClick={handleGenerate} size={"50"} className="p-4 mr-4">
              <Titles size={"h2"}>{t("Generate")}</Titles>
            </Buttons>
            <Buttons background={"green"} onClick={handleNew} size={"50"} className="p-4 ml-4">
              <Titles size={"h2"}>{t("New")}</Titles>
            </Buttons>
          </Holds>
        </Holds>
      ) : (
        <Holds size={"first"}>
          {/* Replace the old Selects component with the new SearchSelect */}
          <SearchSelect 
            datatype={"JobSite"} 
            options={generatedList} 
            onSelect={handleSearchSelectChange} // Pass the selection handler
          />

          <Holds position={"row"} size={"full"} className="justify-between items-center p-4">
            <Buttons background={"orange"} onClick={handleGenerate} size={"50"} className="p-4 mr-4">
              <Titles size={"h2"}>{t("Generate")}</Titles>
            </Buttons>
            <Buttons background={"green"} onClick={handleNew} size={"50"} className="p-4 ml-4">
              <Titles size={"h2"}>{t("New")}</Titles>
            </Buttons>
          </Holds>

          <Modals
            isOpen={isModalOpen}
            handleClose={() => setIsModalOpen(false)}
            size="sm"
          >
            {selectedJobSite && (
              <Holds className="p-4">
                <Texts>
                  {selectedJobSiteName} {t("QR Code")}
                </Texts>
                <Contents>
                  <Images titleImg={qrCodeUrl} titleImgAlt="QR Code" />
                </Contents>
              </Holds>
            )}
          </Modals>
        </Holds>
      )}
    </>
  );
}