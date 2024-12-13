"use client";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { JobTags, costCodesTag } from "@/lib/types";

export function NewTagMainRight({
  selectedJobs,
  selectedCostCodes,
}: {
  selectedJobs: JobTags[];
  selectedCostCodes: costCodesTag[];
}) {
  return (
    <Holds background={"white"} className="w-full h-full">
      <Grids rows={"2"} gap={"2"} className="w-full h-full p-2">
        <Holds className="row-start-1 row-end-2 h-full bg-slate-200 rounded-[10px] overflow-y-auto no-scrollbar">
          {/* Flex container with flex-wrap */}
          <Holds className="flex flex-row flex-wrap gap-2 w-full p-2 ">
            {selectedJobs.map((item, index) => (
              <Holds
                key={index}
                className="w-fit h-fit p-1 bg-white border-[3px] border-black rounded-[10px] "
              >
                <Texts size={"p6"}>{item.name}</Texts>
              </Holds>
            ))}
          </Holds>
        </Holds>
        <Holds className="row-start-2 row-end-3 h-full bg-slate-200 rounded-[10px] overflow-y-auto no-scrollbar">
          {/* Flex container with flex-wrap */}
          <Holds className="flex flex-row flex-wrap gap-2 w-full p-2  ">
            {selectedCostCodes.map((item, index) => (
              <Holds
                key={index}
                className="w-fit h-fit p-1 bg-white border-[3px] border-black rounded-[10px] "
              >
                <Texts size={"p6"}>{item.description}</Texts>
              </Holds>
            ))}
          </Holds>
        </Holds>
      </Grids>
    </Holds>
  );
}
