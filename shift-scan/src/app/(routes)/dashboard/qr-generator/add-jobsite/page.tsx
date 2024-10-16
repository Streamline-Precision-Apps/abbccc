"use server";
import "@/app/globals.css";
import { AddJobsiteContent } from "./addJobsiteContent";
import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Contents } from "@/components/(reusable)/contents";
import { Bases } from "@/components/(reusable)/bases";
import { getTranslations } from "next-intl/server";

export default async function NewJobsite() {
  const t = await getTranslations("Generator");
  return (
    <Bases>
      <Contents height={"page"}>
        <Holds background={"white"} className="my-3">
          <TitleBoxes
            title={`${t("CreateNew")} ${t("Jobsite")}`}
            titleImg="/jobsite.svg"
            titleImgAlt="Team"
            type="route"
            href="/dashboard/qr-generator"
          />
        </Holds>
        <AddJobsiteContent />
      </Contents>
    </Bases>
  );
}
