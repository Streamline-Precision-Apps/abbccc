"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { useEffect, useState } from "react";

export default function MechanicPriority() {
  const [loading, setLoading] = useState(true);
  const initialProjects = [
    "mechanic",
    "mechanic",
    "mechanic",
    "mechanic",
    "mechanic",
    "mechanic",
  ];

  // Ensure there are always at least 7 items
  const projects = [
    ...initialProjects,
    ...Array(Math.max(0, 6 - initialProjects.length)).fill(""),
  ];

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []); // Added dependency array to prevent infinite effect runs

  if (loading) {
    return (
      <Holds className="no-scrollbar overflow-y-auto">
        <Contents width={"section"} className="py-5">
          {projects.map((_, index) => (
            <Holds
              key={index}
              background={"lightGray"}
              className="h-1/6 my-2 py-7 animate-pulse"
            ></Holds>
          ))}
        </Contents>
      </Holds>
    );
  }

  return (
    <Holds className="no-scrollbar overflow-y-auto">
      <Contents width={"section"} className="">
        {projects.map((project, index) => (
          <Holds key={index} className="h-full relative pt-4 pb-3">
            {project === "mechanic" && (
              <Holds
                background={"green"}
                className="absolute top-2 left-4 w-1/4 h-5 rounded-[10px] border-[3px] border-black items-center justify-center"
              >
                <Texts size={"p7"} className="text-center">
                  Active
                </Texts>
              </Holds>
            )}
            <Buttons
              background={project ? "lightBlue" : "lightGray"}
              href={project ? `/dashboard/mechanic/${project}` : undefined}
              className={
                project
                  ? "w-full h-full py-4 rounded-[10px]"
                  : `w-full h-full py-8 rounded-[10px} border-none shadow-none`
              }
            >
              <Titles size={"h2"}>{project || ""}</Titles>
            </Buttons>
          </Holds>
        ))}
      </Contents>
    </Holds>
  );
}
