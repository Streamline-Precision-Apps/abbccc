import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Selects } from "@/components/(reusable)/selects";

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
  return (
    <Holds background={"white"} className="w-2/5 h-full">
      <Grids cols={"1"} rows={"6"} className="w-full h-full">
        {/* Equipment Code */}
        <Holds className="w-full row-span-4">
          <Holds className="w-full px-2">
            <Labels size={"p4"}>
              Equipment Code
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
                placeholder={"Code"}
                variant={"matchSelects"}
                className="pl-10 my-auto" // Adjust padding to make space for the prefix
              />
            </div>
          </Holds>

          {/* Equipment Status */}
          <Holds className="w-full px-2">
            <Labels size={"p4"}>Status</Labels>
            <Selects
              name="equipmentStatus"
              value={equipmentStatus || "OPERATIONAL"}
              onChange={(e) => {
                setEquipmentStatus?.(e.target.value);
              }}
            >
              <option value="OPERATIONAL">Operational</option>
              <option value="NEEDS_REPAIR">Needs Repair</option>
              <option value="NEEDS_MAINTENANCE">Needs Maintenance</option>
            </Selects>
          </Holds>

          {/* Equipment Tag */}
          <Holds className="w-full px-2">
            <Labels size={"p4"}>Equipment Tag</Labels>
            <Selects
              name="equipmentTag"
              value={equipmentTag || "EQUIPMENT"}
              onChange={(e) => {
                setEquipmentTag?.(e.target.value);
              }}
            >
              <option value="EQUIPMENT">Equipment</option>
              <option value="VEHICLE">Vehicle</option>
              <option value="TRUCK">Truck</option>
              <option value="TRAILER">Trailer</option>
            </Selects>
          </Holds>
        </Holds>
      </Grids>
    </Holds>
  );
}
