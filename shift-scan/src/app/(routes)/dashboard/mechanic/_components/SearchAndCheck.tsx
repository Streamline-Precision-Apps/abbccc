"use client";
import { setProjectSelected } from "@/actions/mechanicActions";
import Spinner from "@/components/(animations)/spinner";
import EmptyView from "@/components/(reusable)/emptyView";
import { EmptyViews } from "@/components/(reusable)/emptyViews";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { Priority } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";

type Equipment = {
  id: string;
  name: string;
};

type MaintenanceLog = {
  id: string;
  startTime: string;
  endTime: string;
  userId: string;
};

export type Projects = {
  id: string;
  equipmentId: string;
  selected: boolean;
  repaired: boolean;
  priority: Priority;
  delay: Date | null;
  maintenanceLogs: MaintenanceLog[];
  equipment: Equipment;
};

export const SearchAndCheck = ({
  AllProjects,
  loading,
}: {
  AllProjects: Projects[];
  loading: boolean;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  // Create a local state copy of the projects for immediate UI updates.
  const [projectsState, setProjectsState] = useState<Projects[]>(AllProjects);

  // When the incoming projects prop changes, update the local state.
  useEffect(() => {
    setProjectsState(AllProjects);
  }, [AllProjects]);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const priorityOrder: Priority[] = [
    Priority.TODAY,
    Priority.HIGH,
    Priority.MEDIUM,
    Priority.LOW,
    Priority.PENDING,
  ];

  // Use the local projects state for sorting and filtering.
  const sortedProjects = projectsState.slice().sort((a, b) => {
    const indexA = priorityOrder.indexOf(a.priority);
    const indexB = priorityOrder.indexOf(b.priority);
    return indexA - indexB;
  });

  const filteredProjects = sortedProjects.filter((project) => {
    return project.equipmentId.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Toggle the "selected" property locally and call the action.
  const handleToggle = (projectId: string) => {
    setProjectsState((prevProjects) =>
      prevProjects.map((project) =>
        project.id === projectId
          ? { ...project, selected: !project.selected }
          : project
      )
    );
    // Optionally, call your backend action.
    // Use a functional update if needed to ensure correct toggle value:
    const toggledProject = projectsState.find((p) => p.id === projectId);
    if (toggledProject) {
      setProjectSelected(projectId, !toggledProject.selected);
    }
  };

  return (
    <Grids rows={"8"} className="h-full w-full">
      {/* Search bar */}
      <Holds
        position={"row"}
        className="row-start-1 row-end-2 h-full w-full border-b-[3px] border-b-black "
      >
        <Holds size={"20"} className="mr-4" onClick={focusInput}>
          <Images
            titleImg="/magnifyingGlass.svg"
            titleImgAlt="search"
            size={"50"}
          />
        </Holds>
        <Holds size={"60"}>
          <input
            ref={inputRef}
            type="text"
            className="border-none focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Holds>
        <Holds size={"20"} onClick={() => setSearchTerm("")}>
          <Texts size={"p1"}>X</Texts>
        </Holds>
      </Holds>

      {loading ? (
        <Holds
          background={"darkBlue"}
          className="row-start-2 row-end-9 h-full w-full justify-center items-center rounded-none "
        >
          <Spinner color={"white"} />
        </Holds>
      ) : (
        <>
          <Holds
            background={"darkBlue"}
            className="row-start-2 row-end-9 h-full w-full overflow-y-auto no-scrollbar rounded-none"
          >
            {filteredProjects.length === 0 && (
              <Holds className="h-full w-full">
                <EmptyViews
                  TopChild={
                    <Holds className="px-2">
                      <Titles size={"h5"}>
                        No projects found. Start a new project or check back
                        later!
                      </Titles>
                    </Holds>
                  }
                  topChildPosition={"default"}
                />
              </Holds>
            )}
            {filteredProjects.length > 0 &&
              filteredProjects.map((project, index) => (
                <Holds
                  background={"white"}
                  position={"row"}
                  key={index}
                  className="w-full border-[3px] border-black rounded-[10px] mb-2 py-2"
                >
                  <Holds
                    position={"row"}
                    size={project.repaired ? "full" : "80"}
                    className="justify-between"
                    onClick={() =>
                      router.push(
                        `/dashboard/mechanic/edit-repair-details/${project.id}`
                      )
                    }
                  >
                    <Holds size={"20"}>
                      <Images
                        titleImg={
                          project.delay
                            ? "/delayPriority.svg"
                            : project.priority === "PENDING"
                            ? "/pending.svg"
                            : project.priority === "LOW"
                            ? "/lowPriority.svg"
                            : project.priority === "MEDIUM"
                            ? "/mediumPriority.svg"
                            : project.priority === "HIGH"
                            ? "/highPriority.svg"
                            : "/todayPriority.svg"
                        }
                        titleImgAlt="priority"
                        size={"80"}
                      />
                    </Holds>
                    <Holds>
                      <Texts
                        className="text-center"
                        size={"p6"}
                      >{`${project.equipment.name.slice(0, 16)}...`}</Texts>
                    </Holds>
                  </Holds>
                  {project.repaired === false && (
                    <Holds size={"20"}>
                      <Holds
                        className="h-8 w-8 rounded-[10px] shadow-[6px_6px_0px_grey]"
                        onClick={() => handleToggle(project.id)}
                      >
                        {project.selected ? (
                          <svg
                            className="stroke-black bg-app-green rounded-[10px] border-[3px] border-black"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        ) : (
                          <svg
                            className="stroke-white bg-white rounded-[10px] border-[3px] border-black"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="0"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        )}
                      </Holds>
                    </Holds>
                  )}
                </Holds>
              ))}
          </Holds>
        </>
      )}
    </Grids>
  );
};
