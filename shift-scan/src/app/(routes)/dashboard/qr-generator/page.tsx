"use server";
import "@/app/globals.css";
import { Bases } from "@/components/(reusable)/bases";
import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import QrJobsiteContent from "./qrJobsiteContent";
import QrEquipmentContent from "./qrEquipmentContent";
import { Contents } from "@/components/(reusable)/contents";
import { getTranslations } from "next-intl/server";
import { Images } from "@/components/(reusable)/images";
import { Titles } from "@/components/(reusable)/titles";
import { Buttons } from "@/components/(reusable)/buttons";

export default async function QrGeneratorDashboard() {
  const q = await getTranslations("qr-Generator");
  const t = await getTranslations("QrJobsiteContent");
  const u = await getTranslations("qrEquipmentContent");

return (
  <Bases>
    <Contents height={"page"}>
      <Holds
        background={"white"}
        className="m-3 "
      >
          <TitleBoxes
              title={q("Title")}
              titleImg="/qr.svg"
              titleImgAlt="Team"
            />
      </Holds>
{/*-----------------------------------------------------*/}
{/* This is the jobsite content */}
        <Holds background={"white"} 
        className="mb-3"
        >
          <Contents width={"section"}>
        <Holds size={"10"}>
            <Images 
            titleImg="/jobsite.svg" 
            titleImgAlt="jobsite" 
            size={"full"} 
            />
        </Holds>
            <Titles 
            size={"h2"}
            >
              {t("Jobsite")}
            </Titles>

            <QrJobsiteContent />
          </Contents>
        </Holds>
{/*-----------------------------------------------------*/}
{/* This is the equipment content */}
        <Holds background={"white"} >
        <Contents width={"section"}>
            <Images titleImg="/equipment.svg" titleImgAlt="equipment" size={"10"}/>
            <Titles size={"h2"}>{u("Equipment")}</Titles>
          <QrEquipmentContent />
        </Contents>
        </Holds>
    </Contents>
  </Bases>
  );
}
