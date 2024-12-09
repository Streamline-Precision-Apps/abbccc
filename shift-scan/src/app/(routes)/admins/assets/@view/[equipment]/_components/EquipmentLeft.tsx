import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Selects } from "@/components/(reusable)/selects";
import { Buttons } from "@/components/(reusable)/buttons";
import { Images } from "@/components/(reusable)/images";

type EquipmentLeftProps = {
  equipmentCode: string | null;
  setEquipmentCode: React.Dispatch<React.SetStateAction<string | null>>;
  equipmentStatus: string | null;
  setEquipmentStatus: React.Dispatch<React.SetStateAction<string | null>>;
  equipmentTag: string | null;
  setEquipmentTag: React.Dispatch<React.SetStateAction<string | null>>;
  isFieldChanged: (
    field:
      | "equipmentName"
      | "equipmentTag"
      | "make"
      | "model"
      | "year"
      | "licensePlate"
      | "registrationExpiration"
      | "mileage"
      | "equipmentStatus"
      | "equipmentDescription"
      | "equipmentCode"
  ) => boolean;
  revertField: (
    field:
      | "equipmentName"
      | "equipmentTag"
      | "make"
      | "model"
      | "year"
      | "licensePlate"
      | "registrationExpiration"
      | "mileage"
      | "equipmentStatus"
      | "equipmentDescription"
      | "equipmentCode"
  ) => void;
};

export function EquipmentLeft({
  equipmentCode,
  setEquipmentCode,
  equipmentStatus,
  setEquipmentStatus,
  equipmentTag,
  setEquipmentTag,
  isFieldChanged,
  revertField,
}: EquipmentLeftProps) {
  return (
    <Holds background={"white"} className="w-2/5 h-full">
      <Grids cols={"1"} rows={"6"} className="w-full h-full">
        {/* Equipment Code */}
        <Holds className="w-full px-2">
          <Labels size={"p4"}>Equipment Code</Labels>
          <Holds
            position={"row"}
            className="gap-2 h-10 border-[3px] rounded-[10px] border-black"
          >
            <div className="relative w-full">
              {/* Prefix */}
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                EQ-
              </span>
              <Inputs
                className="h-full w-5/6 border-2 border-none focus:outline-none my-auto pl-10"
                type="text"
                name="equipmentCode"
                value={equipmentCode?.replace(/^EQ-/, "") || ""}
                onChange={(e) =>
                  setEquipmentCode(`EQ-${e.target.value.replace(/^EQ-/, "")}`)
                }
                placeholder="Code"
              />
            </div>
            {isFieldChanged("equipmentCode") && (
              <Buttons
                background={"none"}
                type="button"
                className="w-1/6"
                title="Revert changes"
                onClick={() => revertField("equipmentCode")}
              >
                <Holds>
                  <Images
                    titleImg={"/turnBack.svg"}
                    titleImgAlt={"revert"}
                    size={"70"}
                  />
                </Holds>
              </Buttons>
            )}
          </Holds>
        </Holds>

        {/* Equipment Status */}
        <Holds className="w-full px-2">
          <Labels size={"p4"}>Status</Labels>
          <Holds
            position={"row"}
            className="gap-2 h-10 border-[3px] rounded-[10px] border-black"
          >
            <Selects
              className="h-full w-5/6 border-2 border-none focus:outline-none my-auto"
              name="equipmentStatus"
              value={equipmentStatus || "OPERATIONAL"}
              onChange={(e) => setEquipmentStatus(e.target.value)}
            >
              <option value="OPERATIONAL">Operational</option>
              <option value="NEEDS_REPAIR">Needs Repair</option>
              <option value="NEEDS_MAINTENANCE">Needs Maintenance</option>
            </Selects>
            {isFieldChanged("equipmentStatus") && (
              <Buttons
                background={"none"}
                type="button"
                className="w-1/6"
                title="Revert changes"
                onClick={() => revertField("equipmentStatus")}
              >
                <Holds>
                  <Images
                    titleImg={"/turnBack.svg"}
                    titleImgAlt={"revert"}
                    size={"70"}
                  />
                </Holds>
              </Buttons>
            )}
          </Holds>
        </Holds>

        {/* Equipment Tag */}
        <Holds className="w-full px-2">
          <Labels size={"p4"}>Equipment Tag</Labels>
          <Holds
            position={"row"}
            className="gap-2 h-10 border-[3px] rounded-[10px] border-black"
          >
            <Selects
              className="h-full w-5/6 border-2 border-none focus:outline-none my-auto"
              name="equipmentTag"
              value={equipmentTag || "EQUIPMENT"}
              onChange={(e) => setEquipmentTag(e.target.value)}
            >
              <option value="EQUIPMENT">Equipment</option>
              <option value="VEHICLE">Vehicle</option>
              <option value="TRUCK">Truck</option>
              <option value="TRAILER">Trailer</option>
            </Selects>
            {isFieldChanged("equipmentTag") && (
              <Buttons
                background={"none"}
                type="button"
                className="w-1/6"
                title="Revert changes"
                onClick={() => revertField("equipmentTag")}
              >
                <Holds>
                  <Images
                    titleImg={"/turnBack.svg"}
                    titleImgAlt={"revert"}
                    size={"70"}
                  />
                </Holds>
              </Buttons>
            )}
          </Holds>
        </Holds>
      </Grids>
    </Holds>
  );
}
