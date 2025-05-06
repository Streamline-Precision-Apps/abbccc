"use server";

import { auth } from "@/auth";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { redirect } from "next/navigation";
import TascoClientPage from "./components/tascoClientPage";
import { cookies } from "next/headers";

export default async function TascoPage() {
  const session = await auth();
  if (!session) {
    redirect("/signin");
  }

  const laborType = cookies().get("laborType")?.value || "";

  if (laborType === "equipmentOperator") {
    return (
      <Bases>
        <Contents>
          <Grids rows={"6"} gap={"5"} className="h-full">
            <Holds background={"white"} className="row-span-1 h-full">
              <TitleBoxes
                title="Tasco"
                titleImg="/tasco.svg"
                titleImgAlt="Tasco"
              />
            </Holds>
            <Holds background={"none"} className="row-span-5 h-full">
              <TascoClientPage />
            </Holds>
          </Grids>
        </Contents>
      </Bases>
    );
  } else {
    return (
      <Bases>
        <Contents>
          <Grids rows={"6"} gap={"5"}>
            <Holds
              background={"white"}
              className="row-span-1 h-full justify-center"
            >
              <TitleBoxes
                title="Tasco"
                titleImg="/tasco.svg"
                titleImgAlt="Tasco"
              />
            </Holds>
            <Holds background={"white"} className="row-span-5 h-full">
              <Contents width={"section"}>
                <TascoClientPage />
              </Contents>
            </Holds>
          </Grids>
        </Contents>
      </Bases>
    );
  }
}
