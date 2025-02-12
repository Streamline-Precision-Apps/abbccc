import "@/app/globals.css";
import { AddEquipmentContent } from "./addEquipmentContent";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Holds } from "@/components/(reusable)/holds";
import { getTranslations } from "next-intl/server";
import { Grids } from "@/components/(reusable)/grids";

export default async function NewEquipment() {
  const t = await getTranslations("Generator");
  return (
    <Bases>
      <Contents>
        <Grids rows={"8"}>
          <Holds background="white" className="row-span-1 h-full">
            <Contents width={"section"}>
              <TitleBoxes
                title={`${t("CreateNew")} ${t("EquipmentTitle")} `}
                titleImg="/equipment.svg"
                titleImgAlt="Team"
              />
            </Contents>
          </Holds>
          <Holds className="row-span-7 h-full">
            <AddEquipmentContent />
          </Holds>
        </Grids>
      </Contents>
    </Bases>
  );
}
