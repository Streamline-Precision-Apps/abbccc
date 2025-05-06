import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { SelectionToggle } from "./SelectionToggle";

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

enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  DELAYED = "DELAYED",
  PENDING = "PENDING",
  TODAY = "TODAY",
}

type Project = {
  id: string;
  equipmentId: string;
  equipment: { name: string };
  selected: boolean;
  repaired: boolean;
  priority: Priority;
  delay: Date | null;
  maintenanceLogs: MaintenanceLog[];
};

export function ProjectItem({
  project,
  updatingId,
  handleToggle,
  router,
}: {
  project: Project;
  updatingId: string | null;
  handleToggle: (projectId: string) => Promise<void>;
  router: AppRouterInstance;
}) {
  const priorityIcons = {
    DELAYED: "/priorityDelay.svg",
    PENDING: "/priorityPending.svg",
    LOW: "/priorityLow.svg",
    MEDIUM: "/priorityMedium.svg",
    HIGH: "/priorityHigh.svg",
    TODAY: "/todayPriority.svg",
  };

  return (
    <Holds
      background="white"
      position="row"
      className="w-full border-[3px] border-black rounded-[10px] mb-2 py-2"
    >
      {/* Project Info */}
      <Holds
        position="row"
        size={project.repaired ? "full" : "80"}
        className="justify-between"
        onClick={() =>
          router.push(`/dashboard/mechanic/edit-repair-details/${project.id}`)
        }
      >
        <Holds size="20">
          <Images
            titleImg={priorityIcons[project.priority] || "/priorityPending.svg"}
            titleImgAlt="priority"
            size="80"
          />
        </Holds>
        <Holds>
          <Texts className="text-center" size="p6">
            {project.equipment.name.slice(0, 16)}
            {project.equipment.name.length > 16 ? "..." : ""}
          </Texts>
        </Holds>
      </Holds>

      {/* Selection Toggle */}
      {!project.repaired && (
        <SelectionToggle
          project={project}
          updatingId={updatingId}
          handleToggle={handleToggle}
        />
      )}
    </Holds>
  );
}
