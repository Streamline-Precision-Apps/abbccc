"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Titles } from "@/components/(reusable)/titles";

export function NewCostCodeFooter({
  handleSubmitClick,
  canSubmit,
}: {
  handleSubmitClick: () => void;
  canSubmit: boolean;
}) {
  return (
    <Holds background={"white"} className="w-full h-full row-span-2 col-span-2">
      <Grids cols={"10"} rows={"1"} className="w-full h-full px-5">
        <Holds className="col-start-9 col-end-11 h-2/3">
          <Buttons
            background={"green"}
            onClick={() => {
              handleSubmitClick();
              console.log("Submitted");
            }}
            disabled={!canSubmit}
            className={!canSubmit ? "bg-gray-400" : ""}
          >
            <Titles size={"h4"}>Submit Cost Code</Titles>
          </Buttons>
        </Holds>
      </Grids>
    </Holds>
  );
}