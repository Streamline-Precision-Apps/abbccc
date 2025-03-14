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
  const isManager = session.user.permission !== "USER";

  return (
    <Bases className="fixed w-full h-full">
      <Contents height={"page"}>
        <Grids rows={"10"} gap={"5"}>
          <Holds background={"white"} className="row-span-2 h-full">
            <Contents width={"section"}>
              <TitleBoxes
                title={t("Inbox")}
                titleImg="/Inbox.svg"
                titleImgAlt="Inbox"
              />
            </Contents>
          </Holds>

          <Content isManager={isManager} />
        </Grids>
      </Contents>
    </Bases>
  );
}
