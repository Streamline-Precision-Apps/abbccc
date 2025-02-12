import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Selects } from "@/components/(reusable)/selects";
import { SearchAndCheck } from "./SearchAndCheck";
import { useEffect, useState } from "react";

type Priority = "PENDING" | "LOW" | "MEDIUM" | "HIGH" | "TODAY";

type Projects = {
  id: string;
  equipmentId: string;
  selected: boolean;
  priority: Priority;
  delay: Date | null;
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
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      setAllProjects([
        {
          id: "1",
          equipmentId: "abc",
          selected: false,
          priority: "HIGH",
          delay: null,
        },
        {
          id: "2",
          equipmentId: "def",
          selected: false,
          priority: "MEDIUM",
          delay: null,
        },
        {
          id: "3",
          equipmentId: "ghi",
          selected: true,
          priority: "LOW",
          delay: null,
        },
        {
          id: "4",
          equipmentId: "jkl",
          selected: false,
          priority: "PENDING",
          delay: null,
        },
        {
          id: "5",
          equipmentId: "mno",
          selected: false,
          priority: "TODAY",
          delay: null,
        },
        {
          id: "6",
          equipmentId: "pqr",
          selected: false,
          priority: "MEDIUM",
          delay: new Date(),
        },
        {
          id: "7",
          equipmentId: "stu",
          selected: false,
          priority: "HIGH",
          delay: null,
        },
        {
          id: "8",
          equipmentId: "vwx",
          selected: false,
          priority: "MEDIUM",
          delay: null,
        },
        {
          id: "9",
          equipmentId: "yz",
          selected: true,
          priority: "LOW",
          delay: null,
        },
      ]);
    };

    fetchProjects();
  }, []);

  // Filter logic
  useEffect(() => {
    if (!selectedFilter) {
      setFilteredProjects(allProjects);
      return;
    }

    if (selectedFilter === "DELAYED") {
      setFilteredProjects(
        allProjects.filter((project) => project.delay !== null)
      );
    } else {
      setFilteredProjects(
        allProjects.filter(
          (project) =>
            project.priority === selectedFilter && project.delay === null
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
