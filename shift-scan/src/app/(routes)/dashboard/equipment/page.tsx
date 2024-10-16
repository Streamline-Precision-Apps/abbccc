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
  const t = await getTranslations("Equipment");

  // use translate breaks here for what ever reason
  return (
    <Bases>
      <Contents>
        <EquipmentLogContent userId={userId} />
      </Contents>
    </Bases>
  );
}
