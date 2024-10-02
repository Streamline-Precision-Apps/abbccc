"use server";
import Index from "@/app/hamburger/settings/content";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { getTranslations } from "next-intl/server";

export default async function Settings() {
  const session = await auth();
  if (!session) return null;
  const userId = session.user.id;

  const t = await getTranslations("Hamburger");

  return (
    <Bases>
      <Contents>
        <Grids size={"settings"}>
          <Holds
            background={"white"}
            className="row-span-1 px-4 justify-center h-full"
          >
            <TitleBoxes
              title={t("Title")}
              titleImg="/Settings.svg"
              titleImgAlt="Settings"
              variant={"default"}
              size={"default"}
            />
          </Holds>
          <Index />
        </Grids>
      </Contents>
    </Bases>
  );
}
