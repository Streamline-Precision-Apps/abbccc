"use client";
import "@/app/globals.css";
import { useState } from "react";
import { Sections } from "@/components/(reusable)/sections";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import AddJobsiteForm from "./addJobsiteForm";
import { Bases } from "@/components/(reusable)/bases";
import { useTranslations } from "next-intl";
import { Contents } from "@/components/(reusable)/contents";

export const AddJobsiteContent = () => {
  const t = useTranslations("addJobsiteContent");

  return (
    <Bases>
    <Contents size={"default"}>
      <Sections size={"titleBox"}>
        <TitleBoxes
          title={t("Title")}
          titleImg="/profile.svg"
          titleImgAlt="Team"
          variant={"default"}
          size={"default"}
          />
      </Sections>
      <Sections size={"dynamic"}>
        <AddJobsiteForm />
      </Sections>
    </Contents>
    </Bases>
  );
};
