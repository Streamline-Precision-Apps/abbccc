import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Selects } from "@/components/(reusable)/selects";
import { SearchAndCheck } from "./SearchAndCheck";
import { useEffect, useState } from "react";
import { Priority } from "@/lib/types";

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
  repaired: boolean;
  priority: Priority;
  delay: Date | null;
  maintenanceLogs: MaintenanceLog[];
  equipment: Equipment;
};

export default function MechanicSelectList() {
  const [allProjects, setAllProjects] = useState<Projects[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Projects[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("");

  const PriorityOptions = [
    { label: "Select Filter", value: "" },
    { label: "Pending", value: "PENDING" },
    { label: "Delayed", value: "DELAYED" },
    { label: "High Priority", value: "HIGH" },
    { label: "Medium Priority", value: "MEDIUM" },
    { label: "Low Priority", value: "LOW" },
    { label: "TODAY", value: "TODAY" },
    { label: "REPAIRED", value: "REPAIRED" },
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/getMaintenanceProjects");
        const data = await response.json();
        setAllProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  // Filter logic
  useEffect(() => {
    if (!selectedFilter) {
      setFilteredProjects(
        allProjects.filter((project) => project.repaired === false)
      );
      return;
    }

    if (selectedFilter === "DELAYED") {
      setFilteredProjects(
        allProjects.filter(
          (project) => project.delay !== null && project.repaired === false
        )
      );
    } else if (selectedFilter === "REPAIRED") {
      setFilteredProjects(
        allProjects.filter((project) => project.repaired === true)
      );
    } else {
      setFilteredProjects(
        allProjects.filter(
          (project) =>
            project.priority === selectedFilter &&
            project.delay === null &&
            project.repaired === false
        )
      );
    }
  }, [selectedFilter, allProjects]);

  return (
    <Grids rows={"8"} cols={"4"} gap={"5"} className="h-full p-4">
      <Holds className="col-start-1 col-end-2 row-start-1 row-end-2 h-full w-full">
        <Buttons
          href="/dashboard/mechanic/new-repair"
          background={"green"}
          className="h-full justify-center items-center"
        >
          <Images
            titleImg="/plus.svg"
            titleImgAlt="Add New Repair"
            className="mx-auto"
          />
        </Buttons>
      </Holds>
      <Holds className="col-start-2 col-end-6 row-start-1 row-end-2 h-full w-full">
        <Selects
          className="w-full h-full"
          onChange={(e) => setSelectedFilter(e.target.value)}
        >
          {PriorityOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="text-center"
            >
              {option.label}
            </option>
          ))}
        </Selects>
      </Holds>
      <Holds className="col-start-1 col-end-6 row-start-2 row-end-9 h-full w-full border-[3px] border-black rounded-[10px]">
        <SearchAndCheck AllProjects={filteredProjects} />
      </Holds>
    </Grids>
  );
}
