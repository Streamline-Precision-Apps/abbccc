"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Components
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Labels } from "@/components/(reusable)/labels";
import { NModals } from "@/components/(reusable)/newmodals";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Texts } from "@/components/(reusable)/texts";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Titles } from "@/components/(reusable)/titles";
import { Inputs } from "@/components/(reusable)/inputs";
import { Images } from "@/components/(reusable)/images";

// Utils & Actions
import { getFormattedDuration } from "@/utils/getFormattedDuration";
import { startEngineerProject } from "@/actions/mechanicActions";

// Types
import { Priority } from "@/lib/types";
import { useSession } from "next-auth/react";
import { set } from "date-fns";
import { setMechanicProjectID } from "@/actions/cookieActions";

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

type Projects = {
  id: string;
  equipmentId: string;
  equipmentIssue: string;
  additionalInfo: string;
  selected: boolean;
  repaired: boolean;
  priority: Priority;
  delay: Date | null;
  maintenanceLogs: MaintenanceLog[];
  equipment: Equipment;
};

export default function MechanicPriority() {
  const router = useRouter();

  // State declarations
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<Projects[]>([]);
  const [timeSheetId, setTimeSheetId] = useState<string | null>(null);
  const [activeUsers, setActiveUsers] = useState<
    {
      id: string;
      name: string;
      image: string;
      startTime: string;
    }[]
  >([]);
  const [projectPreviewId, setProjectPreviewId] = useState<string | null>(null);
  const [previewedProjectData, setPreviewedProjectData] = useState<
    Projects | undefined
  >(undefined);

  const { data: session } = useSession();
  const userId = session?.user.id;
  const [isOpenProjectPreview, setIsOpenProjectPreview] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const workersPerPage = 1;
  const [endTime, setEndTime] = useState<string>(
    new Date(
      Date.now() - new Date().getTimezoneOffset() * 60 * 1000
    ).toISOString()
  );

  // Fetch projects from API on mount
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/getMaintenanceProjects");
        const data = await response.json();
        const filteredData = data.filter(
          (project: Projects) => project.selected && project.repaired === false
        );
        setProjects(filteredData);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchTimeSheet = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/getRecentTimecard");
        const data = await response.json();
        setTimeSheetId(data.id);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
      setLoading(false);
    };

    fetchTimeSheet();
  }, []);

  // Update previewed project data when projectPreviewId changes
  useEffect(() => {
    if (projectPreviewId) {
      const project = projects.find((p) => p.id === projectPreviewId);
      setPreviewedProjectData(project);

      if (project) {
        const activeUsersList = project.maintenanceLogs
          .filter((log) => log.startTime && !log.endTime) // Only logs with an active session
          .map((log) => ({
            id: log.user.id,
            name: `${log.user.firstName} ${log.user.lastName}`,
            image: log.user.image,
            startTime: new Date(log.startTime).toISOString(),
          }));
        setActiveUsers(activeUsersList);
      }
    }
  }, [projectPreviewId, projects]);

  // Ensure there are at least 7 projects for layout purposes
  while (projects.length < 7) {
    projects.push({ id: "" } as Projects);
  }

  const totalPages = activeUsers.length / workersPerPage;
  const startIndex = (currentPage - 1) * workersPerPage;
  const currentWorker = activeUsers.slice(
    startIndex,
    startIndex + workersPerPage
  );

  // Start project action
  const StartLogAndSaveProject = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("maintenanceId", previewedProjectData?.id ?? "");
      formData.append("timeSheetId", timeSheetId ?? "");
      formData.append("userId", userId ?? "");
      await setMechanicProjectID(previewedProjectData?.id ?? "");

      const res = await startEngineerProject(formData);
      if (res) {
        router.push(`/dashboard/mechanic/projects/${previewedProjectData?.id}`);
      } else {
        console.error("Error starting project:", res);
      }
    } catch (error) {
      console.error("Exception in StartLogAndSaveProject:", error);
    }
  };

  // Render loading state if still fetching projects
  if (loading) {
    return (
      <Holds background="white" className="row-span-7 h-full animate-pulse">
        <Holds className="no-scrollbar overflow-y-auto">
          <Contents width="section" className="py-5">
            {projects.map((_, index) => (
              <Holds
                key={index}
                background="lightGray"
                className="h-1/6 my-2 py-7"
              />
            ))}
          </Contents>
        </Holds>
      </Holds>
    );
  }

  return (
    <Holds background="white" className="row-span-7 h-full">
      <Holds className="no-scrollbar overflow-y-auto">
        <Contents width="section" className="py-5">
          {projects.map((project: Projects, index) => {
            if (project.id === "") {
              return (
                <Holds
                  key={index}
                  background="lightGray"
                  className="h-1/6 my-2 py-7"
                />
              );
            }
            const isActive = project.maintenanceLogs.some(
              (log) => log.startTime && !log.endTime
            );
            return (
              <Holds key={project.id} className="h-full relative py-3">
                {isActive && (
                  <Holds
                    background="green"
                    className="absolute top-2 left-4 w-1/4 h-5 rounded-[10px] border-[3px] border-black flex items-center justify-center"
                  >
                    <Texts size="p7" className="text-center">
                      Active
                    </Texts>
                  </Holds>
                )}
                <Buttons
                  background="lightBlue"
                  onClick={() => {
                    setProjectPreviewId(project.id);
                    setIsOpenProjectPreview(true);
                  }}
                  className="w-full h-full py-4 rounded-[10px]"
                >
                  <Titles size="h2">{project?.equipment?.name}</Titles>
                </Buttons>
              </Holds>
            );
          })}
        </Contents>

        {/* Project Preview Modal */}
        <NModals
          size="screen"
          background="takeABreak"
          isOpen={isOpenProjectPreview}
          handleClose={() => {
            setIsOpenProjectPreview(false);
          }}
        >
          <Holds background="white" className="h-full">
            <Grids rows="8" gap="5">
              {/* Modal Header */}
              <Holds className="row-span-1 h-full justify-center">
                <TitleBoxes
                  title={
                    previewedProjectData?.equipment?.name
                      ? `${previewedProjectData?.equipment?.name.slice(
                          0,
                          20
                        )}...`
                      : "Project Preview"
                  }
                  titleImg="/mechanic.svg"
                  titleImgAlt="Mechanic"
                  onClick={() => {
                    setIsOpenProjectPreview(false);
                  }}
                  type="noIcon-NoHref"
                />
              </Holds>

              {/* Modal Content */}
              <Holds className="flex justify-center items-center h-full w-full row-start-2 row-end-8">
                <Contents width="section">
                  <Holds className="w-full relative">
                    {/* Left Pagination Button */}
                    <Buttons
                      className={`absolute top-[30%] left-0 w-9 h-9 flex items-center justify-center ${
                        currentPage <= 1 ? "hidden" : ""
                      }`}
                      onClick={() => {
                        setCurrentPage(currentPage - 1);
                      }}
                      disabled={currentPage <= 1}
                    >
                      <Images titleImg="/backArrow.svg" titleImgAlt="Back" />
                    </Buttons>

                    {/* Right Pagination Button */}
                    <Buttons
                      className={`absolute top-[30%] right-0 w-9 h-9 flex items-center justify-center ${
                        currentPage <= 1 ? "hidden" : ""
                      }`}
                      onClick={() => {
                        setCurrentPage(currentPage + 1);
                      }}
                      disabled={currentPage === activeUsers.length}
                    >
                      <Images titleImg="/forwardArrow.svg" titleImgAlt="Next" />
                    </Buttons>

                    <Labels position="left" size="p6">
                      Active Workers
                    </Labels>

                    {currentWorker.length > 0 ? (
                      currentWorker.map((user) => (
                        <Holds key={user.id}>
                          <Holds
                            background="lightGray"
                            className="p-4 flex items-center gap-2"
                          >
                            <img
                              src={user.image || "/person.svg"}
                              alt={user.name}
                              className={
                                user.image
                                  ? "w-20 h-20 rounded-full object-cover mx-auto border-[3px] border-black"
                                  : "w-16 h-16 rounded-full object-cover mx-auto"
                              }
                              title={user.name}
                            />
                            <Titles size="h4">{user.name}</Titles>
                            <Holds className="flex flex-col w-3/4 mx-auto">
                              <Labels
                                position="left"
                                size="p6"
                                htmlFor="totalTime"
                              >
                                Project total time
                              </Labels>
                              <Inputs
                                name="totalTime"
                                readOnly
                                className="text-center text-sm"
                                type="text"
                                value={getFormattedDuration(
                                  user.startTime,
                                  endTime
                                )}
                              />
                              <Holds
                                position="row"
                                className={`flex items-center justify-center ${
                                  currentPage <= 1 ? "hidden" : ""
                                }`}
                              >
                                {Array.from({ length: totalPages }).map(
                                  (_, index) => (
                                    <Texts
                                      key={index}
                                      className={`text-xxl ${
                                        index + 1 === currentPage
                                          ? "text-app-blue"
                                          : "text-app-gray"
                                      }`}
                                      size="p1"
                                    >
                                      .
                                    </Texts>
                                  )
                                )}
                              </Holds>
                            </Holds>
                          </Holds>
                        </Holds>
                      ))
                    ) : (
                      <Holds>
                        <Holds background="lightGray" className="p-10">
                          <Texts size="p6">No active workers</Texts>
                        </Holds>
                      </Holds>
                    )}
                  </Holds>

                  {/* Problem Received */}
                  <Holds>
                    <Labels htmlFor="equipmentIssue" size="p6">
                      Problem Received
                    </Labels>
                    <TextAreas
                      disabled
                      id="equipmentIssue"
                      name="equipmentIssue"
                      value={previewedProjectData?.equipmentIssue}
                      rows={2}
                    />
                  </Holds>

                  {/* Additional Info */}
                  <Holds>
                    <Labels htmlFor="additionalInfo" size="p6">
                      Additional Info
                    </Labels>
                    <TextAreas
                      disabled
                      id="additionalInfo"
                      name="additionalInfo"
                      value={previewedProjectData?.additionalInfo}
                      rows={2}
                    />
                  </Holds>
                </Contents>
              </Holds>
              {/* Modal Footer with Start Project Button */}
              <Holds className="flex justify-center items-center row-start-8 row-end-9 mb-5">
                <Contents width="section">
                  <Buttons
                    background="green"
                    className="py-3"
                    onClick={StartLogAndSaveProject}
                  >
                    <Titles size="h2">Start Project</Titles>
                  </Buttons>
                </Contents>
              </Holds>
            </Grids>
          </Holds>
        </NModals>
      </Holds>
    </Holds>
  );
}
