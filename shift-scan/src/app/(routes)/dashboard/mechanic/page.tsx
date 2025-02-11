import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import MechanicDisplay from "./components/MechanicDisplay";

export default async function Mechanic() {
  return (
    <Bases>
      <Contents>
        <Grids rows={"7"} gap={"5"}>
          <Holds
            background={"white"}
            className="row-span-1 h-full justify-center"
          >
            <TitleBoxes
              title="Projects"
              titleImg="/mechanic.svg"
              titleImgAlt="Mechanic"
              type="row"
            />
          </Holds>
          <Holds background={"white"} className="row-span-6 h-full">
            <Contents width={"section"}>
              <MechanicDisplay />
            </Contents>
          </Holds>
        </Grids>
      </Contents>
    </Bases>
  );
}
