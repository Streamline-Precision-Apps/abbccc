import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Titles } from "@/components/(reusable)/titles";
import { Images } from "@/components/(reusable)/images";
import TascoClientPageSkeleton from "./components/TascoClientPageSkeleton";

export default function Loading() {
  return (
    <Bases>
      <Contents>
        <Grids rows={"7"} gap={"5"}>
          <Holds background={"white"} className="row-span-1 h-full">
            <TitleBoxes>
              <Titles>Tasco</Titles>
              <Images
                className="w-8 h-8"
                titleImg={"/tasco.svg"}
                titleImgAlt={"Tasco"}
              />
            </TitleBoxes>
          </Holds>
          <Holds background={"none"} className="row-span-6 h-full">
            <TascoClientPageSkeleton />
          </Holds>
        </Grids>
      </Contents>
    </Bases>
  );
}
