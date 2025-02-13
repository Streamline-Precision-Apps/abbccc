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
import { useState } from "react";
import { Priority } from "@/lib/types";
import {
  deleteMaintenanceProject,
  setEditForProjectInfo,
} from "@/actions/mechanicActions";
import debounce from "lodash.debounce";
import { useRouter } from "next/navigation";
import { NModals } from "@/components/(reusable)/newmodals";
import { Texts } from "@/components/(reusable)/texts";
import Spinner from "@/components/(animations)/spinner";
import { Inputs } from "@/components/(reusable)/inputs";

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
  delayReasoning?: string;
  totalHoursLaboured: number;
  equipment: Equipment;
};

type MechanicEditPageProps = {
  repairDetails: RepairDetails | undefined;
  setRepairDetails: React.Dispatch<
    React.SetStateAction<RepairDetails | undefined>
  >;
  totalLogs: number;
};

export default function MechanicEditPage({
  repairDetails,
  setRepairDetails,
  totalLogs,
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
    return (
      <Grids rows={"8"} gap={"5"} className="pb-4">
        <Holds className="row-span-8 h-full justify-center items-center">
          <Spinner />
        </Holds>
      </Grids>
    );
  }

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

  const debouncedUpdate = debounce(async (updatedDetails: RepairDetails) => {
    const formData = new FormData();
    Object.keys(updatedDetails).forEach((key) => {
      const value = updatedDetails[key as keyof RepairDetails] ?? "";
      formData.append(key, value as string);
    });
    await setEditForProjectInfo(formData);
  }, 500);

  return (
    <>
      <Holds className=" h-full overflow-y-auto no-scrollbar px-4  ">
        <Holds>
          <Labels size="p6" htmlFor="equipmentIssue">
            Equipment Issue
          </Labels>
          <TextAreas
            name="equipmentIssue"
            value={repairDetails?.equipmentIssue || ""}
            onChange={(e) => updateField("equipmentIssue", e.target.value)}
            placeholder="Enter a problem description..."
            rows={2}
            className="text-sm"
            style={{ resize: "none" }}
          />
        </Holds>
        <Holds>
          <Labels size="p6" htmlFor="additionalInfo">
            Additional Info
          </Labels>
          <TextAreas
            name="additionalInfo"
            value={repairDetails.additionalInfo}
            onChange={(e) => updateField("additionalInfo", e.target.value)}
            placeholder="Enter additional info..."
            rows={2}
            style={{ resize: "none" }}
            className="text-sm"
          />
        </Holds>
        {/* Location */}
        <Holds>
          <Labels size="p6" htmlFor="location">
            Location
          </Labels>
          <Inputs
            name="location"
            value={repairDetails.location}
            onChange={(e) => updateField("location", e.target.value)}
            placeholder="Enter a location if applicable..."
            className="text-sm pl-4"
          />
        </Holds>
        {/* Priority Status */}
        <Holds className="relative">
          <Labels size="p6" htmlFor="priority">
            Status
          </Labels>

          <div className="relative w-full">
            <Selects
              name="priority"
              value={repairDetails.priority}
              onChange={(e) => {
                const newPriority = e.target.value as Priority;
                updateField("priority", newPriority);
              }}
              className="w-full "
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

            {/* Adjust Image to Overlay Select Box */}
            <Images
              titleImg={
                repairDetails.delay
                  ? "/delayPriority.svg"
                  : repairDetails.priority === "TODAY"
                  ? "/todayPriority.svg"
                  : repairDetails.priority === "HIGH"
                  ? "/highPriority.svg"
                  : repairDetails.priority === "MEDIUM"
                  ? "/mediumPriority.svg"
                  : repairDetails.priority === "LOW"
                  ? "/lowPriority.svg"
                  : "/pending.svg"
              }
              className="absolute left-2 top-1/4 transform -translate-y-1/4 w-6 h-6"
              titleImgAlt="status"
            />
          </div>
        </Holds>

        {repairDetails.delay && (
          <>
            <Holds>
              <Labels size="p6" htmlFor="delayReasoning">
                Delay Reasoning
              </Labels>
              <Inputs
                name="delayReasoning"
                value={repairDetails.delayReasoning}
                onChange={(e) => {
                  updateField("delayReasoning", e.target.value);
                }}
                className="text-sm pl-4"
              />
            </Holds>
            <Holds>
              <Labels size="p6" htmlFor="delay">
                Expect Arrival
              </Labels>
              <Inputs
                type="date"
                name="delay"
                value={repairDetails.delay?.toString().split("T")[0]}
                onChange={(e) => {
                  const newDelay = new Date(e.target.value).toISOString();
                  updateField("delay", newDelay);
                }}
                className="text-center text-sm"
              />
            </Holds>
          </>
        )}
        {totalLogs === 0 && (
          <Holds className="mt-5">
            <Buttons
              background={"red"}
              onClick={() => setOpenDeleteModal(true)}
              className="py-4"
            >
              <Titles size={"h4"}>Delete</Titles>
            </Buttons>
          </Holds>
        )}
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
              <Buttons
                background={"red"}
                onClick={() => setOpenDeleteModal(false)}
              >
                <Titles size={"h4"}>Cancel</Titles>
              </Buttons>
            </Holds>
          </Grids>
        </Holds>
      </NModals>
    </>
  );
}
