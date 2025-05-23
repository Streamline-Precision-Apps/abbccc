"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Titles } from "@/components/(reusable)/titles";

export const CardControls = ({
  handleEditClick,
  handleApproveClick,
  completed,
}: {
  handleEditClick: () => void;
  handleApproveClick: () => void;
  completed: boolean;
}) => {
  return (
    <Holds
      background="white"
      className="row-span-1 h-full flex items-center justify-center "
    >
      <Contents className="h-full">
        <Grids cols={"2"} gap={"5"} className="w-full h-full pt-5">
          {!completed && (
            <>
              <Buttons
                background={"orange"}
                onClick={handleEditClick}
                className=" w-full"
              >
                <Titles size={"h4"}>Edit</Titles>
              </Buttons>
              <Buttons
                background={"green"}
                onClick={handleApproveClick}
                className=" w-full"
              >
                <Titles size={"h4"}>Approved</Titles>
              </Buttons>
            </>
          )}
        </Grids>
      </Contents>
    </Holds>
  );
};
