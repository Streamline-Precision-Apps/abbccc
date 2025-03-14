"use client";

import { Buttons } from "@/components/(reusable)/buttons";
import { useTranslations } from "next-intl";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { useEffect, useState } from "react";
import Spinner from "@/components/(animations)/spinner";
import { Contents } from "@/components/(reusable)/contents";
import { useRouter } from "next/navigation";
import { Grids } from "@/components/(reusable)/grids";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { EmployeeEquipmentLogs } from "@/lib/types";
import { Bases } from "@/components/(reusable)/bases";
import { Titles } from "@/components/(reusable)/titles";
import { differenceInSeconds, parseISO } from "date-fns";
import { EmptyViews } from "@/components/(reusable)/emptyViews";
import { NewTab } from "@/components/(reusable)/newTabs";

export default function EquipmentLogContent() {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<EmployeeEquipmentLogs[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const t = useTranslations("Equipment");
  const [active, setActive] = useState(1);

  const router = useRouter();

  // Fetch logs data on mount (and when Router changes)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/getCheckedList");
        if (response.ok) {
          const data = await response.json();
          setLogs(data);
        } else {
          console.error("Failed to fetch logs");
        }
      } catch (error) {
        console.error("Error fetching logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update the currentTime every second for active logs
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const filteredLogs =
    active === 1
      ? logs.filter((log) => !log.isFinished)
      : logs.filter((log) => log.isFinished);

  return (
    <Bases>
      <Contents>
        <Grids rows={"10"} gap={"5"} className="relative">
          <Holds
            background={"white"}
            className={
              loading ? "row-span-2 h-full animate-pulse" : "row-span-2 h-full"
            }
          >
            <TitleBoxes
              title={t("Current")}
              titleImg="/equipment.svg"
              titleImgAlt="Current"
              variant={"default"}
              size={"default"}
              className="my-auto"
              href="/dashboard"
            />
          </Holds>

          <Holds
            className={
              loading ? "row-span-8 h-full animate-pulse" : "row-span-8 h-full"
            }
          >
            <Holds className="h-full w-full ">
              <Grids rows={"8"} className="h-full w-full ">
                <Holds position={"row"} className="h-full gap-1">
                  <NewTab
                    onClick={() => setActive(1)}
                    isActive={active === 1}
                    titleImage="/OrangeOngoing.svg"
                    titleImageAlt="Clock"
                    isComplete={true}
                  >
                    <Titles size={"h4"}>CurrentLogs</Titles>
                  </NewTab>
                  <NewTab
                    onClick={() => setActive(2)}
                    isActive={active === 2}
                    titleImage="/complete.svg"
                    titleImageAlt="Finished logs Icon"
                    isComplete={true}
                  >
                    <Titles size={"h4"}>Finished Logs</Titles>
                  </NewTab>
                </Holds>
                <Holds
                  background={"white"}
                  className="h-full w-full row-span-7 rounded-t-none"
                >
                  <Contents width={"section"}>
                    <Grids rows={"8"} gap={"5"} className="h-full w-full py-5">
                      {loading ? (
                        <>
                          <Holds className="row-span-7">
                            <Spinner />
                          </Holds>
                          <Holds className="row-span-1 w-full h-full">
                            <Buttons
                              background={"lightGray"}
                              className="w-full"
                            >
                              <Titles size={"h4"}>{t("LogNew")}</Titles>
                            </Buttons>
                          </Holds>
                        </>
                      ) : (
                        <>
                          {filteredLogs.length === 0 ? (
                            <>
                              <Holds className="row-span-7 h-full">
                                <EmptyViews
                                  logoPosition={"top"}
                                  logoSize={"lg"}
                                  background={"white"}
                                  TopChild={
                                    <Holds className="h-full w-full">
                                      <Titles size={"h3"}>
                                        {t("NoCurrent")}
                                      </Titles>
                                    </Holds>
                                  }
                                />
                              </Holds>
                              <Holds className="row-span-1 w-full h-full">
                                <Contents width={"section"}>
                                  <Buttons
                                    background={"green"}
                                    className="w-full"
                                    onClick={() =>
                                      router.push(
                                        "/dashboard/equipment/log-new"
                                      )
                                    }
                                  >
                                    <Titles size={"h4"}>{t("LogNew")}</Titles>
                                  </Buttons>
                                </Contents>
                              </Holds>
                            </>
                          ) : (
                            <>
                              <Holds className="row-span-7 h-full">
                                {filteredLogs.map((log) => {
                                  // Calculate elapsed time as shown above
                                  const start = parseISO(
                                    log.startTime.toString()
                                  );
                                  let diffInSeconds = 0;

                                  if (log.endTime !== null) {
                                    const end = parseISO(
                                      log.endTime
                                        ? log.endTime.toString()
                                        : new Date().toString()
                                    );
                                    diffInSeconds = differenceInSeconds(
                                      end,
                                      start
                                    );
                                  } else {
                                    diffInSeconds = differenceInSeconds(
                                      currentTime,
                                      start
                                    );
                                  }

                                  const hours = Math.floor(
                                    diffInSeconds / 3600
                                  );
                                  const minutes = Math.floor(
                                    (diffInSeconds % 3600) / 60
                                  );
                                  const seconds = diffInSeconds % 60;

                                  const formattedTime = `${
                                    log.endTime !== null
                                      ? hours === 0
                                        ? `${minutes} min`
                                        : `${hours} hrs ${minutes} min`
                                      : `${hours
                                          .toString()
                                          .padStart(2, "0")}:${minutes
                                          .toString()
                                          .padStart(2, "0")}:${seconds
                                          .toString()
                                          .padStart(2, "0")}`
                                  }`;

                                  return (
                                    <Holds
                                      key={log.id}
                                      className="pb-5 overflow-y-auto no-scrollbar"
                                    >
                                      <Contents width={"section"}>
                                        <Buttons
                                          background={
                                            log.endTime !== null
                                              ? "lightBlue"
                                              : "orange"
                                          }
                                          href={`/dashboard/equipment/${log.id}`}
                                          className="py-3"
                                        >
                                          <Titles size={"h5"}>
                                            {log.equipment?.name}
                                          </Titles>
                                          <Titles size={"h6"}>
                                            {formattedTime}
                                          </Titles>
                                        </Buttons>
                                      </Contents>
                                    </Holds>
                                  );
                                })}
                              </Holds>
                              <Holds className="row-span-1  h-full">
                                <Contents width={"section"}>
                                  <Buttons
                                    background={"green"}
                                    onClick={() =>
                                      router.push(
                                        "/dashboard/equipment/log-new"
                                      )
                                    }
                                  >
                                    <Titles size={"h4"}>{t("LogNew")}</Titles>
                                  </Buttons>
                                </Contents>
                              </Holds>
                            </>
                          )}
                        </>
                      )}
                    </Grids>
                  </Contents>
                </Holds>
              </Grids>
            </Holds>
          </Holds>
        </Grids>
      </Contents>
    </Bases>
  );
}
