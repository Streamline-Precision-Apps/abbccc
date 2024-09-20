"use server";
import "@/app/globals.css";
import { Bases } from "@/components/(reusable)/bases";
import { Sections } from "@/components/(reusable)/sections";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import QrJobsiteContent from "./qrJobsiteContent";
import QrEquipmentContent from "./qrEquipmentContent";
import prisma from "@/lib/prisma";
import { Contents } from "@/components/(reusable)/contents";
import { getTranslations } from "next-intl/server";
import { Images } from "@/components/(reusable)/images";
import { Titles } from "@/components/(reusable)/titles";
import { Buttons } from "@/components/(reusable)/buttons";
import { Holds } from "@/components/(reusable)/holds";

export default async function QrGeneratorDashboard() {
  const q = await getTranslations("qr-Generator");
  const t = await getTranslations("QrJobsiteContent");
  const u = await getTranslations("qrEquipmentContent");

  return (
    <Bases>
    <Contents>
    <Sections size={"titleBox"}>
        <TitleBoxes
          title={q("Title")}
          titleImg="/new/qr.svg"
          titleImgAlt="Team"
          variant={"default"}
          size={"default"}
          />
    </Sections>
      <Sections size={"default"}>
      <Holds className="w-full">
        <Images titleImg="/new/jobsite.svg" titleImgAlt="jobsite" variant={"icon"} size={"iconMed"}/>
        <Titles variant={"default"} size={"default"}>{t("Jobsite")}</Titles>
        <QrJobsiteContent />
        <Images titleImg="/new/equipment.svg" titleImgAlt="equipment" variant={"icon"} size={"iconMed"}/>
          <Titles variant={"default"} size={"default"}>{u("Equipment")}</Titles>
        <QrEquipmentContent />
      </Holds>
      </Sections>
    </Contents>
    </Bases>
  );
}
