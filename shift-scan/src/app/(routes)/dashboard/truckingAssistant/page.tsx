"use server";
import { auth } from "@/auth";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { getTranslations } from "next-intl/server";
import Content from "./content";

export default async function Inbox() {
  const session = await auth();
  if (!session) return null;
  const t = await getTranslations("TruckingAssistant");

  return (
    <Bases>
      <Contents height={"page"}>
        <Grids rows={"10"} gap={"5"}>
          <Holds background={"white"} className="row-span-2 h-full">
            <Contents width={"section"}>
              <TitleBoxes
                title={t("TruckingAssistant")}
                titleImg="/trucking.svg"
                titleImgAlt="Truck"
              />
            </Contents>
          </Holds>
          <Holds className="row-span-8 h-full">
            <Content />
          </Holds>
        </Grids>
      </Contents>
    </Bases>
  );
}
