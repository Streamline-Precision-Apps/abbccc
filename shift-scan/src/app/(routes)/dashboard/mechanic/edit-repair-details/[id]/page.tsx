"use client";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Tab } from "@/components/(reusable)/tab";
import { Texts } from "@/components/(reusable)/texts";
import { use, useEffect, useState } from "react";
import MechanicEditPage from "./_components/MechanicEditPage";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import MechanicEmployeeLogs from "./_components/MechanicEmployeeLogs";

type Equipment = {
  id: string;
  name: string;
};

type RepairDetails = {
  id: string;
  equipmentId: string;
  equipmentIssue: string;
  additionalInfo: string;
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    Promise.all([
      fetch(`/api/getRepairDetails/${params.id}`).then((res) => res.json()),
      fetch(`/api/getMaintenanceLogs/${params.id}`).then((res) => res.json()),
    ])
      .then(([repairDetails, logs]) => {
        setRepairDetails(repairDetails);
        setLogs(logs);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params.id]);

  useEffect(() => {
    console.log(logs);
  }, [logs]);

  return (
    <Bases>
      <Contents>
        <Grids rows={"7"} gap={"5"} className="h-full">
          <Holds
            background={"white"}
            className={
              repairDetails?.equipment
                ? "row-start-1 row-end-2 h-full"
                : "row-start-1 row-end-2 h-full animate-pulse"
            }
          >
            <TitleBoxes
              title={
                repairDetails?.equipment ? repairDetails.equipment.name : ""
              }
              titleImg=""
              titleImgAlt=""
              type="noIcon"
            />
          </Holds>
          <Holds
            className={
              repairDetails?.equipment
                ? "row-span-6 h-full "
                : "row-span-6 h-full animate-pulse"
            }
          >
            <Grids rows={"10"} className="h-full">
              <Holds position={"row"} className="row-span-1 gap-2">
                <Tab
                  onClick={() => setActiveTab(1)}
                  isActive={activeTab === 1}
                  size={"md"}
                >
                  Project Info
                </Tab>
                <Tab
                  onClick={() => setActiveTab(2)}
                  isActive={activeTab === 2}
                  size={"md"}
                >
                  Logs
                </Tab>
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
                  <MechanicEmployeeLogs logs={logs} loading={loading} />
                )}
              </Holds>
            </Grids>
          </Holds>
        </Grids>
      </Contents>
    </Bases>
  );
}
