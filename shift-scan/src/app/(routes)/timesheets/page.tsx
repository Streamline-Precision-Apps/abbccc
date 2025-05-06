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
import { Images } from "@/components/(reusable)/images";
import { Titles } from "@/components/(reusable)/titles";

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
        <Grids rows={"7"} gap={"5"} className="h-full w-full">
          <ViewTimeSheets user={id} />
        </Grids>
      </Contents>
    </Bases>
  );
}
