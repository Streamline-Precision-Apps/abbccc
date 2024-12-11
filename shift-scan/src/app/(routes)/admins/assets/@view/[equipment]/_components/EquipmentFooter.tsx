"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Titles } from "@/components/(reusable)/titles";

export function EquipmentFooter({
  handleSubmitClick,
  handleDeleteClick,
}: {
  handleSubmitClick: () => void;
  handleDeleteClick: () => void;
}) {
  return (
    <Holds className="h-full w-full px-4 py-2 col-span-2">
    <Grids rows={"3"} cols={"10"} gap={"4"} className="w-full h-full">
      <Buttons
        background={"red"}
        onClick={() => {
          handleDeleteClick();
        }}
        className="row-start-1 row-end-4 col-start-1 col-end-5 hover:cursor-pointer"
      >
        <Titles size={"h4"}>Delete Equipment</Titles>
      </Buttons>

      <Buttons
        background={"green"}
        onClick={() => {
          handleSubmitClick();
        }}
        className="row-start-1 row-end-4 col-start-7 col-end-11 "
      >
        <Titles size={"h4"}>Submit Equipment</Titles>
      </Buttons>
    </Grids>
  </Holds>
  );
}
