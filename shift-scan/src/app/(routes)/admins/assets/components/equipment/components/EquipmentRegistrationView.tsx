import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import EquipmentRegistrationForm from "../forms/EquipmentRegistrationForm";
import { Buttons } from "@/components/(reusable)/buttons";

interface EquipmentRegistrationViewProps {
  /** Handler for new equipment submission */
  onSubmit: (newEquipment: {
    name: string;
    description?: string;
    equipmentTag: string;
    status?: string;
    isActive: boolean;
    inUse: boolean;
    overWeight: boolean | null;
    currentWeight: number;
    equipmentVehicleInfo?: {
      make: string | null;
      model: string | null;
      year: string | null;
      licensePlate: string | null;
      registrationExpiration: Date | null;
      mileage: number | null;
    };
  }) => Promise<void>;
  /** Handler to cancel registration */
  onCancel: () => void;
  /** Handler for tracking unsaved changes */
  onUnsavedChangesChange?: (hasChanges: boolean) => void;
}

/**
 * Component for new equipment registration view.
 * Displays the registration form with header actions for submit/cancel.
 *
 * @param props - The component props
 * @returns JSX element containing the complete registration interface
 */
export default function EquipmentRegistrationView({
  onSubmit,
  onCancel,
  onUnsavedChangesChange,
}: EquipmentRegistrationViewProps) {
  return (
    <Holds className="w-full h-full col-span-4">
      <Grids className="w-full h-full grid-rows-[40px_1fr] gap-4">
        <Holds
          background={"white"}
          position={"row"}
          className="w-full h-full rounded-[10px] justify-between px-4"
        >
          <Buttons
            background={"none"}
            shadow={"none"}
            type="submit"
            className="w-fit h-auto"
          >
            <Texts
              position={"left"}
              size={"sm"}
              text={"link"}
              className="cursor-pointer hover:underline font-semibold"
            >
              Submit New Equipment
            </Texts>
          </Buttons>

          <Buttons
            background={"none"}
            shadow={"none"}
            className="w-fit h-auto"
            onClick={onCancel}
          >
            <img src="/statusDenied.svg" alt="Close" className="w-4 h-4" />
          </Buttons>
        </Holds>

        <Holds
          background={"white"}
          className="w-full h-full rounded-[10px] p-3 overflow-y-auto"
        >
          <Grids className="w-full h-full grid-rows-[50px_1fr]">
            <Holds className="w-full h-full">
              <Titles position={"left"} size={"xl"} className="font-bold">
                New Equipment
              </Titles>
            </Holds>
            <Holds className="w-full h-full overflow-y-auto ">
              <EquipmentRegistrationForm
                onSubmit={onSubmit}
                onCancel={onCancel}
                onUnsavedChangesChange={onUnsavedChangesChange}
              />
            </Holds>
          </Grids>
        </Holds>
      </Grids>
    </Holds>
  );
}
