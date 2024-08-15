import "@/app/globals.css";
import { Bases } from "@/components/(reusable)/bases";
import { Sections } from "@/components/(reusable)/sections";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import QrJobsiteContent from "./qrJobsiteContent";
import QrEquipmentContent from "./qrEquipmentContent";
import { useTranslations } from "next-intl";

export default function QrGeneratorDashboard() {
  const t = useTranslations("qr-Generator");
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
      <Sections size={"half"}>
        <QrJobsiteContent />
      </Sections>
      <Sections size={"half"}>
        <QrEquipmentContent />
      </Sections>
    </Bases>
  );
}
