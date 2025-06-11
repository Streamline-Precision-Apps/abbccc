import { EditableFields } from "@/components/(reusable)/EditableField";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";

interface EquipmentDescriptionFieldsProps {
  /** Equipment description value */
  description: string;
  /** Handler for description change */
  onDescriptionChange: (value: string) => void;
  /** Whether the description field has been changed */
  isDescriptionChanged: boolean;
  /** Handler to revert description field */
  onRevertDescription: () => void;
  /** Whether the form is currently saving */
  isSaving: boolean;
}

/**
 * Component for equipment description and safety documents section.
 * Provides a textarea for equipment description and placeholder for safety documents.
 *
 * @param props - The component props
 * @returns JSX element containing description and safety documents fields
 */
export default function EquipmentDescriptionFields({
  description,
  onDescriptionChange,
  isDescriptionChanged,
  onRevertDescription,
  isSaving,
}: EquipmentDescriptionFieldsProps) {
  return (
    <Grids className="w-full h-full grid-rows-[135px_1fr] gap-4">
      <Holds className="w-full h-full">
        <label htmlFor="EquipmentDescription" className="text-base">
          Equipment Description
        </label>
        <EditableFields
          formDatatype="textarea"
          name="EquipmentDescription"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          isChanged={isDescriptionChanged}
          onRevert={onRevertDescription}
          variant={isDescriptionChanged ? "edited" : "default"}
          size="sm"
          rows={4}
          placeholder="Enter equipment description..."
          disable={isSaving}
        />
      </Holds>

      <Holds className="w-full h-full">
        <label htmlFor="SafetyDocuments" className="text-base">
          Safety Documents & Policies
        </label>
        <Holds className="w-full h-full border-[3px] border-black rounded-[10px] p-3">
          <Texts
            size={"xs"}
            text={"italic"}
            className="text-center text-gray-500 "
          >
            Connect your Safety document and policy to your equipment to help
            workers know which documents are required to operate the equipment.
            <br />
            <br />
          </Texts>
          <Texts size={"xs"} className="text-center">
            Coming Soon!
          </Texts>
        </Holds>
      </Holds>
    </Grids>
  );
}
