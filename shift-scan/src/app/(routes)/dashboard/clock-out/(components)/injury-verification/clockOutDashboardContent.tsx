import React from "react";
import { useTranslations } from "next-intl";
import "@/app/globals.css";
import ClockOutButtons from "@/components/clockOutButtons";
import { useRouter } from "next/navigation";
import { Bases } from "@/components/(reusable)/bases";
import { Sections } from "@/components/(reusable)/sections";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";

export default function ClockOutDashboardContent() {
  const t = useTranslations("Clock-out");
  const router = useRouter();

  return (
    <Bases>
      <Sections size={"titleBox"}>
        <TitleBoxes
          title={t("Title")}
          titleImg="/profile.svg"
          titleImgAlt="Team"
          variant={"default"}
          size={"default"}
        />
      </Sections>
      <ClockOutButtons />
    </Bases>
  );
}
