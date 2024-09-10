import "@/app/globals.css";
import { AddEquipmentContent } from "./addEquipmentContent";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
export default function InjuryReport() {
  return (
    <Bases>
    <Contents variant="default" size="default">
      <AddEquipmentContent />
    </Contents>
    </Bases>
  );

}
