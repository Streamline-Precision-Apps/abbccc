"use client";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { useEffect, useRef, useState } from "react";
import MechanicEditPage from "./_components/MechanicEditPage";
import MechanicEmployeeLogs from "./_components/MechanicEmployeeLogs";
import { useTranslations } from "next-intl";
import { Buttons } from "@/components/(reusable)/buttons";
import { Images } from "@/components/(reusable)/images";
import { Titles } from "@/components/(reusable)/titles";
import { useRouter } from "next/navigation";
import { NewTab } from "@/components/(reusable)/newTabs";

type Equipment = {
  id: string;
  name: string;
};
type RepairDetails = {
  id: string;
  equipmentId: string;
  equipmentIssue: string;
  additionalInfo: string;
  problemDiagnosis: string;
  solution: string;
  location: string;
  priority: string;
  createdBy: string;
  createdAt: Date;
  hasBeenDelayed: boolean;
  repaired: boolean;
  delay: Date | null;
  delayReasoning?: string;
  totalHoursLaboured: number;
  equipment: Equipment;
};
type User = {
  firstName: string;
  lastName: string;
};
type MaintenanceLog = {
  id: string;
  startTime: string;
  endTime: string;
  comment: string;
  user: User;
};
type LogItem = {
  id: string;
  maintenanceLogs: MaintenanceLog[];
};

export default function EditRepairDetails({
  params,
}: {
  params: { id: string };
}) {
  const [activeTab, setActiveTab] = useState(1);
  const [repairDetails, setRepairDetails] = useState<RepairDetails>();
  const [logs, setLogs] = useState<LogItem[]>();
  const previousLogsRef = useRef<LogItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [totalHours, setTotalHours] = useState<number>(0);
  const t = useTranslations("MechanicWidget");
  const router = useRouter();

  const fetchRepairDetails = async () => {
    setLoading(true);

    try {
      const [repairDetailsRes, logsRes] = await Promise.all([
        fetch(`/api/getRepairDetails/${params.id}`).then((res) => res.json()),
        fetch(`/api/getMaintenanceLogs/${params.id}`).then((res) => res.json()),
      ]);

      // ✅ Check if logs have changed
      if (!areLogsEqual(previousLogsRef.current, logsRes)) {
        setRepairDetails(repairDetailsRes);
        setLogs(logsRes);
        previousLogsRef.current = logsRes;

        // ✅ Calculate total hours
        const totalHours = logsRes.reduce((total: number, log: LogItem) => {
          return (
            total +
            log.maintenanceLogs.reduce(
              (
                subTotal: number,
                log: { startTime: string; endTime: string | null }
              ) => {
                const startTime = new Date(log.startTime);
                const endTime = log.endTime
                  ? new Date(log.endTime)
                  : new Date();
                const hours =
                  (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
                return subTotal + hours;
              },
              0
            )
          );
        }, 0);

        setTotalHours(totalHours);
        console.log("Updated Total Hours:", totalHours);
      }
    } catch (error) {
      console.error("Error fetching repair details:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Deep comparison function for logs
  const areLogsEqual = (prevLogs: LogItem[] | null, newLogs: LogItem[]) => {
    if (!prevLogs) return false;
    return JSON.stringify(prevLogs) === JSON.stringify(newLogs);
  };

  useEffect(() => {
    fetchRepairDetails(); // Initial fetch
  }, [params.id, activeTab === 2]);

  return (
    <Bases>
      <Contents>
        <Grids rows={"7"} gap={"5"} className="h-full">
          <Holds
            background={"white"}
            className={
              repairDetails?.equipment
                ? "row-start-1 row-end-2 h-full justify-center p-3  "
                : "row-start-1 row-end-2 h-full justify-center p-3 animate-pulse"
            }
          >
            <Grids
              cols={"3"}
              rows={"2"}
              className="w-full h-full p-3 relative "
            >
              <Holds className="col-span-1 row-span-1 absolute">
                <Buttons
                  onClick={() => router.push("/dashboard/mechanic")}
                  background={"none"}
                  position={"left"}
                  size={"50"}
                  shadow={"none"}
                >
                  <Images
                    titleImg="/arrowBack.svg"
                    titleImgAlt={t("Mechanic")}
                    className="max-w-8 h-auto object-contain"
                  />
                </Buttons>
              </Holds>

              <Holds className="col-start-1 col-end-5 row-start-1 row-end-3 flex items-center justify-center">
                <Titles size={"h1"}>
                  {repairDetails?.equipment
                    ? `${repairDetails.equipment.name.slice(0, 12)}...`
                    : ""}
                </Titles>
              </Holds>
            </Grids>
          </Holds>
          <Holds
            className={
              repairDetails?.equipment
                ? "row-span-6 h-full "
                : "row-span-6 h-full animate-pulse"
            }
          >
            <Grids rows={"10"} className="h-full">
              <Holds position={"row"} className="row-span-1 h-full gap-1">
                <NewTab
                  onClick={() => setActiveTab(1)}
                  isActive={activeTab === 1}
                  titleImage="/information.svg"
                  titleImageAlt={""}
                  isComplete={true}
                >
                  {t("ProjectInfo")}
                </NewTab>
                <NewTab
                  onClick={() => setActiveTab(2)}
                  isActive={activeTab === 2}
                  titleImage="/statusOngoing.svg"
                  titleImageAlt={""}
                  isComplete={true}
                >
                  {t("Logs")}
                </NewTab>
              </Holds>
              <Holds
                background={"white"}
                className="rounded-t-none row-span-9 h-full "
              >
                {activeTab === 1 && (
                  <MechanicEditPage
                    repairDetails={repairDetails}
                    setRepairDetails={setRepairDetails}
                    totalLogs={logs ? logs[0].maintenanceLogs.length : 0}
                  />
                )}
                {activeTab === 2 && (
                  <MechanicEmployeeLogs
                    logs={logs}
                    loading={loading}
                    totalHours={totalHours}
                  />
                )}
              </Holds>
            </Grids>
          </Holds>
        </Grids>
      </Contents>
    </Bases>
  );
}
