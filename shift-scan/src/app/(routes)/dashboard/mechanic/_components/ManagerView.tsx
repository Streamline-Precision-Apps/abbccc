import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { NewTab } from "@/components/(reusable)/newTabs";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction } from "react";
import MechanicPriority from "./MechanicPriorityList";

import { Header } from "./Header";
import MechanicSelectList from "./mangerFunctions/MechanicSelectList";

type Equipment = {
  id: string;
  name: string;
};

type MaintenanceLog = {
  id: string;
  startTime: string;
  endTime: string;
  userId: string;
  timeSheetId: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    image: string;
  };
};

type Project = {
  id: string;
  equipmentId: string;
  equipmentIssue: string;
  additionalInfo: string;
  selected: boolean;
  repaired: boolean;
  createdBy: string;
  createdAt: string | undefined;
  priority: Priority;
  delay: Date | null;
  maintenanceLogs: MaintenanceLog[];
  equipment: Equipment;
};

enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  DELAYED = "DELAYED",
  PENDING = "PENDING",
  TODAY = "TODAY",
}

export function ManagerView({
  activeTab,
  setActiveTab,
  priorityProjects,
  selectableProjects,
  loading,
  timeSheetId,
  onProjectSelect,
}: {
  activeTab: number;
  setActiveTab: Dispatch<SetStateAction<number>>;
  priorityProjects: Project[];
  selectableProjects: Project[];
  loading: boolean;
  timeSheetId: string | null;
  onProjectSelect: (projectId: string, selected: boolean) => Promise<void>;
}) {
  const t = useTranslations("MechanicWidget");
  return (
    <Grids rows="8" gap="5">
      {/* Header */}
      <Header title={activeTab === 1 ? t("PriorityList") : t("Projects")} />

      {/* Tab Content */}
      <Holds className="row-span-7 h-full">
        <Grids rows="10" className="h-full">
          {/* Tabs */}
          <Holds position="row" className="row-span-1 gap-1">
            <NewTab
              isActive={activeTab === 1}
              onClick={() => setActiveTab(1)}
              titleImage="/OrangeOngoing.svg"
              titleImageAlt="List Tab"
              isComplete={true}
            >
              {t("Todays")}
            </NewTab>
            <NewTab
              isActive={activeTab === 2}
              onClick={() => setActiveTab(2)}
              titleImage="/form.svg"
              titleImageAlt="Manager Tab"
              isComplete={true}
            >
              {t("All")}
            </NewTab>
          </Holds>

          {/* Content */}
          <Holds
            background="white"
            className="rounded-t-none row-span-9 h-full"
          >
            {activeTab === 1 ? (
              <MechanicPriority
                projects={selectableProjects.filter(
                  (project) => project.selected
                )}
                loading={loading}
                timeSheetId={timeSheetId}
              />
            ) : (
              <MechanicSelectList
                projects={selectableProjects}
                loading={loading}
                onProjectSelect={onProjectSelect}
              />
            )}
          </Holds>
        </Grids>
      </Holds>
    </Grids>
  );
}
