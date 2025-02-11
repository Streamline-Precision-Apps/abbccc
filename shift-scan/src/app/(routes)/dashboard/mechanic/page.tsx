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
        <MechanicDisplay />
      </Contents>
    </Bases>
  );
}
