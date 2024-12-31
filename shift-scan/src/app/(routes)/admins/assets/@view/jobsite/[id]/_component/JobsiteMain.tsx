"use client";
import { EditableFields } from "@/components/(reusable)/EditableField";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Labels } from "@/components/(reusable)/labels";
import { TextAreas } from "@/components/(reusable)/textareas";
import { useTranslations } from "next-intl";

export function EditJobsitesMain({
  formState,
  handleFieldChange,
  hasChanged,
  originalState,
}: {
  formState: {
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    description: string;
    comment: string;
  };
  handleFieldChange: (field: string, value: string) => void;
  hasChanged: (
    field:
      | "name"
      | "address"
      | "city"
      | "state"
      | "country"
      | "zipCode"
      | "description"
      | "comment"
  ) => boolean;
  originalState: {
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    description: string;
    comment: string;
  };
}) {
  const t = useTranslations("Admins");
  return (
    <Holds background={"white"} className="w-full h-full ">
      <Grids cols={"3"} rows={"3"} gap={"5"} className="w-full h-full p-4  ">
        {/* Input */}
        <Holds className="h-full w-full ">
          <Labels size={"p6"}>
            {t("StreetName")} <span className="text-red-500">*</span>
          </Labels>
          <EditableFields
            value={formState.address}
            isChanged={hasChanged("address")}
            onChange={(e) => handleFieldChange("address", e.target.value)}
            onRevert={() =>
              handleFieldChange("streetName", originalState.address)
            }
            variant="default"
            size="default"
          />
        </Holds>

        <Holds className="h-full w-full">
          <Labels size={"p6"}>
            {t("City")} <span className="text-red-500">*</span>
          </Labels>
          <EditableFields
            value={formState.city}
            isChanged={hasChanged("city")}
            onChange={(e) => handleFieldChange("city", e.target.value)}
            onRevert={() => handleFieldChange("city", originalState.city)}
            variant="default"
            size="default"
          />
        </Holds>
        <Holds className="h-full w-full">
          <Labels size={"p6"}>
            {t("State")} <span className="text-red-500">*</span>
          </Labels>
          <EditableFields
            value={formState.state}
            isChanged={hasChanged("state")}
            onChange={(e) => handleFieldChange("state", e.target.value)}
            onRevert={() => handleFieldChange("state", originalState.state)}
            variant="default"
            size="default"
          />
        </Holds>
        <Holds className="h-full w-full">
          <Labels size={"p6"}>
            {t("ZipCode")} <span className="text-red-500">*</span>
          </Labels>
          <EditableFields
            value={formState.zipCode}
            isChanged={hasChanged("zipCode")}
            onChange={(e) => handleFieldChange("zipCode", e.target.value)}
            onRevert={() =>
              handleFieldChange("streetNumber", originalState.zipCode)
            }
            variant="default"
            size="default"
          />
        </Holds>
        <Holds className="h-full w-full">
          <Labels size={"p6"}>
            {t("Country")} <span className="text-red-500">*</span>
          </Labels>
          <EditableFields
            value={formState.country}
            isChanged={hasChanged("country")}
            onChange={(e) => handleFieldChange("country", e.target.value)}
            onRevert={() => handleFieldChange("country", originalState.country)}
            variant="default"
            size="default"
          />
        </Holds>
        <Holds className="h-full w-full col-start-1 col-end-4 row-start-3 row-end-4 ">
          <Labels size={"p6"}>
            {t("Description")} <span className="text-red-500">*</span>
          </Labels>
          <TextAreas
            value={formState.description}
            onChange={(e) => handleFieldChange("description", e.target.value)}
          />
        </Holds>
      </Grids>
    </Holds>
  );
}
