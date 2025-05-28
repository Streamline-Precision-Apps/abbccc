import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import EquipmentRegistrationForm from "../forms/EquipmentRegistrationForm";

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
}: EquipmentRegistrationViewProps) {
  return (
    <Holds className="w-full h-full col-span-4">
      <Grids className="w-full h-full grid-rows-[40px_1fr] gap-4">
        <Holds
          background={"white"}
          position={"row"}
          className="w-full h-full rounded-[10px] justify-between px-4"
        >
          <Holds className="w-full h-full flex justify-center">
            <Texts
              position={"left"}
              size={"sm"}
              text={"link"}
              className="cursor-pointer hover:underline font-semibold"
            >
              Submit New Equipment
            </Texts>
          </Holds>
          <Holds className="h-full flex justify-center">
            <Texts
              position={"right"}
              size={"sm"}
              text={"link"}
              className="cursor-pointer hover:underline"
              onClick={onCancel}
            >
              Cancel Registration
            </Texts>
          </Holds>
        </Holds>

        <Holds
          background={"white"}
          className="w-full h-full rounded-[10px] p-3"
        >
          <Grids className="w-full h-full grid-rows-[50px_1fr]">
            <Holds>
              <Titles position={"left"} size={"xl"} className="font-bold">
                New Equipment
              </Titles>
            </Holds>
            <Holds className="w-full h-full">
              <EquipmentRegistrationForm
                onSubmit={onSubmit}
                onCancel={onCancel}
              />
            </Holds>
          </Grids>
        </Holds>
      </Grids>
    </Holds>
  );
}
