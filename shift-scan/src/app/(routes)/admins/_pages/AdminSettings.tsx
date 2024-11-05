"use client";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { AdminContact } from "./settings/contact";
import { AdminEditContact } from "./settings/AdminEditContact";
import { useState } from "react";
export const AdminSettings = () => {
  const [view, setView] = useState(0);
  const editView = (view: number) => {
    setView(view);
  };
  if (view === 1) {
    return <AdminEditContact editView={editView} />;
  } else {
    return (
      <>
        <Holds position={"row"} className="h-full gap-5">
          <Holds className="flex-col h-full w-1/3 hidden lg:flex ">
            <Holds background={"white"} className="h-1/2 mb-5">
              <AdminContact editView={editView} />
            </Holds>
            <Holds background={"white"} className="h-1/2">
              <Texts>Settings section here</Texts>
            </Holds>
          </Holds>
          <Holds background={"white"} className="h-full w-full">
            <Texts>Settings sent reset section here</Texts>
          </Holds>
        </Holds>
      </>
    );
  }
};
