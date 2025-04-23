"use server";
import "@/app/globals.css";

import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Contents } from "@/components/(reusable)/contents";
import { Bases } from "@/components/(reusable)/bases";
import { getTranslations } from "next-intl/server";
import { Grids } from "@/components/(reusable)/grids";
import { Titles } from "@/components/(reusable)/titles";
import AddJobsiteForm from "./addJobsiteForm";

export default async function NewJobsite() {
  const t = await getTranslations("Generator");
  return (
    <Bases>
      <Contents>
        <Grids rows={"7"} gap={"5"}>
          <AddJobsiteForm />
        </Grids>
      </Contents>
    </Bases>
  );
}
