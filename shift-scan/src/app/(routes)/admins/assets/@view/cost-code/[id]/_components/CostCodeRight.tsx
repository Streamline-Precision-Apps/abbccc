import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { CCTags } from "@/lib/types";

export function CostCodeRight({ selectedTags }: { selectedTags: CCTags[] }) {
  return (
    <Holds background="white" className="w-full h-full p-2">
      <Holds className="h-full  overflow-y-auto no-scrollbar bg-gray-200 rounded-[10px]">
        <Holds className="grid grid-cols-2 gap-1 ">
          {selectedTags.map((tag) => (
            <Holds
              key={tag.id}
              className="p-2 bg-white border-[3px] border-black rounded-[10px]  flex items-center justify-center"
            >
              <Texts size="p6" className="text-center">
                {tag.name}
              </Texts>
            </Holds>
          ))}
        </Holds>
      </Holds>
    </Holds>
  );
}
