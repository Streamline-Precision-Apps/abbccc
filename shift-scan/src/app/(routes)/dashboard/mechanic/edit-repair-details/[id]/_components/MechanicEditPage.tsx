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
import { useEffect, useMemo, useState } from "react";
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
import { useTranslations } from "next-intl";

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
  repaired: boolean;
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
  const t = useTranslations("MechanicWidget");
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const PriorityOptions = [
    { label: t("SelectPriority"), value: "" },
    { label: t("HighPriority"), value: "HIGH" },
    { label: t("MediumPriority"), value: "MEDIUM" },
    { label: t("LowPriority"), value: "LOW" },
    { label: t("Today"), value: "TODAY" },
  ];

  // Helper function to update a field in repairDetails
  // Helper function to update a field in repairDetails.
  const updateField = (field: keyof RepairDetails, value: string) => {
    if (!repairDetails) return;
    const updatedDetails = { ...repairDetails, [field]: value };
    setRepairDetails(updatedDetails);
    debouncedUpdate(updatedDetails);
  };

  const deleteProject = async () => {
    if (!repairDetails) return;
    const response = await deleteMaintenanceProject(
      repairDetails.id.toString()
    );
    if (response) {
      router.push("/dashboard/mechanic");
    }
  };

  const debouncedUpdate = useMemo(() => {
    return debounce(async (updatedDetails: RepairDetails) => {
      const formData = new FormData();
      Object.keys(updatedDetails).forEach((key) => {
        const value = updatedDetails[key as keyof RepairDetails] ?? "";
        formData.append(key, value as string);
      });
      await setEditForProjectInfo(formData);
    }, 2000);
  }, []);

  useEffect(() => {
    return () => {
      debouncedUpdate.cancel();
    };
  }, [debouncedUpdate]);

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

  return (
    <>
      <Holds className=" h-full overflow-y-auto no-scrollbar px-4  ">
        <Grids rows={"8"} className="h-full w-full">
          <Holds className="row-start-1 row-end-8 h-full">
            <Holds>
              <Labels size="p6" htmlFor="equipmentIssue">
                {t("EquipmentIssue")}
              </Labels>
              <TextAreas
                name="equipmentIssue"
                value={repairDetails?.equipmentIssue || ""}
                onChange={(e) => updateField("equipmentIssue", e.target.value)}
                placeholder={t("EnterAProblemDescription")}
                rows={2}
                className="text-sm"
                style={{ resize: "none" }}
                disabled={repairDetails?.repaired}
              />
            </Holds>
            <Holds>
              <Labels size="p6" htmlFor="additionalInfo">
                {t("AdditionalInfo")}
              </Labels>
              <TextAreas
                name="additionalInfo"
                value={repairDetails.additionalInfo}
                onChange={(e) => updateField("additionalInfo", e.target.value)}
                placeholder={t("AdditionalInfoPlaceholder")}
                rows={2}
                style={{ resize: "none" }}
                className="text-sm"
                disabled={repairDetails?.repaired}
              />
            </Holds>
            {/* Location */}
            <Holds>
              <Labels size="p6" htmlFor="location">
                {t("Location")}
              </Labels>
              <Inputs
                name="location"
                value={repairDetails.location}
                onChange={(e) => updateField("location", e.target.value)}
                placeholder={t("LocationPlaceholder")}
                className="text-sm pl-4"
                disabled={repairDetails?.repaired}
              />
            </Holds>
            {/* Priority Status */}
            <Holds className="relative">
              <Labels size="p6" htmlFor="priority">
                {t("Status")}
              </Labels>

              <div className="relative w-full">
                {repairDetails?.repaired ? (
                  <Inputs
                    name="priority"
                    value={repairDetails.priority}
                    className="w-full text-center"
                    disabled
                  />
                ) : (
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
                )}

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
                  titleImgAlt={t("Status")}
                />
              </div>
            </Holds>

            {repairDetails.delay && (
              <>
                <Holds>
                  <Labels size="p6" htmlFor="delayReasoning">
                    {t("DelayReasoning")}
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
                    {t("ExpectedArrival")}
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
          </Holds>
          {totalLogs === 0 && (
            <Holds className="mt-5 justify-end row-start-8 row-end-9">
              <Buttons
                background={"red"}
                onClick={() => setOpenDeleteModal(true)}
                className="py-3 mb-4"
              >
                <Titles size={"h4"}>{t("Delete")}</Titles>
              </Buttons>
            </Holds>
          )}
        </Grids>
      </Holds>

      <NModals
        size={"medWW"}
        isOpen={openDeleteModal}
        handleClose={() => setOpenDeleteModal(false)}
      >
        <Holds className="h-full w-full">
          <Grids rows={"3"} cols={"2"} gap={"5"}>
            <Holds className="row-span-2 col-span-2">
              <Texts size={"p2"}>{t("AreYouSureYouWantToDelete")}</Texts>
            </Holds>
            <Holds className="row-span-1 col-span-1 ">
              <Buttons background={"green"} onClick={deleteProject}>
                <Titles size={"h4"}>{t("Yes")}</Titles>
              </Buttons>
            </Holds>
            <Holds className="row-span-1 col-span-1  ">
              <Buttons
                background={"red"}
                onClick={() => setOpenDeleteModal(false)}
              >
                <Titles size={"h4"}>{t("Cancel")}</Titles>
              </Buttons>
            </Holds>
          </Grids>
        </Holds>
      </NModals>
    </>
  );
}
