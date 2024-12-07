"use client";
import { ReusableViewLayout } from "@/app/(routes)/admins/personnel/@view/[employee]/_components/reusableViewLayout";
import { Holds } from "@/components/(reusable)/holds";

import { useEffect, useState } from "react";
import { Inputs } from "@/components/(reusable)/inputs";
import { EditableFields } from "@/components/(reusable)/EditableField";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Titles } from "@/components/(reusable)/titles";

export default function UpdateCostCodes({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const [initialCostcodeName, setInitialCostCodeName] = useState<string>("");
  const [initialDescription, setInitialDescription] = useState<string>("");

  const [costcodeId, setCostCodeId] = useState<number>(0);
  const [costcodeName, setCostCodeName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [changesMade, SetChangesMade] = useState(false);

  useEffect(() => {
    const fetchCostcode = async () => {
      const res = await fetch(`/api/getCostCodeById/${id}`);
      const data = await res.json();
      setCostCodeId(data.id);
      setCostCodeName(data.name);
      setDescription(data.description);

      setInitialCostCodeName(data.name);
      setInitialDescription(data.description);
    };
    fetchCostcode();
  }, [id]);

  useEffect(() => {
    const hasChanges =
      costcodeName !== initialCostcodeName ||
      description !== initialDescription;
    SetChangesMade(hasChanges);
  }, [costcodeName, description, initialCostcodeName, initialDescription]);

  return (
    <Holds className="w-full h-full ">
      <Inputs hidden={true} value={costcodeId} />
      <ReusableViewLayout
        custom={true}
        header={
          <EditCostCodeForm
            initialCostcodeName={initialCostcodeName}
            initialDescription={initialDescription}
            costcodeName={costcodeName}
            description={description}
            setCostCodeName={setCostCodeName}
            setDescription={setDescription}
          />
        }
        mainHolds="h-full w-full flex flex-row row-span-6 col-span-2 bg-app-dark-blue px-4 py-2 rounded-[10px] gap-4"
        mainLeft={<CostCodeLeft />}
        mainRight={<CostCodeRight />}
        footer={<EditCostCodeFooter changesMade={changesMade} />}
      />
    </Holds>
  );
}

function CostCodeLeft() {
  return (
    <Holds background={"white"} className="w-full h-full p-4">
      left
    </Holds>
  );
}
function CostCodeRight() {
  return (
    <Holds background={"white"} className="w-full h-full p-4">
      right
    </Holds>
  );
}

function EditCostCodeForm({
  costcodeName,
  description,
  setCostCodeName,
  setDescription,
  initialCostcodeName,
  initialDescription,
}: {
  costcodeName: string;
  description: string;
  initialCostcodeName: string;
  initialDescription: string;
  setCostCodeName: (value: string) => void;
  setDescription: (value: string) => void;
}) {
  return (
    <Holds background={"white"} className="w-full h-full row-span-1 col-span-2">
      <form className="flex flex-row size-full gap-4 py-2 px-10">
        <Holds className="w-1/2 py-4">
          <EditableFields
            value={costcodeName}
            onChange={(e) => setCostCodeName(e.target.value)}
            isChanged={costcodeName !== initialCostcodeName}
            onRevert={() => setCostCodeName(initialCostcodeName)}
            className="p-2"
            variant="default"
            size="lg"
          />
        </Holds>
        <Holds className="w-1/2">
          <EditableFields
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            isChanged={description !== initialDescription}
            onRevert={() => setDescription(initialDescription)}
            className="p-2"
            variant="default"
            size="lg"
          />
        </Holds>
      </form>
    </Holds>
  );
}

function EditCostCodeFooter({ changesMade }: { changesMade: boolean }) {
  return (
    <Holds
      background={"white"}
      className="w-full h-full row-span-1 col-span-2 "
    >
      <Grids cols={"4"} gap={"4"} className="w-full h-full p-4">
        <Holds className="my-auto col-start-1 col-end-2 ">
          <Buttons background={"red"} className="py-2 ">
            <Titles size={"h4"}>Delete Cost Code</Titles>
          </Buttons>
        </Holds>

        <Holds className="my-auto col-start-4 col-end-5 ">
          <Buttons
            className={
              "py-2 " + (changesMade ? "bg-app-green" : "bg-slate-400")
            }
            disabled={!changesMade}
          >
            <Titles size={"h4"}>Submit Edit</Titles>
          </Buttons>
        </Holds>
      </Grids>
    </Holds>
  );
}
