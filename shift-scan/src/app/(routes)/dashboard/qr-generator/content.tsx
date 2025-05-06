"use client";
import { useTranslations } from "next-intl";
import "@/app/globals.css";
import { useState } from "react";
import { Holds } from "@/components/(reusable)/holds";
import { Grids } from "@/components/(reusable)/grids";
import { Contents } from "@/components/(reusable)/contents";
import QrJobsiteContent from "./qrJobsiteContent";
import QrEquipmentContent from "./qrEquipmentContent";
import { NewTab } from "@/components/(reusable)/newTabs";
import { Titles } from "@/components/(reusable)/titles";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Images } from "@/components/(reusable)/images";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { z } from "zod";
import Spinner from "@/components/(animations)/spinner";
import { Buttons } from "@/components/(reusable)/buttons";

const JobCodesSchema = z.object({
  id: z.string(),
  qrId: z.string(),
  name: z.string(),
});

type Option = {
  label: string;
  code: string;
};

// Zod schema for EquipmentCodes
const EquipmentCodesSchema = z.object({
  id: z.string(),
  qrId: z.string(),
  name: z.string(),
});

// Zod schema for equipment list response
const EquipmentListSchema = z.array(EquipmentCodesSchema);

// Zod schema for the jobsite list response
const JobsiteListSchema = z.array(JobCodesSchema);

type JobCodes = z.infer<typeof JobCodesSchema>;

type EquipmentCodes = z.infer<typeof EquipmentCodesSchema>;

export default function QRGeneratorContent() {
  const [activeTab, setActiveTab] = useState(1);
  const t = useTranslations("Generator");
  const router = useRouter();
  const searchParams = useSearchParams();
  const url = searchParams.get("returnUrl") || "/dashboard";
  const [loading, setLoading] = useState(false);
  const [generatedJobsiteList, setGeneratedJobsiteList] = useState<Option[]>(
    []
  );
  const [generatedEquipmentList, setGeneratedEquipmentList] = useState<
    Option[]
  >([]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [equipmentRes, jobsiteRes] = await Promise.all([
          fetch("/api/getEquipment"),
          fetch("/api/getJobsites"),
        ]);

        if (!equipmentRes.ok || !jobsiteRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const equipmentData = await equipmentRes.json();
        const jobsiteData = await jobsiteRes.json();
        try {
          JobsiteListSchema.parse(jobsiteData);
        } catch (error) {
          if (error instanceof z.ZodError) {
            console.error("Validation error in jobsite data:", error.errors);
            return;
          }
        }
        try {
          EquipmentListSchema.parse(equipmentData);
        } catch (error) {
          if (error instanceof z.ZodError) {
            console.error("Validation error in equipment data:", error.errors);
            return;
          }
        }
        setGeneratedEquipmentList(
          equipmentData.map((item: EquipmentCodes) => ({
            label: item.name.toUpperCase(),
            code: item.qrId.toUpperCase(),
          }))
        );

        setGeneratedJobsiteList(
          jobsiteData.map((item: JobCodes) => ({
            label: item.name.toUpperCase(),
            code: item.qrId.toUpperCase(),
          }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  return (
    <>
      <Holds
        background={"white"}
        className={`row-start-1 row-end-2 h-full ${
          loading ? "animate-pulse" : ""
        }`}
      >
        <TitleBoxes position={"row"} onClick={() => router.push(url)}>
          <Titles size={"h2"}>{t("QrGenerator")}</Titles>
          <Images
            src="/qr.svg"
            alt="Team"
            className="w-8 h-8"
            titleImg={""}
            titleImgAlt={""}
          />
        </TitleBoxes>
      </Holds>
      <Holds className="row-start-2 row-end-8 h-full">
        <Grids rows={"10"}>
          <Holds position={"row"} className="gap-x-1 h-fu">
            <NewTab
              onClick={() => setActiveTab(1)}
              isActive={activeTab === 1}
              isComplete={true}
              titleImage="/jobsite.svg "
              titleImageAlt=""
              animatePulse={loading}
            >
              <Titles size={"h2"}>{t("Jobsite")}</Titles>
            </NewTab>
            <NewTab
              onClick={() => setActiveTab(2)}
              isActive={activeTab === 2}
              isComplete={true}
              titleImage="/equipment.svg "
              titleImageAlt=""
              animatePulse={loading}
            >
              <Titles size={"h3"}>{t("EquipmentTitle")}</Titles>
            </NewTab>
          </Holds>
          <Holds
            background={"white"}
            className={`rounded-t-none row-span-9 h-full ${
              loading ? "animate-pulse" : ""
            }`}
          >
            {loading ? (
              <Contents width={"section"} className="py-5">
                <Grids rows={"7"} cols={"3"} gap={"5"}>
                  <Holds
                    background={"darkBlue"}
                    className="w-full h-full row-start-1 row-end-7 col-span-3 justify-center items-center "
                  >
                    <Spinner color={"border-app-white"} />
                  </Holds>
                  <Holds className="row-start-7 row-end-8 col-start-1 col-end-2 h-full">
                    <Buttons
                      background={"darkGray"}
                      disabled={true}
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
                    <Buttons background={"green"} disabled={true} />
                  </Holds>
                </Grids>
              </Contents>
            ) : (
              <Contents width={"section"} className="py-5">
                {activeTab === 1 && (
                  <QrJobsiteContent generatedList={generatedJobsiteList} />
                )}
                {activeTab === 2 && (
                  <QrEquipmentContent generatedList={generatedEquipmentList} />
                )}
              </Contents>
            )}
          </Holds>
        </Grids>
      </Holds>
    </>
  );
}
