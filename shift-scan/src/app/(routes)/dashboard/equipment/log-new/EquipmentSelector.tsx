"use client";
import { CreateEmployeeEquipmentLog } from "@/actions/equipmentActions";
import { EquipmentSelector } from "@/components/(clock)/(General)/equipmentSelector";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Titles } from "@/components/(reusable)/titles";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect } from "react";

type Option = {
  id: string;
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
  const { data: session } = useSession();
  if (!session) {
    router.push("/signin"); // Redirect to sign-in if not authenticated
  }

  const id = session?.user?.id || ""; // Get the user ID from the session

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("equipmentId", equipment?.id || "");
    formData.append("jobsiteId", jobSite?.id || "");

    const result = await CreateEmployeeEquipmentLog(formData);
    if (result) {
      router.push("/dashboard/equipment");
    }
  };

  return (
    <Holds className="h-full pb-5">
      <Grids rows={"7"} gap={"5"}>
        <Holds className="row-start-1 row-end-2 h-full w-full">
          <TitleBoxes
            onClick={() => {
              setStep(1);
              setMethod("");
            }}
          >
            <Holds className="flex items-center justify-end w-full h-full">
              <Titles size={"h2"}>Select Equipment</Titles>
            </Holds>
          </TitleBoxes>
        </Holds>

        <Holds className="h-full row-start-2 row-end-8">
          <Contents width={"section"} className="h-full">
            <Grids rows={"7"} gap={"5"}>
              <Holds className="h-full w-full row-start-1 row-end-7 pt-5 ">
                <EquipmentSelector
                  onEquipmentSelect={(equipment) => {
                    if (equipment) {
                      setEquipment(equipment); // Update the equipment state with the full Option object
                    } else {
                      setEquipment({ id: "", code: "", label: "" }); // Reset if null
                    }
                  }}
                  initialValue={equipment}
                />
              </Holds>
              <Holds className="w-full row-start-7 row-end-8">
                <Buttons
                  onClick={(e) => onSubmit(e)}
                  background="orange"
                  className="py-3"
                >
                  <Titles size={"h4"}>Submit Selection</Titles>
                </Buttons>
              </Holds>
            </Grids>
          </Contents>
        </Holds>
      </Grids>
    </Holds>
  );
}
