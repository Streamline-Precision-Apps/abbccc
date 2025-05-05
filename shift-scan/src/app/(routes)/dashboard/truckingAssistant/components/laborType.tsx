import { deleteLaborTypeLogs } from "@/actions/truckingActions";
import SlidingDiv from "@/components/(animations)/slideDelete";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Selects } from "@/components/(reusable)/selects";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction, useState } from "react";
type LaborType = {
  id: string;
  laborType: string;
  startTime: Date;
  endTime: Date | null;
};

export default function LaborType({
  laborType,
  setLaborType,
}: {
  laborType: LaborType[] | undefined;
  setLaborType: Dispatch<SetStateAction<LaborType[] | undefined>>;
}) {
  const [editedLaborType, setEditedLaborType] = useState<LaborType[]>(
    laborType || []
  );
  const t = useTranslations("TruckingAssistant");
  const handleDelete = async (laborTypeId: string) => {
    const updatedLaborType = editedLaborType.filter(
      (laborType) => laborType.id !== laborTypeId
    );
    setEditedLaborType(updatedLaborType);
    setLaborType(updatedLaborType); // Sync with parent state

    const isDeleted = await deleteLaborTypeLogs(laborTypeId);

    if (!isDeleted) {
      console.error(t("FailedToDeletePleaseTryAgain"));
      setEditedLaborType(laborType || []);
      setLaborType(laborType);
    }
  };

  return (
    <>
      {editedLaborType.map((lt, index) => (
        <SlidingDiv key={lt.id} onSwipeLeft={() => handleDelete(lt.id)}>
          <Holds
            position={"row"}
            className="w-full h-fit border-[3px] border-black rounded-[10px]"
          >
            <Holds className=" h-full w-1/3 justify-center items-center py-1 ">
              <Selects className="border-none text-xs focus:outline-none ">
                <option value="">labor Type</option>
                <option value="Truck Driver">Truck Driver</option>
                <option value="Operator">Operator</option>
                <option value="Manual Labor">Manual Labor</option>
              </Selects>
            </Holds>
            <Holds className="h-full border-x-[3px] border-black w-1/3 justify-center items-center py-1">
              <Inputs
                type="time"
                placeholder="Start Time"
                className="border-none text-xs  focus:outline-none   "
              />
            </Holds>
            <Holds className="h-full justify-center items-center w-1/3 py-1">
              <Inputs
                type="time"
                className="border-none text-xs focus:outline-none "
              />
            </Holds>
          </Holds>
        </SlidingDiv>
      ))}
    </>
  );
}
