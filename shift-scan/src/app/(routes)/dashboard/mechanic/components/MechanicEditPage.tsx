"use client";

import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Labels } from "@/components/(reusable)/labels";
import { Selects } from "@/components/(reusable)/selects";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Titles } from "@/components/(reusable)/titles";
import { useCallback, useState } from "react";
import { Priority } from "@/lib/types";
import {
  deleteMaintenanceProject,
  setEditForProjectInfo,
} from "@/actions/mechanicActions";
import debounce from "lodash.debounce";
import { useRouter } from "next/navigation";
import { NModals } from "@/components/(reusable)/newmodals";
import { Texts } from "@/components/(reusable)/texts";

type Equipment = {
  id: string;
  name: string;
};

type RepairDetails = {
  id: string;
  equipmentId: string;
  equipmentIssue: string;
  additionalInfo: string;
  location: string;
  priority: string;
  createdBy: string;
  createdAt: Date;
  hasBeenDelayed: boolean;
  delay: Date | null;
  totalHoursLaboured: number;
  equipment: Equipment;
};

type MechanicEditPageProps = {
  repairDetails: RepairDetails | undefined;
  setRepairDetails: React.Dispatch<
    React.SetStateAction<RepairDetails | undefined>
  >;
};

export default function MechanicEditPage({
  repairDetails,
  setRepairDetails,
}: MechanicEditPageProps) {
  // Use local state if needed for additional UI aspects (e.g. image selection)
  const router = useRouter();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const PriorityOptions = [
    { label: "Select Priority", value: "" },
    { label: "High Priority", value: "HIGH" },
    { label: "Medium Priority", value: "MEDIUM" },
    { label: "Low Priority", value: "LOW" },
    { label: "TODAY", value: "TODAY" },
  ];

  // Ensure repairDetails is loaded before rendering the form
  if (!repairDetails) {
    return <div>Loading...</div>;
  }

  const debouncedUpdate = useCallback(
    debounce(async (updatedDetails: RepairDetails) => {
      const formData = new FormData();
      // Iterate over every key in updatedDetails.
      Object.keys(updatedDetails).forEach((key) => {
        // Append the key with its value or blank if value is null/undefined.
        const value = updatedDetails[key as keyof RepairDetails] ?? "";
        formData.append(key, value as string);
      });
      await setEditForProjectInfo(formData);
    }, 500),
    []
  );

  // Helper function to update a field in repairDetails
  const updateField = (field: keyof RepairDetails, value: string) => {
    const updatedDetails = { ...repairDetails, [field]: value };
    setRepairDetails(updatedDetails);
    debouncedUpdate(updatedDetails);
  };

  const deleteProject = async () => {
    const response = await deleteMaintenanceProject(
      repairDetails?.id.toString()
    );
    if (response) {
      router.push("/dashboard/mechanic");
    }
  };

  return (
    <Grids rows={"8"} gap={"5"} className="pb-4">
      <Holds className="row-start-1 row-end-6 h-full">
        <Contents width={"section"} className="h-full">
          <Holds className="h-full">
            <Labels size="p4" htmlFor="equipmentIssue">
              Equipment Issue
            </Labels>
            <TextAreas
              name="equipmentIssue"
              value={repairDetails.equipmentIssue}
              onChange={(e) => updateField("equipmentIssue", e.target.value)}
              placeholder="Enter a problem description..."
              rows={2}
              style={{ resize: "none" }}
            />
          </Holds>
          <Holds className="h-full ">
            <Labels size="p4" htmlFor="additionalInfo">
              Additional Info
            </Labels>
            <TextAreas
              name="additionalInfo"
              value={repairDetails.additionalInfo}
              onChange={(e) => updateField("additionalInfo", e.target.value)}
              placeholder="Enter additional info..."
              style={{ resize: "none" }}
              className="h-full"
            />
          </Holds>
          <Holds className="h-full">
            <Labels size="p4" htmlFor="location">
              Location
            </Labels>
            <TextAreas
              name="location"
              value={repairDetails.location}
              onChange={(e) => updateField("location", e.target.value)}
              placeholder="Enter a location if applicable..."
              rows={2}
              style={{ resize: "none" }}
            />
          </Holds>
          <Holds className="h-full relative">
            <Labels size="p4" htmlFor="priority">
              Status
            </Labels>
            <Selects
              name="priority"
              value={repairDetails.priority}
              onChange={(e) => {
                const newPriority = e.target.value as Priority;

                updateField("priority", newPriority);
              }}
            >
              {PriorityOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="text-center"
                >
                  {option.label}
                </option>
              ))}
            </Selects>
            <Holds className="w-full absolute top-10 right-[40%]">
              <Images
                titleImg={
                  repairDetails.priority === "TODAY"
                    ? "/todayPriority.svg"
                    : repairDetails.priority === "HIGH"
                    ? "/highPriority.svg"
                    : repairDetails.priority === "MEDIUM"
                    ? "/mediumPriority.svg"
                    : repairDetails.priority === "LOW"
                    ? "/lowPriority.svg"
                    : "/pending.svg"
                }
                className="w-7 h-7"
                titleImgAlt="status"
              />
            </Holds>
          </Holds>
        </Contents>
      </Holds>
      <NModals
        size={"medWW"}
        isOpen={openDeleteModal}
        handleClose={() => setOpenDeleteModal(false)}
      >
        <Holds className="h-full w-full">
          <Grids rows={"3"} cols={"2"} gap={"5"}>
            <Holds className="row-span-2 col-span-2">
              <Texts size={"p2"}>
                Are you sure you want to delete this project?
              </Texts>
            </Holds>
            <Holds className="row-span-1 col-span-1 ">
              <Buttons background={"green"} onClick={deleteProject}>
                <Titles size={"h4"}>Yes</Titles>
              </Buttons>
            </Holds>
            <Holds className="row-span-1 col-span-1  ">
              <Buttons background={"red"} onClick={deleteProject}>
                <Titles size={"h4"}>Delete</Titles>
              </Buttons>
            </Holds>
          </Grids>
        </Holds>
      </NModals>

      <Holds className="row-start-8 row-end-9 h-full">
        <Contents width={"section"}>
          <Buttons background={"red"} onClick={() => setOpenDeleteModal(true)}>
            <Titles size={"h4"}>Delete</Titles>
          </Buttons>
        </Contents>
      </Holds>
    </Grids>
  );
}
