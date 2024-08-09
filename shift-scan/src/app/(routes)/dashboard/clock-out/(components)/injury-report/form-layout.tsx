"use client";
import "@/app/globals.css";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { InjuryReportContent } from "./injuryReportContent";
import { useTranslations } from "next-intl";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Sections } from "@/components/(reusable)/sections";
export default function InjuryReport() {
  const t = useTranslations("clock-out");
  return (
    <Bases>
      <Contents size={"default"}>
        <Sections size={"titleBox"}>
        <TitleBoxes
          title={t("InjuryReport")}
          titleImg="/injury.svg"
          titleImgAlt="Team"
          variant={"default"}
          size={"default"}
        />
        </Sections>
          <InjuryReportContent handleNextStep={() => {}} />
        </Contents>
      </Bases>
  );
}
