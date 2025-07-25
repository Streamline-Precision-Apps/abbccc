"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { useTranslations } from "next-intl";
import { Holds } from "@/components/(reusable)/holds";
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
import { NewTab } from "@/components/(reusable)/newTabs";
import SlidingDiv from "@/components/(animations)/slideDelete";
import { deleteEmployeeEquipmentLog } from "@/actions/equipmentActions";
import { Texts } from "@/components/(reusable)/texts";

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
      ? logs.filter((log) => !log.endTime)
      : logs.filter((log) => !!log.endTime);

  const handleDelete = async (id: string) => {
    try {
      await deleteEmployeeEquipmentLog(id);
      setLogs((prevLogs) => prevLogs.filter((log) => log.id !== id));
    } catch (error) {
      console.error("Error deleting equipment log:", error);
    }
  };

  return (
    <Bases>
      <Contents>
        <Grids rows={"7"} gap={"5"} className="relative size-full">
          <Holds
            background={"white"}
            className={
              loading
                ? "row-start-1 row-end-2 h-full animate-pulse"
                : "row-start-1 row-end-2 h-full "
            }
          >
            <TitleBoxes onClick={() => router.push("/dashboard")}>
              <Titles size={"h2"}>{t("Current")}</Titles>
            </TitleBoxes>
          </Holds>

          <Holds
            className={
              loading
                ? "row-start-2 row-end-8 h-full animate-pulse"
                : "row-start-2 row-end-8 h-full"
            }
          >
            <Holds className="h-full w-full ">
              <Grids rows={"10"} className="h-full w-full ">
                <Holds
                  position={"row"}
                  className="w-full row-start-1 row-end-2 gap-1"
                >
                  <NewTab
                    onClick={() => setActive(1)}
                    isActive={active === 1}
                    titleImage="/statusOngoingFilled.svg"
                    titleImageAlt="Clock"
                    isComplete={true}
                  >
                    <Titles size={"h4"}>{t("CurrentLogs")}</Titles>
                  </NewTab>
                  <NewTab
                    onClick={() => setActive(2)}
                    isActive={active === 2}
                    titleImage="/statusApprovedFilled.svg"
                    titleImageAlt="Finished logs Icon"
                    isComplete={true}
                  >
                    <Titles size={"h4"}>{t("FinishedLogs")}</Titles>
                  </NewTab>
                </Holds>

                <Holds
                  background={"white"}
                  className="h-full w-full row-start-2 row-end-11 rounded-t-none"
                >
                  <Contents width={"section"}>
                    <Grids rows={"7"} gap={"5"} className="h-full w-full py-5">
                      {loading ? (
                        <>
                          <Holds className="row-start-1 row-end-7 h-full justify-center items-center">
                            <Spinner />
                          </Holds>
                          <Holds className="row-start-7 row-end-8 h-full w-full gap-1 ">
                            <Buttons
                              background={"darkGray"}
                              className="w-full py-2"
                            >
                              <Titles size={"h4"}>{t("LogNew")}</Titles>
                            </Buttons>
                          </Holds>
                        </>
                      ) : (
                        <>
                          {filteredLogs.length === 0 ? (
                            <>
                              <Holds className="row-start-1 row-end-7 h-full justify-center">
                                <Texts
                                  size="p6"
                                  className="text-gray-500 italic"
                                >
                                  {t("NoCurrent")}
                                </Texts>
                              </Holds>
                              <Holds className="row-span-1 w-full h-full">
                                <Buttons
                                  background={"green"}
                                  className="w-full py-2"
                                  onClick={() =>
                                    router.push("/dashboard/equipment/log-new")
                                  }
                                >
                                  <Titles size={"h4"}>{t("LogNew")}</Titles>
                                </Buttons>
                              </Holds>
                            </>
                          ) : (
                            <>
                              <Holds className="row-start-1 row-end-7 h-full overflow-y-auto no-scrollbar">
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
                                    <Holds key={log.id}>
                                      <SlidingDiv
                                        onSwipeLeft={() => handleDelete(log.id)}
                                      >
                                        <Buttons
                                          background={
                                            log.endTime !== null
                                              ? "lightBlue"
                                              : "orange"
                                          }
                                          shadow={"none"}
                                          href={`/dashboard/equipment/${log.id}`}
                                          className="py-0.5"
                                        >
                                          <Titles size={"h4"}>
                                            {log.Equipment?.name}
                                          </Titles>
                                          <Titles className="text-xs">
                                            {formattedTime}
                                          </Titles>
                                        </Buttons>
                                      </SlidingDiv>
                                    </Holds>
                                  );
                                })}
                              </Holds>
                              <Holds className="row-start-7 row-end-8 h-full w-full">
                                <Buttons
                                  background={"green"}
                                  onClick={() =>
                                    router.push("/dashboard/equipment/log-new")
                                  }
                                  className="w-full py-2"
                                >
                                  <Titles size={"h4"}>{t("LogNew")}</Titles>
                                </Buttons>
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
