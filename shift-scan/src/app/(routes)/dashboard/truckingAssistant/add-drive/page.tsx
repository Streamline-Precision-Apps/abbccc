"use server";
import { auth } from "@/auth";
import Content from "./content";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Holds } from "@/components/(reusable)/holds";
import { Grids } from "@/components/(reusable)/grids";

export default async function Form() {
  const session = await auth();
  if (!session) return null;

  return (
    <Bases size={"scroll"}>
      <Contents className="my-5">
        <Grids className="grid-rows-10 gap-5">
          <Holds background={"green"} className="row-span-2 h-full">
            <TitleBoxes
              title="Add Drive"
              titleImg="/Trucking.svg"
              titleImgAlt="trucking"
            />
          </Holds>
          <Holds className="row-span-8 h-full">
            <Content />
          </Holds>
        </Grids>
      </Contents>
    </Bases>
  );
}
