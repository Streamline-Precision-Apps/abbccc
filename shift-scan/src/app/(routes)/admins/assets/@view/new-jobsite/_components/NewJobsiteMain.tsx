"use client";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { TextAreas } from "@/components/(reusable)/textareas";
import { useTranslations } from "next-intl";

export default function NewJobsitesMain({
  formState,
  handleFieldChange,
}: {
  formState: {
    name: string;
    streetName: string;
    streetNumber: string;
    city: string;
    state: string;
    country: string;
    description: string;
    comment: string;
  };
  handleFieldChange: (field: string, value: string) => void;
}) {
  const t = useTranslations("Admins");
  return (
    <Holds background={"white"} className="w-full h-full ">
      <Grids cols={"3"} rows={"3"} gap={"5"} className="w-full h-full p-4  ">
        {/* Input */}
        <Holds className="h-full w-full ">
          <Labels size={"p6"}>
            {t("StreetNumber")} <span className="text-red-500">*</span>
          </Labels>
          <Inputs
            type="text"
            value={formState.streetNumber}
            onChange={(e) => handleFieldChange("streetNumber", e.target.value)}
          />
        </Holds>
        <Holds className="h-full w-full">
          <Labels size={"p6"}>
            {t("StreetName")} <span className="text-red-500">*</span>
          </Labels>
          <Inputs
            type="text"
            value={formState.streetName}
            onChange={(e) => handleFieldChange("streetName", e.target.value)}
          />
        </Holds>
        <Holds className="h-full w-full">
          <Labels size={"p6"}>
            {t("City")} <span className="text-red-500">*</span>
          </Labels>
          <Inputs
            type="text"
            value={formState.city}
            onChange={(e) => handleFieldChange("city", e.target.value)}
          />
        </Holds>
        <Holds className="h-full w-full">
          <Labels size={"p6"}>
            {t("State")} <span className="text-red-500">*</span>
          </Labels>
          <Inputs
            type="text"
            value={formState.state}
            onChange={(e) => handleFieldChange("state", e.target.value)}
          />
        </Holds>
        <Holds className="h-full w-full">
          <Labels size={"p6"}>
            {t("Country")} <span className="text-red-500">*</span>
          </Labels>
          <Inputs
            type="text"
            value={formState.country}
            onChange={(e) => handleFieldChange("country", e.target.value)}
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
