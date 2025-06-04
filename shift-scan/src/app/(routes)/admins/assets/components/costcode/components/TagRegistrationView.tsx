import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Texts } from "@/components/(reusable)/texts";

export default function TagsRegistrationView() {
  return (
    <Holds className="w-full h-full">
      <Grids className="w-full h-full grid-rows-[40px_200px_1fr] gap-4">
        <Holds
          position={"row"}
          background="white"
          className="w-full h-full flex justify-between px-4"
        >
          <Buttons shadow="none" background={"none"} className="w-fit h-auto">
            <Texts size="sm" text={"link"}>
              Submit New Group
            </Texts>
          </Buttons>
          <Buttons shadow="none" background={"none"} className="w-fit h-auto">
            <Texts size="sm" text={"link"}>
              Cancel Creation
            </Texts>
          </Buttons>
        </Holds>
        <Holds background="white" className="w-full h-full flex p-4">
          <label htmlFor="name" className="text-sm">
            Group Name
          </label>
          <Inputs id="name" name="name"></Inputs>
          <label htmlFor="description">Group Description</label>
          <TextAreas id="description" name="description"></TextAreas>
        </Holds>
        <Holds background="white" className="w-full h-full p-4 ">
          <Texts position={"left"} size="md">
            Cost Codes
          </Texts>
          <Holds className="w-full h-full flex justify-center items-center border-[3px] border-black rounded-[10px]">
            <Texts size="md">No cost codes available</Texts>
          </Holds>
        </Holds>
      </Grids>
    </Holds>
  );
}
