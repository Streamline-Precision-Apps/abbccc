"use server";
import { auth } from "@/auth";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { getTranslations } from "next-intl/server";
import TruckingAssistant from "./TruckingAssistant";

export default async function Inbox() {
  const session = await auth();
  if (!session) return null;
  const t = await getTranslations("TruckingAssistant");

  return (
    <Bases>
      <Contents>
        <Grids rows={"7"} gap={"5"}>
          <Holds background={"white"} className="row-span-1 h-full">
            <TitleBoxes
              title={t("TruckingAssistant")}
              titleImg="/trucking.svg"
              titleImgAlt="Truck"
            />
          </Holds>
          <Holds className="row-span-6 h-full">
            <TruckingAssistant />
          </Holds>
        </Grids>
      </Contents>
    </Bases>
  );
}
