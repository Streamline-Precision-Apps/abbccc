"use client";
import { Grids } from "@/components/(reusable)/grids";
import MechanicPriority from "./MechanicPriorityList";
import { Header } from "./Header";

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

export function NonManagerView({
  projects,
  loading,
  timeSheetId,
}: {
  projects: Project[];
  loading: boolean;
  timeSheetId: string | null;
}) {
  return (
    <Grids rows="8" gap="5">
      {/* Header */}
      <Header title="Projects" />

      {/* Priority List */}

      <MechanicPriority
        loading={loading}
        projects={projects.filter(
          (project) => project.selected && !project.repaired
        )}
        timeSheetId={timeSheetId}
      />
    </Grids>
  );
}
