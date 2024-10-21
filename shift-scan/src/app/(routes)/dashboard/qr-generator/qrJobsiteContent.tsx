"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import React, { useState, useEffect } from "react";
import { Modals } from "@/components/(reusable)/modals";
import QRCode from "qrcode";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Images } from "@/components/(reusable)/images";
import { Holds } from "@/components/(reusable)/holds";
import { JobCodes } from "@/lib/types";
import SearchSelect from "@/components/(search)/searchSelect";
import { Grids } from "@/components/(reusable)/grids";

export default function QrJobsiteContent() {
  const [, setSelectedJobSiteName] = useState<string>("");
  const [selectedJobSite, setSelectedJobSite] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generatedList, setGeneratedList] = useState<JobCodes[]>([]);
  const [generatedRecentList, setGeneratedRecentList] = useState<JobCodes[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [, setQrCodeUrl] = useState("");

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
        <Grids rows={"5"} gap={"5"} cols={"3"}>
          <Holds className="row-span-4 col-span-3 h-full">
            <SearchSelect
              loading={true}
              datatype={`${t("Loading")}`}
              options={generatedList}
              handleGenerate={handleGenerate}
              recentOptions={generatedRecentList}
              onSelect={handleSearchSelectChange} // Pass the selection handler
            />
          </Holds>

          <Holds
            size={"full"}
            className="row-span-1 col-start-3 col-end-4 h-full"
          >
            <Buttons background={"green"} onClick={handleNew}>
              <Holds className="">
                <Images
                  titleImg={"/Plus.svg"}
                  titleImgAlt={"plus"}
                  size={"50"}
                />
              </Holds>
            </Buttons>
          </Holds>
        </Grids>
      ) : (
        <Grids rows={"5"} gap={"5"} cols={"3"}>
          <Holds className="row-span-4 col-span-3 h-full ">
            {/* Replace the old Selects component with the new SearchSelect */}
            <SearchSelect
              loading={false}
              datatype={`${t("SearchForAJobSite")}`}
              options={generatedList}
              handleGenerate={handleGenerate}
              recentOptions={generatedRecentList}
              onSelect={handleSearchSelectChange} // Pass the selection handler
            />
          </Holds>

          <Holds
            size={"full"}
            className="row-span-1 col-start-3 col-end-4 h-full"
          >
            <Buttons background={"green"} onClick={handleNew}>
              <Holds className="">
                <Images
                  titleImg={"/Plus.svg"}
                  titleImgAlt={"plus"}
                  size={"40"}
                />
              </Holds>
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
