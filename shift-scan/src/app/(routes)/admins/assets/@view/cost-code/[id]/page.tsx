"use client";
import { ReusableViewLayout } from "@/app/(routes)/admins/personnel/@view/[employee]/_components/reusableViewLayout";
import { Holds } from "@/components/(reusable)/holds";

import { useEffect, useMemo, useState } from "react";
import { Inputs } from "@/components/(reusable)/inputs";
import { EditableFields } from "@/components/(reusable)/EditableField";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Titles } from "@/components/(reusable)/titles";
import { Images } from "@/components/(reusable)/images";
// import { CheckBox } from "@/components/(inputs)/checkBox";
// import CheckBoxWithImage from "@/components/(inputs)/CheckBoxWithImage";
import { Texts } from "@/components/(reusable)/texts";
import { CCTags } from "@prisma/client";
import { CheckBox } from "@/components/(inputs)/checkBox";

const arraysAreEqual = (arr1: CCTags[], arr2: CCTags[]) => {
  if (arr1.length !== arr2.length) return false;

  // Compare by id to detect changes
  const set1 = new Set(arr1.map((user) => user.id));
  const set2 = new Set(arr2.map((user) => user.id));

  return Array.from(set1).every((id) => set2.has(id));
};

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
  const [selectedTags, setSelectedTags] = useState<CCTags[]>([]);
  const [initalTags, setInitialTags] = useState<CCTags[]>([]);
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    // Check for changes whenever `usersInCrew` updates
    setHasChanged(!arraysAreEqual(selectedTags, initalTags));
  }, [selectedTags, initalTags]);

  //remove later
  console.log(hasChanged);

  useEffect(() => {
    const fetchCostcode = async () => {
      try {
        const res = await fetch(`/api/getCostCodeById/${id}`);
        const data = await res.json();
        setCostCodeId(data.id);
        setCostCodeName(data.name);
        setDescription(data.description);

        setInitialCostCodeName(data.name);
        setInitialDescription(data.description);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCostcode();
  }, [id]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        // Fetch all tags
        const allTagsRes = await fetch(`/api/getAllTags`);
        const allTagsData = await allTagsRes.json();
        setInitialTags(allTagsData);

        // Fetch connected tags for the current costCode
        const connectedTagsRes = await fetch(
          `/api/getCostCodeTags/${costcodeId}`
        );
        const connectedTagsData = await connectedTagsRes.json();

        // Extract the connected CCTags
        const connectedTags = connectedTagsData[0]?.CCTags || [];

        // Mark tags as selected only if they are part of the connected tags
        setSelectedTags(
          allTagsData.filter((tag: CCTags) =>
            connectedTags.some((ct: CCTags) => ct.id === tag.id)
          )
        );
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, [costcodeId]);

  useEffect(() => {
    const hasChanges =
      costcodeName !== initialCostcodeName ||
      description !== initialDescription;
    SetChangesMade(hasChanges);
  }, [costcodeName, description, initialCostcodeName, initialDescription]);

  const toggleTagSelection = (tag: CCTags) => {
    setSelectedTags(
      (prev) =>
        prev.some((t) => t.id === tag.id)
          ? prev.filter((t) => t.id !== tag.id) // Remove if already selected
          : [...prev, tag] // Add if not selected
    );
  };

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
        mainLeft={
          <CostCodeLeft
            initalTags={initalTags}
            selectedTags={selectedTags}
            toggleTagSelection={toggleTagSelection}
          />
        }
        mainRight={<CostCodeRight selectedTags={selectedTags} />}
        footer={<EditCostCodeFooter changesMade={changesMade} />}
      />
    </Holds>
  );
}

function CostCodeLeft({
  initalTags,
  selectedTags,
  toggleTagSelection,
}: {
  initalTags: CCTags[];
  selectedTags: CCTags[];
  toggleTagSelection: (tag: CCTags) => void;
}) {
  const [term, setTerm] = useState<string>("");

  const filteredTags = useMemo(() => {
    return initalTags.filter((tag) =>
      tag.name.toLowerCase().includes(term.toLowerCase())
    );
  }, [term, initalTags]);

  return (
    <Holds background="white" className="w-full h-full p-4">
      <Grids rows="10" gap="5" className="h-full">
        <Holds className="row-span-10 h-full border-[3px] border-black rounded-t-[10px]">
          <Holds position="row" className="py-2 border-b-[3px] border-black">
            <Holds className="h-full w-[20%]">
              <Images titleImg="/magnifyingGlass.svg" titleImgAlt="search" />
            </Holds>
            <Holds className="w-[80%]">
              <Inputs
                type="search"
                placeholder="Search Tags"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="border-none outline-none"
              />
            </Holds>
          </Holds>
          <Holds className="h-full mb-4 overflow-y-auto no-scrollbar">
            {filteredTags.map((tag) => (
              <Holds
                key={tag.id}
                className="py-2 border-b cursor-pointer flex items-center"
              >
                <Holds position={"row"} className="justify-between">
                  <Holds className="flex w-2/3">
                    <Texts size="p6">{tag.name}</Texts>
                  </Holds>
                  <Holds position="row" className="relative flex w-1/3">
                    <CheckBox
                      id={tag.id.toString()}
                      defaultChecked={selectedTags.some((t) => t.id === tag.id)}
                      onChange={() => toggleTagSelection(tag)}
                      size={2}
                      name={tag.name}
                      aria-label={`Toggle tag ${tag.name}`}
                    />
                  </Holds>
                </Holds>
              </Holds>
            ))}
          </Holds>
        </Holds>
      </Grids>
    </Holds>
  );
}

function CostCodeRight({ selectedTags }: { selectedTags: CCTags[] }) {
  return (
    <Holds background="white" className="w-full h-full p-4">
      <Holds className="h-full mb-4 overflow-y-auto no-scrollbar bg-gray-200 rounded-[10px]">
        <Holds className="grid grid-cols-4 gap-4 p-2">
          {selectedTags.map((tag) => (
            <Holds
              key={tag.id}
              className="p-2 bg-white border-[3px] border-black rounded-[10px]  flex items-center justify-center"
            >
              <Texts size="p6" className="text-center">
                {tag.name}
              </Texts>
            </Holds>
          ))}
        </Holds>
      </Holds>
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
