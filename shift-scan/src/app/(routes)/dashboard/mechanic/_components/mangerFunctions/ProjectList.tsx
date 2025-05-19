import EmptyView from "@/components/(reusable)/emptyView";
import { Holds } from "@/components/(reusable)/holds";
import { useTranslations } from "next-intl";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ProjectItem } from "./ProjectItem";
import { Texts } from "@/components/(reusable)/texts";

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
  User: {
    firstName: string;
    lastName: string;
    image: string;
  };
};

type Project = {
  id: string;
  equipmentId: string;
  selected: boolean;
  priority: Priority;
  delay: Date | null;
  equipmentIssue: string;
  additionalInfo: string;
  repaired: boolean;
  createdBy: string;
  createdAt: string | undefined;
  MaintenanceLogs: MaintenanceLog[];
  Equipment: Equipment;
};

enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  DELAYED = "DELAYED",
  PENDING = "PENDING",
  TODAY = "TODAY",
}

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
      <Holds className="h-full w-full row-start-2 row-end-9 rounded-none justify-center px-6">
        <Texts size={"p5"} className="text-center text-gray-500 italic">
          {t("NoProjectsFound")}
        </Texts>
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
