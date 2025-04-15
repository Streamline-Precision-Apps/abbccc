import { setEquipment } from "@/actions/cookieActions";
import { Holds } from "@/components/(reusable)/holds";

import { Dispatch, SetStateAction } from "react";
import { EquipmentSelector } from "../(General)/equipmentSelector";

type Option = {
  code: string;
  label: string;
};
type TruckEquipmentOperatorFormProps = {
  handleNextStep?: () => void;
  equipment: { code: string; label: string };
  setEquipment: Dispatch<SetStateAction<Option>>;
  selectedOpt: boolean;
  setSelectedOpt: Dispatch<SetStateAction<boolean>>;
};
export default function TruckEquipmentOperatorForm({
  handleNextStep,
  equipment,
  setEquipment,
  selectedOpt,
  setSelectedOpt,
}: TruckEquipmentOperatorFormProps) {
  return (
    <Holds className="row-start-2 row-end-8 h-full w-full">
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
  );
}
