import { Holds } from "@/components/(reusable)/holds";
import Content from "@/app/(routes)/admin/assets/content";
import AddEmployeeContent from "../../admin/employees/content";
export default function Personnel() {
  return (
    <Holds className=" w-[95%] h-full">
      <AddEmployeeContent />
    </Holds>
  );
}
