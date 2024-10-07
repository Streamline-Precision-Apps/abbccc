"use server";
import Content from "@/app/hamburger/inbox/content";
import { auth } from "@/auth";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { getTranslations } from "next-intl/server";

export default async function Inbox() {
  const session = await auth();
  if (!session) return null;
  const t = await getTranslations("Hamburger");

  return (
    <Bases size={"scroll"}>
      <Contents>
        <Grids className="grid-rows-10">
          <Holds background={"white"} className="row-span-2">
            <TitleBoxes
              title={t("Inbox")}
              titleImg="/Inbox.svg"
              titleImgAlt="Inbox"
            />
          </Holds>
          <Holds background={"white"} className="row-span-8 h-full">
            <Content />
          </Holds>
        </Grids>
      </Contents>
    </Bases>
  );
}
