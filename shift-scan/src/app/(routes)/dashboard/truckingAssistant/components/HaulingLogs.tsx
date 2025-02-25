import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import Sliders from "@/components/(reusable)/sliders";
import { useState } from "react";
import AddMaterial from "./AddMaterial";

export default function HaulingLogs() {
  const [activeTab, setActiveTab] = useState<number>(1);
  return (
    <>
      <Holds
        background={"white"}
        className="w-full h-full rounded-t-none row-start-2 row-end-3 "
      >
        <Contents width={"section"} className="h-full">
          <Holds position={"row"} className="h-full gap-2">
            <Holds size={"80"}>
              <Sliders
                leftTitle={"Material"}
                rightTitle={"Equipment"}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </Holds>
            <Holds size={"20"} className="my-auto">
              <Buttons background={"green"} className="py-1.5">
                +
              </Buttons>
            </Holds>
          </Holds>
        </Contents>
      </Holds>
      <Holds className="w-full h-full row-start-3 row-end-11 pt-5">
        <Holds background={"white"} className="w-full h-full">
          <Grids
            rows={"9"}
            className="h-full py-4 overflow-y-auto no-scrollbar"
          >
            {activeTab === 1 && (
              <>
                <Holds className="h-full w-full row-start-1 row-end-10">
                  <Contents width={"section"} className="h-full">
                    <AddMaterial />
                  </Contents>
                </Holds>
              </>
            )}
            {activeTab === 2 && (
              <>
                <Holds className="h-full w-full row-start-3 row-end-9"></Holds>
              </>
            )}
          </Grids>
        </Holds>
      </Holds>
    </>
  );
}
