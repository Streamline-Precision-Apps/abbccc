"use server";

import { auth } from "@/auth";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { redirect } from "next/navigation";
import TascoClientPage from "./tascoClientPage";

export default async function TascoPage() {
  const session = await auth();
  if (!session) {
    redirect("/signin");
  }

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
              titleImg="/Tasco.svg"
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
