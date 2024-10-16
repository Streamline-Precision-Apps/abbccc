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
import { Grids } from "@/components/(reusable)/grids";
import { log } from "console";

export default function QrJobsiteContent() {
  const [selectedJobSiteName, setSelectedJobSiteName] = useState<string>("");
  const [selectedJobSite, setSelectedJobSite] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generatedList, setGeneratedList] = useState<JobCodes[]>([]);
  const [generatedRecentList, setGeneratedRecentList] = useState<JobCodes[]>(
    []
  );
  const [loading, setLoading] = useState(true); // Loading state
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const router = useRouter();
  const t = useTranslations("Generator");

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

  useEffect(() => {
    const fetchRecentJobsites = async () => {
      try {
        const jobsiteResponse = await fetch("/api/getRecentJobsites");

        if (!jobsiteResponse.ok) {
          throw new Error("Failed to fetch Jobsites");
        }

        const jobSites = await jobsiteResponse.json();
        setGeneratedRecentList(jobSites);
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // Set loading to false even if there is an error
      }
    };

    fetchRecentJobsites();
  }, []);

  const handleNew = () => {
    router.push("/dashboard/qr-generator/add-jobsite");
  };

  // Handle the selection from SearchSelect
  const handleSearchSelectChange = (selectedOption: JobCodes) => {
    setSelectedJobSite(selectedOption.qrId);
    setSelectedJobSiteName(selectedOption.name);
  };

  return (
    <>
      {loading ? (
        <Grids rows={"5"} gap={"5"} cols={"2"}>
          <Holds className="row-span-4 col-span-2 h-full">
            <SearchSelect
              datatype={`${t("Loading")}`}
              options={generatedList}
              recentOptions={generatedRecentList}
              onSelect={handleSearchSelectChange} // Pass the selection handler
            />
          </Holds>
          <Holds size={"full"} className="row-span-1 col-span-1 h-full">
            <Buttons background={"orange"} onClick={handleGenerate}>
              <Titles size={"h2"}>{t("Generate")}</Titles>
            </Buttons>
          </Holds>
          <Holds size={"full"} className="row-span-1 col-span-1 h-full">
            <Buttons background={"green"} onClick={handleNew}>
              <Titles size={"h2"}>{t("New")}</Titles>
            </Buttons>
          </Holds>
        </Grids>
      ) : (
        <Grids rows={"5"} gap={"5"} cols={"2"}>
          <Holds className="row-span-4 col-span-2 h-full ">
            {/* Replace the old Selects component with the new SearchSelect */}
            <SearchSelect
              datatype={`${t("SearchForAJobSite")}`}
              options={generatedList}
              recentOptions={generatedRecentList}
              onSelect={handleSearchSelectChange} // Pass the selection handler
            />
          </Holds>
          <Holds size={"full"} className="row-span-1 col-span-1 h-full">
            <Buttons background={"orange"} onClick={handleGenerate}>
              <Titles size={"h2"}>{t("Generate")}</Titles>
            </Buttons>
          </Holds>
          <Holds size={"full"} className="row-span-1 col-span-1 h-full">
            <Buttons background={"green"} onClick={handleNew}>
              <Titles size={"h2"}>{t("New")}</Titles>
            </Buttons>
          </Holds>
          <Modals
            isOpen={isModalOpen}
            handleClose={() => setIsModalOpen(false)}
            size="sm"
            className=""
          >
            {/* {selectedJobSite && (
              <Holds className="p-4 absolute  ">
                <Texts>
                  {selectedJobSiteName} {t("QR Code")}
                </Texts>
                <Contents>
                  <Images titleImg={qrCodeUrl} titleImgAlt="QR Code" />
                </Contents>
              </Holds>
            )} */}
          </Modals>
        </Grids>
      )}
    </>
  );
}
