import React from "react";
import { useTranslations } from "next-intl";
import "@/app/globals.css";
import ClockOutButtons from "@/components/clockOutButtons";
import { useRouter } from "next/navigation";
import { Bases } from "@/components/(reusable)/bases";
import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";

export default function ClockOutDashboardContent() {
  const t = useTranslations("Clock-out");
  const router = useRouter();

  return (
    <Bases>
      <Holds size={"titleBox"}>
        <TitleBoxes
          title={t("Title")}
          titleImg="/profile.svg"
          titleImgAlt="Team"
          variant={"default"}
          size={"default"}
        />
      </Holds>
      <ClockOutButtons />
    </Bases>
  );
}
