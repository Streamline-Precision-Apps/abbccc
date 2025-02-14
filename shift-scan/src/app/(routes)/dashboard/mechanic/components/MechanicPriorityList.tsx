"use client";
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
import { Priority } from "@/lib/types";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import { formatISO } from "date-fns";
import { getFormattedDuration } from "@/utils/getFormattedDuration";
import { Inputs } from "@/components/(reusable)/inputs";

type Equipment = {
  id: string;
  name: string;
};

type MaintenanceLog = {
  id: string;
  startTime: string;
  endTime: string;
  userId: string;
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
  priority: Priority;
  delay: Date | null;
  maintenanceLogs: MaintenanceLog[];
  equipment: Equipment;
};

const settings = {
  dots: true,
  draggable: true,
  speed: 500,
  arrows: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  infinite: false,
  autoplay: true,
  autoplaySpeed: 4000,
  pauseOnHover: true,
  pauseOnFocus: true,
};

export default function MechanicPriority() {
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<Projects[]>([]);
  const [isOpenProjectPreview, setIsOpenProjectPreview] = useState(false);
  const [projectPreviewId, setProjectPreviewId] = useState<string | null>(null); // [setProjectPreviewId]
  const [previewedProjectData, setPreviewedProjectData] = useState<Projects>();
  const [endTime] = useState(
    new Date(
      new Date().getTime() - new Date().getTimezoneOffset() * 60 * 1000
    ).toISOString()
  );

  const [activeUsers, setActiveUsers] = useState<
    {
      id: string;
      name: string;
      image: string;
      startTime: string;
    }[]
  >([]);
  {
    /* #create api to fetch a single project  */
  }

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/getMaintenanceProjects");
        const data = await response.json();
        const filteredData = data.filter(
          (project: Projects) => project.selected
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
    if (projectPreviewId) {
      const project = projects.find((p) => p.id === projectPreviewId);
      setPreviewedProjectData(project);

      if (project) {
        const activeUsersList = project.maintenanceLogs
          .filter((log) => log.startTime && !log.endTime) // Find logs with an active session
          .map((log) => ({
            id: log.user.id,
            name: `${log.user.firstName} ${log.user.lastName}`,
            image: log.user.image, // If you want to display images
            startTime: new Date(log.startTime).toISOString(),
          }));

        setActiveUsers(activeUsersList);
      }
    }
  }, [projectPreviewId, projects]);

  // Ensure there are always at least 7 items
  while (projects.length < 7) {
    projects.push({ id: "" } as Projects);
  }

  if (loading) {
    return (
      <Holds background={"white"} className="row-span-7 h-full animate-pulse">
        <Holds className="no-scrollbar overflow-y-auto ">
          <Contents width={"section"} className="py-5 ">
            {projects.map((_, index) => (
              <Holds
                key={index}
                background={"lightGray"}
                className="h-1/6 my-2 py-7"
              />
            ))}
          </Contents>
        </Holds>
      </Holds>
    );
  }

  return (
    <Holds background={"white"} className="row-span-7 h-full">
      <Holds className="no-scrollbar overflow-y-auto ">
        <Contents width={"section"} className="py-5">
          {projects.map((project: Projects, index) => {
            if (project.id === "") {
              return (
                <Holds
                  key={index}
                  background={"lightGray"}
                  className="h-1/6 my-2 py-7 "
                />
              );
            }
            // Check if any maintenance log is active (has a startTime but no endTime)
            const isActive = project.maintenanceLogs.some(
              (log) => log.startTime && !log.endTime
            );

            return (
              <Holds key={project.id} className="h-full relative py-3">
                {isActive && (
                  <Holds
                    background={"green"}
                    className="absolute top-2 left-4 w-1/4 h-5 rounded-[10px] border-[3px] border-black flex items-center justify-center"
                  >
                    <Texts size={"p7"} className="text-center">
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
                  <Titles size={"h2"}>{project?.equipment?.name}</Titles>
                </Buttons>
              </Holds>
            );
          })}
        </Contents>
        {/* Project Preview Modal to start the project or join the project */}
        <NModals
          size={"screen"}
          background={"takeABreak"}
          isOpen={isOpenProjectPreview}
          handleClose={() => setIsOpenProjectPreview(false)}
        >
          <Holds background={"white"} className="h-full">
            <Grids rows={"8"} gap={"5"}>
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
                  onClick={() => setIsOpenProjectPreview(false)}
                  type="noIcon-NoHref"
                />
              </Holds>
              <Holds className="flex justify-center items-center h-full w-full row-start-2 row-end-8">
                <Contents width={"section"}>
                  <Holds position={"row"} className="w-full">
                    <Labels size={"p6"}>Active Workers</Labels>

                    {activeUsers.length > 0 ? (
                      activeUsers.map((user) => (
                        <div key={user.id}>
                          <Holds className="p-4 flex items-center gap-2 ">
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
                            <Titles size={"h4"}>{user.name}</Titles>
                            <Holds className="flex flex-col w-3/4 mx-auto">
                              <Labels
                                position={"left"}
                                size={"p6"}
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
                            </Holds>
                          </Holds>
                        </div>
                      ))
                    ) : (
                      <div>
                        <Holds background={"lightGray"} className="p-10">
                          <Texts size={"p6"}>No active workers</Texts>
                        </Holds>
                      </div>
                    )}
                  </Holds>

                  <Holds>
                    <Labels htmlFor="equipmentIssue" size={"p6"}>
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
                  <Holds>
                    <Labels htmlFor="additionalInfo" size={"p6"}>
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
              <Holds className="flex justify-center items-center row-start-8 row-end-9 mb-5 ">
                <Contents width={"section"}>
                  <Buttons
                    background={"green"}
                    href={`/dashboard/mechanic/projects/${projectPreviewId}`}
                    className="py-3"
                  >
                    <Titles size={"h2"}>Start Project</Titles>
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
