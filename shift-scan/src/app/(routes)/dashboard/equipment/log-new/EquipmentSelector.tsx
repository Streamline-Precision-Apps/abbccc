import { CreateEmployeeEquipmentLog } from "@/actions/equipmentActions";
import { EquipmentSelector } from "@/components/(clock)/(General)/equipmentSelector";
import CodeStep from "@/components/(clock)/code-step";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Titles } from "@/components/(reusable)/titles";
import CodeFinder from "@/components/(search)/newCodeFinder";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect } from "react";

type Option = {
  label: string;
  code: string;
};
export default function EquipmentSelectorView({
  setStep,
  setMethod,
  setEquipment,
  equipment,
  jobSite,
}: {
  setStep: Dispatch<SetStateAction<number>>;
  setMethod: Dispatch<SetStateAction<"" | "Scan" | "Select">>;
  setEquipment: Dispatch<SetStateAction<Option>>;
  equipment: Option;
  jobSite: Option;
}) {
  const router = useRouter();
  const id = useSession().data?.user.id;
  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("equipmentId", equipment?.code || "");
    formData.append("jobsiteId", jobSite?.code || "");
    formData.append("startTime", new Date().toString());
    formData.append("employeeId", id || "");

    const result = await CreateEmployeeEquipmentLog(formData);
    if (result) {
      router.push("/dashboard/equipment");
    }
  };

  return (
    <Holds className="h-full pb-5">
      <Grids rows={"7"} gap={"5"}>
        <Holds className="row-start-1 row-end-2">
          <TitleBoxes
            onClick={() => {
              setStep(1);
              setMethod("");
            }}
          ></TitleBoxes>
        </Holds>
        <Holds className="row-start-2 row-end-3 h-full">
          <Titles size={"h1"}>Select Equipment</Titles>
        </Holds>
        <Holds className="h-full row-start-3 row-end-8">
          <Contents width={"section"} className="h-full">
            <Grids rows={"7"} gap={"5"}>
              <Holds className="h-full w-full row-start-1 row-end-7 ">
                <EquipmentSelector
                  onEquipmentSelect={(equipment) => {
                    if (equipment) {
                      setEquipment(equipment); // Update the equipment state with the full Option object
                    } else {
                      setEquipment({ code: "", label: "" }); // Reset if null
                    }
                  }}
                  initialValue={equipment}
                />
              </Holds>
              <Holds className="h-full w-full row-start-7 row-end-8">
                <Buttons
                  onClick={(e) => {
                    e.preventDefault();
                    onSubmit(e);
                  }}
                  background="orange"
                  className="py-2"
                >
                  <Titles size={"h2"}>Submit Selection</Titles>
                </Buttons>
              </Holds>
            </Grids>
          </Contents>
        </Holds>
      </Grids>
    </Holds>
  );
}
