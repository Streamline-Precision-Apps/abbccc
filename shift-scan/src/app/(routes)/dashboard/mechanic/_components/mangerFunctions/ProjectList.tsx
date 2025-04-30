import EmptyView from "@/components/(reusable)/emptyView";
import { Holds } from "@/components/(reusable)/holds";
import { useTranslations } from "next-intl";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ProjectItem } from "./ProjectItem";

type Equipment = {
  id: string;
  name: string;
};

enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  DELAYED = "DELAYED",
  PENDING = "PENDING",
  TODAY = "TODAY",
}
type MaintenanceLog = {
  id: string;
  startTime: string;
  endTime: string;
  userId: string;
  timeSheetId: string;
  User: {
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
  MaintenanceLogs: MaintenanceLog[];
  Equipment: Equipment;
};

export function ProjectList({
  projects,
  updatingId,
  handleToggle,
  router,
}: {
  projects: Project[];
  updatingId: string | null;
  handleToggle: (projectId: string) => Promise<void>;
  router: AppRouterInstance;
}) {
  const t = useTranslations("MechanicWidget");

  if (projects.length === 0) {
    return (
      <Holds className="h-full w-full row-start-2 row-end-9 rounded-none">
        <EmptyView />
      </Holds>
    );
  }

  return (
    <Holds className="row-start-2 row-end-9 h-full w-full overflow-y-auto no-scrollbar rounded-none px-2 py-2">
      {projects.map((project) => (
        <ProjectItem
          key={project.id}
          project={project}
          updatingId={updatingId}
          handleToggle={handleToggle}
          router={router}
        />
      ))}
    </Holds>
  );
}
