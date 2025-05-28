import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Titles } from "@/components/(reusable)/titles";
import Spinner from "@/components/(animations)/spinner";
import { Equipment } from "../../../types";
import EquipmentBasicFields from "./EquipmentBasicFields";
import VehicleInformationFields from "./VehicleInformationFields";
import EquipmentDescriptionFields from "./EquipmentDescriptionFields";

interface EquipmentFormViewProps {
  /** Current equipment being edited */
  equipment: Equipment;
  /** Form data state */
  formData: Equipment;
  /** Set of changed field names */
  changedFields: Set<string>;
  /** Handler for input changes */
  onInputChange: (
    fieldName: string,
    value: string | number | boolean | Date
  ) => void;
  /** Handler to revert field changes */
  onRevertField: (fieldName: string) => void;
  /** Whether the form is currently saving */
  isSaving: boolean;
}

/**
 * Component that displays the complete equipment form view.
 * Contains all form sections including basic fields, vehicle info, and description.
 *
 * @param props - The component props
 * @returns JSX element containing the complete equipment form
 */
export default function EquipmentFormView({
  equipment,
  formData,
  changedFields,
  onInputChange,
  onRevertField,
  isSaving,
}: EquipmentFormViewProps) {
  return (
    <Holds
      background={"white"}
      className="w-full h-full rounded-[10px] p-3 px-5 relative"
    >
      {/* Loading overlay - only show when saving */}
      {isSaving && (
        <Holds className="w-full h-full justify-center items-center absolute left-0 top-0 z-50 bg-white bg-opacity-80 rounded-[10px]">
          <Spinner size={80} />
        </Holds>
      )}

      <Grids className="w-full h-full grid-rows-[50px_1fr]">
        <Holds position={"row"} className="w-full h-full">
          <Titles position={"left"} size={"xl"} className="font-bold">
            {formData?.name || equipment.name}
          </Titles>
          {/* TODO: add QR code here */}
        </Holds>

        <Holds className="w-full h-full">
          <Grids className="w-full h-full grid-cols-[1fr_1fr] gap-4">
            <Holds className="w-full h-full col-span-1 overflow-y-scroll no-scrollbar">
              <Holds>
                <EquipmentBasicFields
                  formData={formData}
                  changedFields={changedFields}
                  onInputChange={onInputChange}
                  onRevertField={onRevertField}
                  isSaving={isSaving}
                />

                <VehicleInformationFields
                  formData={formData}
                  changedFields={changedFields}
                  onInputChange={onInputChange}
                  onRevertField={onRevertField}
                  isSaving={isSaving}
                />
              </Holds>
            </Holds>

            <Holds className="w-full h-full">
              <EquipmentDescriptionFields
                description={formData?.description || ""}
                onDescriptionChange={(value) =>
                  onInputChange("description", value)
                }
                isDescriptionChanged={changedFields.has("description")}
                onRevertDescription={() => onRevertField("description")}
                isSaving={isSaving}
              />
            </Holds>
          </Grids>
        </Holds>
      </Grids>
    </Holds>
  );
}
