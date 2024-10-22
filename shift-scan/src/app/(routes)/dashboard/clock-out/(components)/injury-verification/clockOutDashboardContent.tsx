"use server";
import { getTranslations } from "next-intl/server";
import "@/app/globals.css";
import ClockOutButtons from "@/components/clockOutButtons";
import { Bases } from "@/components/(reusable)/bases";
import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Contents } from "@/components/(reusable)/contents";

export default async function ClockOutDashboardContent() {
  const t = await getTranslations("Clock-out");

  return (
    <Bases>
      <Holds>
        <Contents width={"section"}>
          <TitleBoxes
            title={t("Title")}
            titleImg="/profile.svg"
            titleImgAlt="Team"
            variant={"default"}
            size={"default"}
          />
        </Contents>
      </Holds>
      <ClockOutButtons />
    </Bases>
  );
}
