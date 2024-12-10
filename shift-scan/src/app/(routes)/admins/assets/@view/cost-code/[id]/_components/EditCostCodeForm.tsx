import { EditableFields } from "@/components/(reusable)/EditableField";
import { Holds } from "@/components/(reusable)/holds";

export function EditCostCodeForm({
  costcodeName,
  description,
  setCostCodeName,
  setDescription,
  initialCostcodeName,
  initialDescription,
}: {
  costcodeName: string;
  description: string;
  initialCostcodeName: string;
  initialDescription: string;
  setCostCodeName: (value: string) => void;
  setDescription: (value: string) => void;
}) {
  return (
    <Holds background={"white"} className="w-full h-full row-span-1 col-span-2">
      <form className="flex flex-row size-full gap-4 py-2 px-10">
        <Holds className="w-1/2 py-4">
          <EditableFields
            value={costcodeName}
            onChange={(e) => setCostCodeName(e.target.value)}
            isChanged={costcodeName !== initialCostcodeName}
            onRevert={() => setCostCodeName(initialCostcodeName)}
            className="p-2"
            variant="default"
            size="lg"
          />
        </Holds>
        <Holds className="w-1/2">
          <EditableFields
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            isChanged={description !== initialDescription}
            onRevert={() => setDescription(initialDescription)}
            className="p-2"
            variant="default"
            size="lg"
          />
        </Holds>
      </form>
    </Holds>
  );
}
