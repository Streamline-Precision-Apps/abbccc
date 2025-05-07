"use client";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Tab } from "@/components/(reusable)/tab";

import { useEffect, useState } from "react";
import { Equipment, Jobsite, costCodes, CCTags } from "@/lib/types";
import { z } from "zod";
import { EquipmentComponent } from "./_components/EquipmentComponent";
import { JobsiteComponent } from "./_components/JobsiteComponent";
import { CostCodeComponent } from "./_components/CostCodeComponent";
import { Buttons } from "@/components/(reusable)/buttons";
import { TagsComponent } from "./_components/TagsComponent";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { NotificationComponent } from "@/components/(inputs)/NotificationComponent";
import { NewTab } from "@/components/(reusable)/newTabs";

export default function Search() {
  const [activeTab, setActiveTab] = useState(1);
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [jobsites, setJobsites] = useState<Jobsite[]>([]);
  const [costCodes, setCostCodes] = useState<costCodes[]>([]);
  const [tags, setTags] = useState<CCTags[]>([]);
  const [activeTab2, setActiveTab2] = useState(1);
  const [filter, setFilter] = useState("all");
  const pathname = usePathname();
  const [triggeredPath, setTrigger] = useState(0);
  const [triggeredPathEquipment, setTriggerEquipment] = useState(0);

  const t = useTranslations("Admins");

  useEffect(() => {
    if (
      pathname === "/admins/assets" ||
      pathname === "admins/assets/new-equipment"
    ) {
      setTriggerEquipment((prev) => prev + 1); // Increment the counter
    }
  }, [pathname]);

  useEffect(() => {
    if (pathname === "/admins/assets/cost-code") {
      setTrigger((prev) => prev + 1); // Increment the counter
    }
  }, [pathname]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tagsRes = await fetch("/api/getAllTags");
        const tagsData = await tagsRes.json();
        setTags(tagsData);
      } catch (error) {
        console.error(`${t("FailedToFetch")} ${t("tags data")}:"`, error);
      }
    };
    fetchTags();
  }, [filter, t]);

  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        const equipmentsRes = await fetch(
          "/api/getAllEquipment?filter=" + filter // Corrected path
        );

        if (!equipmentsRes.ok) {
          throw new Error(`${t("HTTPError")}: ${equipmentsRes.status}`);
        }

        const contentType = equipmentsRes.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const equipmentsData = await equipmentsRes.json();
          setEquipments(equipmentsData);
        } else {
          const html = await equipmentsRes.text();
          console.error(
            `${t("RecievedHTMLInsteadOfJSON")}`,
            html.substring(0, 100)
          );
        }
      } catch (error) {
        console.error(`${t("FailedToFetch")} ${t("EquipmentData")}:`, error);
      }
    };

    fetchEquipments();
  }, [filter, t, triggeredPathEquipment]);

  useEffect(() => {
    const fetchJobsites = async () => {
      try {
        const jobsitesRes = await fetch("/api/getAllJobsites?filter=" + filter);
        const jobsitesData = await jobsitesRes.json();
        // const validatedJobsites = jobsitesSchema.parse(jobsitesData);
        setJobsites(jobsitesData);
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error(t("ValidationError"), error.errors);
        } else {
          console.error(`${t("FailedToFetch")} ${t("JobsiteData")}:`, error);
        }
      }
    };

    fetchJobsites();
  }, [filter, t]);

  useEffect(() => {
    const fetchCostCodes = async () => {
      try {
        const costCodesRes = await fetch("/api/getAllCostCodes", {
          next: { revalidate: 0, tags: ["costcodes"] },
        });
        const costCodesData = await costCodesRes.json();
        // const validatedCostCodes = costCodesSchema.parse(costCodesData);
        setCostCodes(costCodesData);
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error(t("ValidationError"), error.errors);
        } else {
          console.error(`${t("FailedToFetch")} ${t("CostCodeData")}:`, error);
        }
      }
    };

    fetchCostCodes();
  }, [filter, t, triggeredPath]);

  return (
    <Holds className="h-full ">
      <NotificationComponent />
      <Grids rows={"10"}>
        <Holds position={"row"} className="row-span-1 h-full gap-1">
          <NewTab
            onClick={() => setActiveTab(1)}
            isActive={activeTab === 1}
            isComplete={true}
            titleImage="/broken.svg"
            titleImageAlt=""
          >
            {t("Equipment")}
          </NewTab>
          <NewTab
            onClick={() => setActiveTab(2)}
            isActive={activeTab === 2}
            isComplete={true}
            titleImage="/jobsite.svg"
            titleImageAlt=""
          >
            {t("JobSite")}
          </NewTab>
          <NewTab
            onClick={() => setActiveTab(3)}
            isActive={activeTab === 3}
            isComplete={true}
            titleImage="/form.svg"
            titleImageAlt=""
          >
            {t("CostCodes")}
          </NewTab>
        </Holds>

        <Holds
          background={"white"}
          className="rounded-t-none row-span-9 h-full"
        >
          <Contents width={"section"} className=" pt-1 pb-2">
            {activeTab === 1 && (
              <EquipmentComponent
                equipments={equipments}
                setFilter={setFilter}
              />
            )}
            {activeTab === 2 && (
              <JobsiteComponent jobsites={jobsites} setFilter={setFilter} />
            )}
            {activeTab === 3 && (
              <Holds className="h-full w-full">
                <Grids rows="10" gap="2" className="h-full">
                  <Holds
                    background={"white"}
                    position={"row"}
                    className="row-span-1 h-full border-[3px] border-black"
                  >
                    <Buttons
                      onClick={() => setActiveTab2(1)}
                      className={`px-4 py-4 min-w-[100px] rounded-[10px] h-full flex items-center justify-center font-bold  w-full shadow-none ${
                        activeTab2 === 1
                          ? "bg-app-blue border-none "
                          : "bg-white border-none"
                      }`}
                    >
                      {t("CostCodes")}
                    </Buttons>
                    <Buttons
                      onClick={() => setActiveTab2(2)}
                      className={`px-4 py-4 min-w-[100px] rounded-[10px] h-full flex items-center justify-center  font-bold w-full shadow-none ${
                        activeTab2 === 2
                          ? "bg-app-blue border-none"
                          : "bg-white border-none"
                      }`}
                    >
                      {t("Tags")}
                    </Buttons>
                  </Holds>

                  {activeTab2 === 1 && (
                    <CostCodeComponent costCodes={costCodes} tags={tags} />
                  )}
                  {activeTab2 === 2 && <TagsComponent tags={tags} />}
                </Grids>
              </Holds>
            )}
          </Contents>
        </Holds>
      </Grids>
    </Holds>
  );
}
