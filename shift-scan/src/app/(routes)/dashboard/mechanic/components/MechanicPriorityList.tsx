"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { Priority } from "@/lib/types";
import { useEffect, useState } from "react";

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

type Projects = {
  id: string;
  equipmentId: string;
  selected: boolean;
  priority: Priority;
  delay: Date | null;
  maintenanceLogs: MaintenanceLog[];
  equipment: Equipment;
};

export default function MechanicPriority() {
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<Projects[]>([]);

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

  // Ensure there are always at least 7 items
  while (projects.length < 7) {
    projects.push({ id: "" } as Projects);
  }

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  if (loading) {
    return (
      <Holds className="no-scrollbar overflow-y-auto">
        <Contents width={"section"} className="py-5">
          {projects.map((_, index) => (
            <Holds
              key={index}
              background={"lightGray"}
              className="h-1/6 my-2 py-7 animate-pulse"
            />
          ))}
        </Contents>
      </Holds>
    );
  }

  return (
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
                href={`/dashboard/mechanic/${project.id}`}
                className="w-full h-full py-4 rounded-[10px]"
              >
                <Titles size={"h2"}>{project?.equipment?.name}</Titles>
              </Buttons>
            </Holds>
          );
        })}
      </Contents>
    </Holds>
  );
}
