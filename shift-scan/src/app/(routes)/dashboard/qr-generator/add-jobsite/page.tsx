"use server";
import "@/app/globals.css";
import { AddJobsiteContent } from "./addJobsiteContent";
import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Contents } from "@/components/(reusable)/contents";
import { Bases } from "@/components/(reusable)/bases";
import { getTranslations } from "next-intl/server";
import { Grids } from "@/components/(reusable)/grids";

export default async function NewJobsite() {
  const t = await getTranslations("addJobsiteContent");
  return (
    <Bases size={"scroll"}>
      <Contents>
        <Grids rows={"8"}>
          <Holds background={"white"} className="row-span-1 h-full" >
            <Contents width={"section"}>
              <TitleBoxes
              title={t("Title")}
              titleImg="/jobsite.svg"
              titleImgAlt="Team"
              className="my-auto"/>
            </Contents>
          </Holds>
          <Holds className="row-span-7 h-full">
            <AddJobsiteContent/>
          </Holds>
        </Grids>
      </Contents>
    </Bases>
  );
}
