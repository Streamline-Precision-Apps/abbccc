"use server";
import prisma from "@/lib/prisma";
import EquipmentLogContent from "@/app/(routes)/dashboard/equipment/content";
import { auth } from "@/auth";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { getTranslations } from "next-intl/server";
import { Grids } from "@/components/(reusable)/grids";

export default async function Current() {
  const session = await auth();
  const userId = session?.user?.id;
  const t = await getTranslations("EquipmentContent");

  // use translate breaks here for what ever reason
  return (
    <Bases>
      <Contents>
        <Grids rows={"10"} gap={"5"}>
          <Holds
            background={"white"}
            size={"full"}
            className="row-span-2 h-full "
          >
            <TitleBoxes
              title={t("Title")}
              titleImg="/equipment.svg"
              titleImgAlt="Current"
              variant={"default"}
              size={"default"}
              className="my-auto relative"
              href="/dashboard"
            />
          </Holds>
          <Holds background={"white"} className="row-span-8 h-full">
            <EquipmentLogContent userId={userId} />
          </Holds>
        </Grids>
      </Contents>
    </Bases>
  );
}
