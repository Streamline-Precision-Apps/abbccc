import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import TruckingContextsSkeleton from "./components/TruckingContextsSkeleton";

export default function Loading() {
  return (
    <Bases>
      <Contents>
        <Grids rows={"7"} gap={"5"} className="h-full">
          <TruckingContextsSkeleton />
        </Grids>
      </Contents>
    </Bases>
  );
}