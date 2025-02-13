"use client";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Tab } from "@/components/(reusable)/tab";
import { Texts } from "@/components/(reusable)/texts";
import { useEffect, useState } from "react";
import MechanicEditPage from "../../components/MechanicEditPage";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import MechanicEmployeeLogs from "../../components/MechanicEmployeeLogs";

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
  delay: Date | null;
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
    const fetchRepairDetails = async () => {
      try {
        setLoading(true);
        // Fetch repair details
        const response = await fetch(`/api/getRepairDetails/${params.id}`);
        const data = await response.json();
        setRepairDetails(data);

        const res = await fetch(`/api/getMaintenanceLogs/${params.id}`);
        const data1 = await res.json();
        setLogs(data1);
      } catch (error) {
        console.error("Error fetching repair details:", error);
      }
      setLoading(false);
    };
    fetchRepairDetails();
  }, [params.id]);
  return (
    <Bases>
      <Contents>
        <Grids rows={"7"} gap={"5"} className="h-full">
          <Holds background={"white"} className="row-start-1 row-end-2 h-full">
            <TitleBoxes
              title={
                repairDetails?.equipment
                  ? repairDetails.equipment.name
                  : "Loading..."
              }
              titleImg=""
              titleImgAlt=""
              type="noIcon"
            />
          </Holds>
          <Holds className="row-span-6 h-full">
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
                className="rounded-t-none row-span-9 h-full py-2"
              >
                {activeTab === 1 && (
                  // <MechanicEditPage
                  //   repairDetails={repairDetails}
                  //   setRepairDetails={setRepairDetails}
                  // />
                  <></>
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
