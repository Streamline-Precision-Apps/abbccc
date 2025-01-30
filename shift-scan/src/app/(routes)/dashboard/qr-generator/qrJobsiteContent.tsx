"use client";

import { Buttons } from "@/components/(reusable)/buttons";
import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Images } from "@/components/(reusable)/images";
import { Holds } from "@/components/(reusable)/holds";
import SearchSelect from "@/components/(search)/searchSelect";
import { Grids } from "@/components/(reusable)/grids";
import { z } from "zod";
import { NModals } from "@/components/(reusable)/newmodals";

// Zod schema for JobCodes
const JobCodesSchema = z.object({
  id: z.string(),
  qrId: z.string(),
  name: z.string(),
});

// Zod schema for the jobsite list response
const JobsiteListSchema = z.array(JobCodesSchema);

type JobCodes = z.infer<typeof JobCodesSchema>;

export default function QrJobsiteContent() {
  const [selectedJobSite, setSelectedJobSite] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generatedList, setGeneratedList] = useState<JobCodes[]>([]);
  const [generatedRecentList, setGeneratedRecentList] = useState<JobCodes[]>(
    []
  );
  const [loading, setLoading] = useState(true);
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

        const jobSitesData = await jobsiteResponse.json();

        // Validate fetched job site data with Zod
        try {
          JobsiteListSchema.parse(jobSitesData);
          setGeneratedList(jobSitesData);
        } catch (error) {
          if (error instanceof z.ZodError) {
            console.error("Validation error in job site data:", error.errors);
            return;
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchRecentJobsites = async () => {
      try {
        const jobsiteResponse = await fetch("/api/getRecentJobsites");

        if (!jobsiteResponse.ok) {
          throw new Error("Failed to fetch recent job sites");
        }

        const recentJobSitesData = await jobsiteResponse.json();

        // Validate fetched recent job site data with Zod
        try {
          JobsiteListSchema.parse(recentJobSitesData);
          setGeneratedRecentList(recentJobSitesData);
        } catch (error) {
          if (error instanceof z.ZodError) {
            console.error(
              "Validation error in recent job site data:",
              error.errors
            );
            return;
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
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
              onSelect={handleSearchSelectChange}
            />
          </Holds>

          <Holds
            size={"full"}
            className="row-span-1 col-start-3 col-end-4 h-full"
          >
            <Buttons background={"green"} onClick={handleNew}>
              <Holds>
                <Images
                  titleImg={"/plus.svg"}
                  titleImgAlt={"plus"}
                  size={"50"}
                />
              </Holds>
            </Buttons>
          </Holds>
        </Grids>
      ) : (
        <Grids rows={"5"} gap={"5"} cols={"3"}>
          <Holds className="row-span-4 col-span-3 h-full">
            <SearchSelect
              loading={false}
              datatype={`${t("SearchForAJobSite")}`}
              options={generatedList}
              handleGenerate={handleGenerate}
              recentOptions={generatedRecentList}
              onSelect={handleSearchSelectChange}
            />
          </Holds>

          <Holds
            size={"full"}
            className="row-span-1 col-start-3 col-end-4 h-full"
          >
            <Buttons background={"green"} onClick={handleNew}>
              <Holds>
                <Images
                  titleImg={"/plus.svg"}
                  titleImgAlt={"plus"}
                  size={"40"}
                />
              </Holds>
            </Buttons>
          </Holds>

          <NModals
            isOpen={isModalOpen}
            handleClose={() => setIsModalOpen(false)}
            size={"xlWS"}
          >
            {selectedJobSite && (
              <>
                <Holds className="fixed rounded-[10px] p-4 bg-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col max-w-[90%] max-h-[90%] w-auto h-auto">
                  <Images
                    titleImg={qrCodeUrl}
                    titleImgAlt="QR Code"
                    className="h-full w-full object-contain"
                  />
                </Holds>
              </>
            )}
          </NModals>
        </Grids>
      )}
    </>
  );
}
