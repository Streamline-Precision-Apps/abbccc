import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";

export default function AssetSideBar() {
  return (
    <Holds className="w-full h-full col-start-1 col-end-3">
      <Grids className="w-full h-full grid-rows-[50px_50px_1fr] gap-4">
        <Holds
          background={"white"}
          className="w-full h-full rounded-[10px] p-3"
        >
          {/* Content for the Asset SideBar goes here */}
        </Holds>
        <Holds
          background={"white"}
          className="w-full h-full rounded-[10px] p-3"
        >
          {/* Content for the Asset SideBar goes here */}
        </Holds>
        <Holds
          background={"white"}
          className="w-full h-full rounded-[10px] p-3"
        >
          {/* Content for the Asset SideBar goes here */}
        </Holds>
      </Grids>
    </Holds>
  );
}
