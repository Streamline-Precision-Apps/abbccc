import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
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
