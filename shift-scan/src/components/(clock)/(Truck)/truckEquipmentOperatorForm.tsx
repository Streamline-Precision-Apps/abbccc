import { setEquipment } from "@/actions/cookieActions";
import { Holds } from "@/components/(reusable)/holds";

import { Dispatch, SetStateAction } from "react";
import { EquipmentSelector } from "../(General)/equipmentSelector";
import { Grids } from "@/components/(reusable)/grids";
import StepButtons from "../step-buttons";

type Option = {
  code: string;
  label: string;
};
type TruckEquipmentOperatorFormProps = {
  equipment: { code: string; label: string };
  setEquipment: Dispatch<SetStateAction<Option>>;
  selectedOpt: boolean;
  setSelectedOpt: Dispatch<SetStateAction<boolean>>;
  handleNextStep: () => void;
};
export default function TruckEquipmentOperatorForm({
  equipment,
  setEquipment,
  selectedOpt,
  setSelectedOpt,
  handleNextStep,
}: TruckEquipmentOperatorFormProps) {
  return (
    <Grids rows={"7"} gap={"5"} className="h-full w-full">
      <Holds className="row-start-1 row-end-6 h-full w-full">
        <EquipmentSelector
          onEquipmentSelect={(equipment) => {
            if (equipment) {
              setEquipment(equipment); // Update the equipment state with the full Option object
            } else {
              setEquipment({ code: "", label: "" }); // Reset if null
            }
            setSelectedOpt(!!equipment);
          }}
          initialValue={equipment}
        />
      </Holds>
      <Holds className="row-start-6 row-end-7 h-full w-full justify-center">
        <StepButtons handleNextStep={handleNextStep} disabled={!selectedOpt} />
      </Holds>
    </Grids>
  );
}
