import "@/app/globals.css";
import { Bases } from "@/components/(reusable)/bases";
import { Sections } from "@/components/(reusable)/sections";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import QrJobsiteContent from "./qrJobsiteContent";
import QrEquipmentContent from "./qrEquipmentContent";

export default function QrGeneratorDashboard() {
  return (
    <Bases>
      <Sections size={"titleBox"}>
        <TitleBoxes
          title="QR Generator"
          titleImg="/profile.svg"
          titleImgAlt="Team"
          variant={"default"}
          size={"default"}
        />
      </Sections>
      <Sections size={"dynamic"}>
        <QrJobsiteContent />
      </Sections>
      <Sections size={"dynamic"}>
        <QrEquipmentContent />
      </Sections>
    </Bases>
  );
}
