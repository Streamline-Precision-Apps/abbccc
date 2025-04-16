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
import { Titles } from "@/components/(reusable)/titles";
import { JobsiteSelector } from "@/components/(clock)/(General)/jobsiteSelector";
import NewCodeFinder from "@/components/(search)/newCodeFinder";

// Zod schema for JobCodes
const JobCodesSchema = z.object({
  id: z.string(),
  qrId: z.string(),
  name: z.string(),
});

type Option = {
  label: string;
  code: string;
};

// Zod schema for the jobsite list response
const JobsiteListSchema = z.array(JobCodesSchema);

type JobCodes = z.infer<typeof JobCodesSchema>;

export default function QrJobsiteContent() {
  const [selectedJobSite, setSelectedJobSite] = useState<Option | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generatedList, setGeneratedList] = useState<Option[]>([]);

  const [loading, setLoading] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const router = useRouter();
  const t = useTranslations("Generator");

  const handleGenerate = async () => {
    if (selectedJobSite) {
      try {
        const url = await QRCode.toDataURL(selectedJobSite.code);
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
        } catch (error) {
          if (error instanceof z.ZodError) {
            console.error("Validation error in job site data:", error.errors);
            return;
          }
        }
        setGeneratedList(
          jobSitesData.map((item: JobCodes) => ({
            label: item.name.toUpperCase(),
            code: item.qrId.toUpperCase(),
          }))
        );

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleNew = () => {
    router.push("/dashboard/qr-generator/add-jobsite");
  };

  const handleSearchSelectChange = (selectedOption: Option | null) => {
    if (selectedOption) {
      setSelectedJobSite({
        label: selectedOption.label,
        code: selectedOption.code,
      });
    } else {
      setSelectedJobSite(null);
      return;
    }
  };

  return (
    <Grids rows={"7"} gap={"5"} cols={"3"}>
      <Holds className="row-start-1 row-end-7 col-span-3 h-full">
        <NewCodeFinder
          options={generatedList}
          selectedOption={selectedJobSite}
          onSelect={handleSearchSelectChange}
          placeholder={t("TypeHere")}
          label="Select Job Site"
        />
      </Holds>
      <Holds className="row-start-7 row-end-8 col-start-1 col-end-2 h-full">
        <Buttons
          background={!selectedJobSite ? "darkGray" : "lightBlue"}
          disabled={!selectedJobSite}
          onClick={handleGenerate}
          className="w-full h-full justify-center items-center"
        >
          <Images
            src="/qr.svg"
            alt="Team"
            className="w-8 h-8 mx-auto"
            titleImg={""}
            titleImgAlt={""}
          />
        </Buttons>
      </Holds>
      <Holds
        size={"full"}
        className="row-start-7 row-end-8 col-start-2 col-end-4 h-full"
      >
        <Buttons background={"green"} onClick={handleNew}>
          <Titles size={"h4"}>{t("CreateNewJobsite")}</Titles>
        </Buttons>
      </Holds>

      <NModals
        isOpen={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        size={"xlWS"}
      >
        {selectedJobSite && (
          <>
            <Holds className="fixed rounded-[10px] p-2 bg-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col max-w-[75%] max-h-[75%] w-full h-auto">
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
  );
}
