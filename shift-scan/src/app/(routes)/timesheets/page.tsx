"use server";
import { auth } from "@/auth";
import ViewTimeSheets from "@/app/(routes)/timesheets/view-timesheets";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Grids } from "@/components/(reusable)/grids";

export default async function Timesheets() {
  const session = await auth();
  if (!session) {
    redirect("/signin");
  }
  const id = session?.user.id;
  const t = await getTranslations("Home");
  return (
    <Bases>
      <Contents>
        <Grids rows={"8"} gap={"3"}>
          <Holds
            position={"row"}
            background={"white"}
            className="row-span-1 h-full"
          >
            <TitleBoxes
              title={`${t("Title")}`}
              titleImg={"/form.svg"}
              titleImgAlt={`${t("Title")}`}
              size={"default"}
            />
          </Holds>
          <Holds className="row-span-7 h-full">
            <ViewTimeSheets user={id} />
          </Holds>
        </Grids>
      </Contents>
    </Bases>
  );
}
