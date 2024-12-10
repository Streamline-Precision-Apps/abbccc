import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Titles } from "@/components/(reusable)/titles";

export function EditCostCodeFooter({
  handleEditForm,
  deleteCostCode,
}: {
  handleEditForm: () => void;
  deleteCostCode: () => void;
}) {
  return (
    <Holds
      background={"white"}
      className="w-full h-full row-span-1 col-span-2 "
    >
      <Grids cols={"4"} gap={"4"} className="w-full h-full p-4">
        <Holds className="my-auto col-start-1 col-end-2 ">
          <Buttons
            background={"red"}
            className="py-2"
            onClick={() => {
              deleteCostCode();
            }}
          >
            <Titles size={"h4"}>Delete Cost Code</Titles>
          </Buttons>
        </Holds>

        <Holds className="my-auto col-start-4 col-end-5 ">
          <Buttons
            className={"py-2 bg-app-green"}
            onClick={() => handleEditForm()}
          >
            <Titles size={"h4"}>Submit Edit</Titles>
          </Buttons>
        </Holds>
      </Grids>
    </Holds>
  );
}
