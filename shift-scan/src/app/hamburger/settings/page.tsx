"use server";
import SettingSelections from "@/app/hamburger/settings/content";
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
        <Grids rows={"10"} gap={"5"}>
          <Holds background={"white"} className="row-span-2 ">
            <TitleBoxes
              title={t("Title")}
              titleImg="/Settings.svg"
              titleImgAlt="Settings"
              size={"default"}
            />
          </Holds>
          <SettingSelections id={userId} />
        </Grids>
      </Contents>
    </Bases>
  );
}
