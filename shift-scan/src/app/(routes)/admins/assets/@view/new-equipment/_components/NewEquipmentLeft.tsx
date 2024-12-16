import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Selects } from "@/components/(reusable)/selects";
import { useTranslations } from "next-intl";

type EquipmentLeftProps = {
  equipmentCode: string | null;
  setEquipmentCode: React.Dispatch<React.SetStateAction<string | null>>;
  equipmentStatus: string | null;
  setEquipmentStatus: React.Dispatch<React.SetStateAction<string | null>>;
  equipmentTag: string | null;
  setEquipmentTag: React.Dispatch<React.SetStateAction<string | null>>;
};

export function NewEquipmentLeft({
  equipmentCode,
  setEquipmentCode,
  equipmentStatus,
  setEquipmentStatus,
  equipmentTag,
  setEquipmentTag,
}: EquipmentLeftProps) {
  const t = useTranslations("Admins");
  return (
    <Holds background={"white"} className="w-2/5 h-full">
      <Grids cols={"1"} rows={"6"} className="w-full h-full">
        {/* Equipment Code */}
        <Holds className="w-full row-span-4">
          <Holds className="w-full px-2">
            <Labels size={"p4"}>
              {t("EquipmentCode")}
              {/* <span className="text-red-500">*</span> */}
            </Labels>
            <div className="relative w-full">
              {/* EQ- Prefix */}
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                EQ-
              </span>
              {/* Input Field */}
              <Inputs
                type="text"
                value={equipmentCode || ""}
                onChange={(e) => {
                  setEquipmentCode?.(e.target.value);
                }}
                placeholder={t("Code")}
                variant={"matchSelects"}
                className="pl-10 my-auto" // Adjust padding to make space for the prefix
              />
            </div>
          </Holds>

          {/* Equipment Status */}
          <Holds className="w-full px-2">
            <Labels size={"p4"}>{t("Status")}</Labels>
            <Selects
              name="equipmentStatus"
              value={equipmentStatus || "OPERATIONAL"}
              onChange={(e) => {
                setEquipmentStatus?.(e.target.value);
              }}
            >
              <option value="OPERATIONAL">{t("Operational")}</option>
              <option value="NEEDS_REPAIR">{t("NeedsRepair")}</option>
              <option value="NEEDS_MAINTENANCE">{t("NeedsMaintenance")}</option>
            </Selects>
          </Holds>

          {/* Equipment Tag */}
          <Holds className="w-full px-2">
            <Labels size={"p4"}>{t("EquipmentTag")}</Labels>
            <Selects
              name="equipmentTag"
              value={equipmentTag || "EQUIPMENT"}
              onChange={(e) => {
                setEquipmentTag?.(e.target.value);
              }}
            >
              <option value="EQUIPMENT">{t("Equipment")}</option>
              <option value="VEHICLE">{t("Vehicle")}</option>
              <option value="TRUCK">{t("Truck")}</option>
              <option value="TRAILER">{t("Trailer")}</option>
            </Selects>
          </Holds>
        </Holds>
      </Grids>
    </Holds>
  );
}
