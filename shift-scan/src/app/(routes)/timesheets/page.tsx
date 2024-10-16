"use server";
import { auth } from "@/auth";
import ViewTimeSheets from "@/app/(routes)/timesheets/view-timesheets";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

export default async function Timesheets() {
  const session = await auth();
  if (!session) {
    redirect("/signin");
  }
  const id = session?.user.id;
  const t = await getTranslations("Home");
  return (
    <Bases size={"scroll"} className="min-h-screen">
      <Contents>
        <Holds background={"white"} size={"full"} className=" mt-7 h-full">
          <TitleBoxes
            title={`${t("Title")}`}
            titleImg={"/form.svg"}
            titleImgAlt={`${t("Title")}`}
            size={"default"}
          />
        </Holds>
        <Holds className="mb-3 h-full">
          <ViewTimeSheets user={id} />
        </Holds>
      </Contents>
    </Bases>
  );
}
