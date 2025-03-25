"use client";
import {
  useState,
  useMemo,
  useRef,
  Dispatch,
  SetStateAction,
  RefObject,
} from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Spinner from "@/components/(animations)/spinner";
import EmptyView from "@/components/(reusable)/emptyView";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { SearchBar } from "./SearchBar";
import { ProjectList } from "./ProjectList";

// Import your UI components

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
  maintenanceLogs: any[];
};

export const SearchAndCheck = ({
  projects,
  loading,
  onProjectSelect,
}: {
  projects: Project[];
  loading: boolean;
  onProjectSelect: (id: string, selected: boolean) => Promise<void>;
}) => {
  const router = useRouter();
  const t = useTranslations("MechanicWidget");
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const priorityOrder: Priority[] = [
    Priority.TODAY,
    Priority.HIGH,
    Priority.MEDIUM,
    Priority.LOW,
    Priority.PENDING,
  ];

  const filteredProjects = useMemo(() => {
    return [...projects]
      .sort((a, b) => {
        const indexA = priorityOrder.indexOf(a.priority);
        const indexB = priorityOrder.indexOf(b.priority);
        return indexA - indexB;
      })
      .filter((project) =>
        project.equipment.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [projects, searchTerm]);

  const handleToggle = async (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    setUpdatingId(projectId);
    try {
      await onProjectSelect(projectId, !project.selected);
    } catch (error) {
      console.error("Failed to update project:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <>
        <Holds className="row-start-2 row-end-9 h-full w-full justify-center items-center rounded-none">
          <Spinner />
        </Holds>
      </>
    );
  }

  return (
    <Grids rows="8" className="h-full w-full">
      {/* Search Bar */}
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        inputRef={inputRef}
      />

      {/* Project List */}
      <ProjectList
        projects={filteredProjects}
        updatingId={updatingId}
        handleToggle={handleToggle}
        router={router}
      />
    </Grids>
  );
};
