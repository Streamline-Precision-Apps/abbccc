import "@/app/globals.css";
import { AddJobsiteContent } from "./addJobsiteContent";
import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Contents } from "@/components/(reusable)/contents";
import { Bases } from "@/components/(reusable)/bases";
import { getTranslations } from "next-intl/server";

export default async function NewJobsite() {
  const t = await getTranslations("addJobsiteContent");
  return (
    <Bases>
    <Contents height={"page"}>
      <Holds background={"white"} className="my-3" >
        <TitleBoxes
          title={t("Title")}
          titleImg="/jobsite.svg"
          titleImgAlt="Team"
          variant={"default"}
          size={"default"}
          />
      </Holds>
      <AddJobsiteContent />
    </Contents>
    </Bases>
  );
}
