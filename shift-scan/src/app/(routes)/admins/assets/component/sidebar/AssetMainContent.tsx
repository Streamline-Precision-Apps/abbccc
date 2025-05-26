import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";

export default function AssetMainContent() {
  return (
    <>
      <Holds className="w-full h-full col-start-3 col-end-7">
        <Grids className="w-full h-full grid-rows-[50px_1fr] gap-4">
          <Holds
            background={"white"}
            className="w-full h-full rounded-[10px] p-3"
          >
            {/* Content for the Asset SideBar goes here */}
          </Holds>

          <Holds
            background={"white"}
            className="w-full h-full rounded-[10px] p-3"
          ></Holds>
        </Grids>
      </Holds>
      <Holds className="w-full h-full col-start-7 col-end-11">
        <Grids className="w-full h-full grid-rows-[50px_1fr] gap-4">
          <Holds
            background={"white"}
            className="w-full h-full rounded-[10px] p-3"
          >
            {/* Content for the Asset SideBar goes here */}
          </Holds>

          <Holds
            background={"white"}
            className="w-full h-full rounded-[10px] p-3"
          ></Holds>
        </Grids>
      </Holds>
    </>
  );
}
