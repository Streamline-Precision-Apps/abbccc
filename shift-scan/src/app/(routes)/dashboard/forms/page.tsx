"use server";

import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import Content from "@/app/(routes)/dashboard/forms/content";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Grids } from "@/components/(reusable)/grids";

export default async function Forms() {
  const session = await auth();
  if (!session) {
    redirect("/signin");
  }

  return (
    <Bases>
      <Contents>
        <Grids rows={"5"} gap={"5"} className="mt-7 mb-3">
          <Holds
            size={"full"}
            background={"white"}
            className="my-auto row-span-1 h-full "
          >
            <TitleBoxes
              title="Forms"
              titleImg="/form.svg"
              titleImgAlt="Forms"
              variant="default"
              size="default"
            />
          </Holds>
          <Holds
            size={"full"}
            background={"white"}
            className="row-span-4 h-full "
          >
            <Content />
          </Holds>
        </Grids>
      </Contents>
    </Bases>
  );
}
