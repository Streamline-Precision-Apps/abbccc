import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";

interface EquipmentEmptyStateProps {
  /** Handler to open registration form */
  onOpenRegistration: () => void;
}

/**
 * Component displayed when no equipment is selected.
 * Provides guidance and quick action to register new equipment.
 *
 * @param props - The component props
 * @returns JSX element showing empty state with registration prompt
 */
export default function EquipmentEmptyState({
  onOpenRegistration,
}: EquipmentEmptyStateProps) {
  return (
    <Holds className="w-full h-full col-span-8">
      <Grids className="w-full h-full grid-rows-[40px_1fr] gap-4">
        <Holds
          background={"white"}
          className="w-full h-full rounded-[10px]  flex flex-col items-center justify-center"
        >
          <Holds className="px-4">
            <Texts
              position={"left"}
              size={"sm"}
              text={"link"}
              className="cursor-pointer hover:underline font-semibold"
              onClick={onOpenRegistration}
            >
              Register New Equipment
            </Texts>
          </Holds>
        </Holds>
      </Grids>
    </Holds>
  );
}
