import { EditableFields } from "@/components/(reusable)/EditableField";
import { Holds } from "@/components/(reusable)/holds";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("Admins");
  return (
    <Holds background={"white"} className="w-full h-full row-span-1 col-span-2">
      <form className="flex flex-row size-full gap-4 py-2 px-10">
        <Holds className="w-1/2 py-4">
          <EditableFields
            value={costcodeName}
            onChange={(e) => setCostCodeName(e.target.value)}
            isChanged={costcodeName !== initialCostcodeName}
            onRevert={() => setCostCodeName(initialCostcodeName)}
            placeholder={t("CostCode")}
            className="p-2"
            variant="default"
            size="lg"
            minLength={1}
            maxLength={10}
            pattern={"^[0-9#\\.]+$"}
          />
        </Holds>
        <Holds className="w-1/2">
          <EditableFields
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            isChanged={description !== initialDescription}
            onRevert={() => setDescription(initialDescription)}
            placeholder={t("CostCodeDescription")}
            className="p-2"
            variant="default"
            size="lg"
            minLength={1}
            maxLength={50}
            pattern={"^[a-zA-Z0-9]+$"}
          />
        </Holds>
      </form>
    </Holds>
  );
}
