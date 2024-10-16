import "@/app/globals.css";
import { AddEquipmentContent } from "./addEquipmentContent";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Holds } from "@/components/(reusable)/holds";
import { getTranslations } from "next-intl/server";
export default async function NewEquipment() {
  const t = await getTranslations("Generator");
  return (
    <Bases>
      <Contents height={"page"}>
        <Holds background="white" className="my-3">
          <TitleBoxes
            title={`${t("CreateNew")} ${t("Equipment")}`}
            titleImg="/equipment.svg"
            titleImgAlt="Team"
            type="route"
            href="/dashboard/qr-generator"
          />
        </Holds>
        <AddEquipmentContent />
      </Contents>
    </Bases>
  );
}
