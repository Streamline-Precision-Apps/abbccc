import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Selects } from "@/components/(reusable)/selects";
import { Dispatch, SetStateAction } from "react";
import SearchBar from "../../../personnel/components/SearchBar";
import { Texts } from "@/components/(reusable)/texts";

const Asset = [
  { value: "", name: "Select Assets" },
  { value: "Equipment", name: "Equipment" },
  { value: "Jobsite", name: "Jobsite" },
  { value: "CostCode", name: "Cost Codes" },
  { value: "Tags", name: "Tags" },
];

export default function AssetSideBar({
  assets,
  setAssets,
}: {
  assets: string;
  setAssets: Dispatch<SetStateAction<string>>;
}) {
  return (
    <Holds className="w-full h-full col-start-1 col-end-3">
      <Grids className="w-full h-full grid-rows-[40px_40px_1fr] gap-4">
        <Selects
          onChange={(e) => setAssets(e.target.value)}
          value={assets}
          className="w-full h-full text-center text-sm border-none outline outline-[3px] outline-black outline-offset-0"
        >
          {Asset.map((asset) => (
            <option key={asset.value} value={asset.value}>
              {asset.name}
            </option>
          ))}
        </Selects>
        {assets === "" ? (
          <>
            <SearchBar
              disabled={true}
              term={""}
              handleSearchChange={(e) => {}}
              placeholder={"Search Assets..."}
            />

            <Holds
              background={"lightGray"}
              className="w-full h-full rounded-[10px] p-3"
            ></Holds>
          </>
        ) : (
          <>
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
          </>
        )}
      </Grids>
    </Holds>
  );
}
