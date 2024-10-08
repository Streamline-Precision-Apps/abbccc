import "@/app/globals.css";
import { AddEquipmentContent } from "./addEquipmentContent";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Holds } from "@/components/(reusable)/holds";
import { getTranslations } from "next-intl/server";
export default async function NewEquipment() {
  const t = await getTranslations("addEquipmentContent");
  return (
    <Bases>
    <Contents height={"page"}>
      <Holds size={"first"} background="white" className="my-3" >
        <TitleBoxes
          title={t("Title")}
          titleImg="/equipment.svg"
          titleImgAlt="Team"
          />
      </Holds>
      <AddEquipmentContent />
    </Contents>
    </Bases>
  );

}
