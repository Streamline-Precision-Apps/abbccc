"use client";
import "@/app/globals.css";
import { useState } from "react";
import { Sections } from "@/components/(reusable)/sections";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import AddJobsiteForm from "./addJobsiteForm";
import { Bases } from "@/components/(reusable)/bases";

export const AddJobsiteContent = () => {

  return (
    <Bases>
      <Sections size={"titleBox"}>
        <TitleBoxes
          title="Create Equipment"
          titleImg="/profile.svg"
          titleImgAlt="Team"
          variant={"default"}
          size={"default"}
        />
      </Sections>
      <Sections size={"dynamic"}>
        <AddJobsiteForm />
      </Sections>
    </Bases>
  );
};
