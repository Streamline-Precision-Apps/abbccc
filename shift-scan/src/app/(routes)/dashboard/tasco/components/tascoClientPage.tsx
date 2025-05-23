"use client";

import { Holds } from "@/components/(reusable)/holds";
import { useEffect, useState } from "react";
import Counter from "./counter";
import { NewTab } from "@/components/(reusable)/newTabs";
import { Titles } from "@/components/(reusable)/titles";
import { Grids } from "@/components/(reusable)/grids";
import { Contents } from "@/components/(reusable)/contents";
import { Refueled } from "@/lib/types";
import RefuelLayout from "./RefuelLayout";
import TascoComments from "./tascoComments";
import { SetLoad } from "@/actions/tascoActions";
import { useAutoSave } from "@/hooks/(inbox)/useAutoSave";
import { useTranslations } from "next-intl";

export default function TascoEQClientPage() {
  const t = useTranslations("Tasco");
  const [isLoading, setIsLoading] = useState(false);
  const [loadCount, setLoadCount] = useState<number>(0);
  const [activeTab, setActiveTab] = useState(1);
  const [tascoLogId, setTascoLogId] = useState<string>();
  const [refuelLogs, setRefuelLogs] = useState<Refueled[]>();
  const [comment, setComment] = useState<string>("");

  // Combine the initial data fetching into a single useEffect
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        // Fetch tascoLogId first
        const idRes = await fetch(`/api/getTascoLog/tascoId`);
        if (!idRes.ok) throw new Error("Failed to fetch Tasco Log");
        const tascoLogId = await idRes.json();
        setTascoLogId(tascoLogId);

        // Then fetch all related data in parallel
        const [commentRes, loadRes, refuelRes] = await Promise.all([
          fetch(`/api/getTascoLog/comment/${tascoLogId}`),
          fetch(`/api/getTascoLog/loadCount/${tascoLogId}`),
          fetch(`/api/getTascoLog/refueledLogs/${tascoLogId}`),
        ]);

        const [commentData, loadData, refuelData] = await Promise.all([
          commentRes.json(),
          loadRes.json(),
          refuelRes.json(),
        ]);

        setComment(commentData || "");
        setLoadCount(Number(loadData.LoadQuantity));
        setRefuelLogs(refuelData);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Consider adding error state handling here
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const saveDraftData = async (values: {
    tascoLogId: string;
    loadCount: number;
  }) => {
    try {
      // Include the title in the values object
      const dataToSave = { ...values };
      const formData = new FormData();
      formData.append("tascoLogId", dataToSave.tascoLogId);
      formData.append("loadCount", dataToSave.loadCount.toString());
      await SetLoad(formData);
      console.log("Draft saved successfully");
    } catch (error) {
      console.error("Error saving draft:", error);
    }
  };

  // Use the auto-save hook with the FormValues type
  const autoSave = useAutoSave<{
    values: { tascoLogId: string; loadCount: number };
  }>((data) => saveDraftData(data.values), 400);

  // Trigger auto-save when formValues or formTitle changes
  useEffect(() => {
    if (!tascoLogId) return;
    autoSave.autoSave({ values: { tascoLogId, loadCount } });
  }, [loadCount]);

  return (
    // <Holds className="h-full overflow-y-hidden no-scrollbar">
    <>
      <Grids
        rows={"10"}
        gap={"3"}
        className={isLoading ? "animate-pulse h-full w-full" : "h-full w-full"}
      >
        <Holds
          className="w-full h-full items-center row-start-1 row-end-3 "
          background={"white"}
        >
          <Holds className="w-full h-full items-center py-2">
            <Titles size={"h5"}>{t("LoadCounter")}</Titles>
            <Counter count={loadCount} setCount={setLoadCount} />
          </Holds>
        </Holds>

        <Holds className="row-start-3 row-end-11 h-full w-full">
          <Holds position={"row"} className="gap-1.5 h-[50px]">
            <NewTab
              titleImage="/comment.svg"
              titleImageAlt={t("Comments")}
              onClick={() => setActiveTab(1)}
              isActive={activeTab === 1}
              isComplete={comment.trim().length > 0}
            >
              <Titles size={"h4"}>{t("Comments")}</Titles>
            </NewTab>
            <NewTab
              titleImage="/refuel.svg"
              titleImageAlt={t("RefuelIcon")}
              onClick={() => setActiveTab(2)}
              isActive={activeTab === 2}
              isComplete={
                refuelLogs === undefined ||
                refuelLogs.length === 0 ||
                refuelLogs.every((log) => log.gallonsRefueled > 0)
              }
            >
              <Titles size={"h4"}>{t("RefuelLogs")}</Titles>
            </NewTab>
          </Holds>

          <Holds
            background={"white"}
            className="rounded-t-none  h-full overflow-y-hidden no-scrollbar"
          >
            <Contents width={"section"} className="py-5">
              {activeTab === 1 && (
                <Holds className="h-full w-full relative pt-2">
                  <TascoComments
                    tascoLog={tascoLogId}
                    comments={comment}
                    setComments={setComment}
                  />
                </Holds>
              )}
              {activeTab === 2 && (
                <RefuelLayout
                  tascoLog={tascoLogId}
                  refuelLogs={refuelLogs}
                  setRefuelLogs={setRefuelLogs}
                />
              )}
            </Contents>
          </Holds>
        </Holds>
      </Grids>
    </>
  );
}
