import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";

interface EquipmentEmptyStateProps {
  /** Handler to open registration form */
  onOpenRegistration: () => void;
  deletionConfirmationMessage: string | null;
  deletionErrorMessage?: string | null;
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
  deletionConfirmationMessage,
  deletionErrorMessage,
}: EquipmentEmptyStateProps) {
  return (
    <Holds className="w-full h-full col-span-8">
      <Grids className="w-full h-full grid-rows-[40px_1fr] gap-4">
        <Holds
          background={"white"}
          className="w-full h-full rounded-[10px] flex flex-col items-center justify-center relative"
        >
          <Holds position={"row"} className="w-full px-4">
            {deletionConfirmationMessage && (
              <Holds
                background={"green"}
                className="w-full h-full absolute top-0 left-0 rounded-[10px]"
              >
                <Texts size={"sm"} className="">
                  {deletionConfirmationMessage}
                </Texts>
              </Holds>
            )}
            {deletionErrorMessage && (
              <Holds
                background={"red"}
                className="w-full h-full absolute top-0 left-0 rounded-[10px]"
              >
                <Texts size={"sm"} className="">
                  {deletionErrorMessage}
                </Texts>
              </Holds>
            )}
            <Buttons
              background={"none"}
              shadow={"none"}
              className="w-fit h-auto"
              onClick={onOpenRegistration}
            >
              <Texts position={"left"} size={"sm"} text={"link"}>
                Register New Equipment
              </Texts>
            </Buttons>
          </Holds>
        </Holds>
      </Grids>
    </Holds>
  );
}
