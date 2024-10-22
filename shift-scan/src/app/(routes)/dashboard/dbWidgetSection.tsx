"use client";

import { Buttons } from "@/components/(reusable)/buttons";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { useTranslations } from "next-intl";
import { Grids } from "@/components/(reusable)/grids";
import { useEffect, useState } from "react";
import { Holds } from "@/components/(reusable)/holds";
import { Contents } from "@/components/(reusable)/contents";
import { useRouter } from "next/navigation";
import { getAuthStep, setAuthStep } from "@/app/api/auth";
import Spinner from "@/components/(animations)/spinner";
import { updateTimeSheetBySwitch } from "@/actions/timeSheetActions";
import React from "react";
import { z } from "zod";

// Zod schema for log validation
const LogSchema = z.object({
  id: z.number(),
  name: z.string(),
  startTime: z.string().nullable(),
  endTime: z.string().nullable(),
  duration: z.number().nullable(),
});

// Zod schema for logs list response
const LogsListSchema = z.array(LogSchema);

type Log = z.infer<typeof LogSchema>;

export default function DbWidgetSection() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const t = useTranslations("Widgets");
  const e = useTranslations("Err-Msg");
  const authStep = getAuthStep();

  const [logs, setLogs] = useState<Log[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [, setIsModalOpen] = useState(false);
  const [additionalButtonsType, setAdditionalButtonsType] = useState<
    string | null
  >(null);

  const handleShowManagerButtons = () => {
    setAdditionalButtonsType(null);
  };

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const recentLogsResponse = await fetch("/api/getLogs");

        if (!recentLogsResponse.ok) {
          throw new Error("Failed to fetch logs");
        }

        const logsData = await recentLogsResponse.json();

        // Validate fetched logs data with Zod
        try {
          LogsListSchema.parse(logsData);
          setLogs(logsData);
        } catch (error) {
          if (error instanceof z.ZodError) {
            console.error("Validation error in logs data:", error.errors);
            return;
          }
        }
      } catch (err) {
        setError(e("Logs-Fetch"));
        console.error(e("Logs-Fetch"), err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [e, error]);

  // Redirect to dashboard if authStep is not 'success'
  useEffect(() => {
    if (authStep !== "success") {
      router.push("/");
    }
  }, [authStep, router]);

  const handleCOButton2 = async () => {
    try {
      if (logs.length === 0) {
        const formData2 = new FormData();
        const localeValue = localStorage.getItem("savedtimeSheetData");
        const t_id = JSON.parse(localeValue || "{}").id;
        formData2.append("id", t_id?.toString() || "");
        formData2.append("endTime", new Date().toISOString());
        formData2.append("TimeSheetComments", "");
        await updateTimeSheetBySwitch(formData2);

        setAuthStep("break");
        router.push("/");
      } else {
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCOButton3 = async () => {
    if (logs.length === 0) {
      router.push("/dashboard/clock-out");
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      {loading ? (
        <Holds className="my-auto">
          <Spinner />
        </Holds>
      ) : (
        <Contents width={"section"} className="py-5">
          <Grids cols={"2"} rows={"3"} gap={"5"}>
            {additionalButtonsType === "equipment" ? (
              <>
                <Holds className="col-span-2 row-span-1 gap-5 h-full">
                  <Buttons
                    background={"lightBlue"}
                    onClick={handleShowManagerButtons}
                  >
                    <Holds position={"row"} className="my-auto">
                      <Holds size={"60"}>
                        <Texts size={"p1"}>{t("GoHome")}</Texts>
                      </Holds>
                      <Holds size={"40"}>
                        <Images
                          titleImg="/home.svg"
                          titleImgAlt="Home Icon"
                          size={"50"}
                        />
                      </Holds>
                    </Holds>
                  </Buttons>
                </Holds>
                <Holds className="col-span-2 row-span-1 gap-5 h-full">
                  <Buttons background={"green"} href="/dashboard/log-new">
                    <Holds position={"row"} className="my-auto">
                      <Holds size={"60"}>
                        <Texts size={"p1"}>{t("LogNew")}</Texts>
                      </Holds>
                      <Holds size={"40"}>
                        <Images
                          titleImg="/equipment.svg"
                          titleImgAlt="Equipment Icon"
                          size={"40"}
                        />
                      </Holds>
                    </Holds>
                  </Buttons>
                </Holds>
                <Holds className="col-span-2 row-span-1 gap-5 h-full">
                  <Buttons background={"orange"} href="/dashboard/equipment">
                    <Holds position={"row"} className="my-auto">
                      <Holds size={"60"}>
                        <Texts size={"p1"}>{t("LogOut")}</Texts>
                      </Holds>
                      <Holds size={"40"}>
                        <Images
                          titleImg="/current-equipment.svg"
                          titleImgAlt="Equipment Icon"
                          size={"50"}
                        />
                      </Holds>
                    </Holds>
                  </Buttons>
                </Holds>
              </>
            ) : (
              <Holds position={"row"} className="row-span-1 col-span-1 gap-5">
                <Buttons background={"green"} href="/dashboard/forms">
                  <Holds>
                    <Images
                      titleImg="/form.svg"
                      titleImgAlt="Forms Icon"
                      size={"40"}
                    />
                  </Holds>
                  <Holds>
                    <Texts size={"p3"}>{t("Forms")}</Texts>
                  </Holds>
                </Buttons>
              </Holds>
            )}
          </Grids>
        </Contents>
      )}
    </>
  );
}
