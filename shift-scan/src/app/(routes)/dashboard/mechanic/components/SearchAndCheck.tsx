"use client";
import { setProjectSelected } from "@/actions/mechanicActions";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { useRef, useState } from "react";

type Priority = "PENDING" | "LOW" | "MEDIUM" | "HIGH" | "TODAY";

type Projects = {
  id: string;
  equipmentId: string;
  selected: boolean;
  priority: Priority;
  delay: Date | null;
};
export const SearchAndCheck = ({
  AllProjects,
}: {
  AllProjects: Projects[];
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const priorityOrder: Priority[] = [
    "TODAY",
    "HIGH",
    "MEDIUM",
    "LOW",
    "PENDING",
  ];

  const sortedProjects = AllProjects.sort((a, b) => {
    const indexA = priorityOrder.indexOf(a.priority);
    const indexB = priorityOrder.indexOf(b.priority);
    return indexA - indexB;
  });

  const filteredProjects = sortedProjects.filter((project) => {
    return project.equipmentId.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <Grids rows={"8"} className="h-full w-full">
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
            className=" border-none focus:outline-none"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
        </Holds>
        <Holds size={"20"} onClick={() => setSearchTerm("")}>
          <Texts size={"p1"}>X</Texts>
        </Holds>
      </Holds>
      <Holds
        background={"darkBlue"}
        className="row-start-2 row-end-9 h-full w-full overflow-y-auto no-scrollbar rounded-none"
      >
        {filteredProjects.map((project, index) => (
          <Holds
            background={"white"}
            position={"row"}
            key={index}
            className=" w-full border-[3px] border-black rounded-[10px] mb-2 py-2 "
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
            <Holds size={"60"}>
              <Texts size={"p1"}>{project.equipmentId}</Texts>
            </Holds>
            <Holds size={"20"}>
              <Holds
                className="h-8 w-8 rounded-[10px] shadow-[6px_6px_0px_grey]"
                onClick={() =>
                  setProjectSelected(project.id, !project.selected)
                }
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
          </Holds>
        ))}
      </Holds>
    </Grids>
  );
};
