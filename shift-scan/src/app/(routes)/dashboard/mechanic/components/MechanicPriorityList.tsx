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
import { set } from "date-fns";
import { useEffect, useState } from "react";
import Slider from "react-slick";

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
  const [activeUsers, setActiveUsers] = useState<
    { id: string; name: string; image: string }[]
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
                  <Holds>
                    <Labels size={"p6"}>Active Workers</Labels>
                    <Holds className="border-[3px] border-black rounded-[10px] p-3">
                      <Slider {...settings}>
                        {activeUsers.length > 0 ? (
                          activeUsers.map((user) => (
                            <Holds
                              key={user.id}
                              className="p-2 flex items-center gap-2"
                            >
                              <img
                                src={user.image}
                                alt={user.name}
                                className="w-10 h-10 rounded-full object-cover"
                                title={`${user.name}`}
                              />
                              <Texts size={"p6"}>{user.name}</Texts>
                            </Holds>
                          ))
                        ) : (
                          <Holds background={"lightGray"} className="p-10">
                            <Texts size={"p6"}>No active workers</Texts>
                          </Holds>
                        )}
                      </Slider>
                    </Holds>
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
