// app/components/MaintenanceLogEquipment.tsx
"use client";

import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { Labels } from "@/components/(reusable)/labels";
import { Selects } from "@/components/(reusable)/selects";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Texts } from "@/components/(reusable)/texts";
import { Buttons } from "@/components/(reusable)/buttons";
import { useState } from "react";
import { useNotification } from "@/app/context/NotificationContext";
import { EquipmentStatus, Priority } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Grids } from "@/components/(reusable)/grids";
import { z } from "zod";
import { createMaintenanceRequest } from "@/actions/equipmentActions";

const EquipmentLogSchema = z.object({
  id: z.string(),
  equipmentId: z.string(),
  employeeId: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  comment: z.string().optional(),
  isFinished: z.boolean(),
  refueled: z.array(
    z
      .object({
        gallonsRefueled: z.number().optional(),
        milesAtfueling: z.number().optional(),
      })
      .optional()
  ),
  equipment: z.object({
    name: z.string(),
    status: z.string().optional(),
  }),
});

type EquipmentLog = z.infer<typeof EquipmentLogSchema>;

interface MaintenanceLogEquipmentProps {
  formState: EquipmentLog;
  handleFieldChange: (
    field: string,
    value: string | number | boolean | EquipmentStatus
  ) => void;
  t: (key: string) => string;
}

export default function MaintenanceLogEquipment({
  formState,
  handleFieldChange,
  t,
}: MaintenanceLogEquipmentProps) {
  const { setNotification } = useNotification();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [maintenanceRequest, setMaintenanceRequest] = useState({
    equipmentIssue: "",
    additionalInfo: "",
    priority: "MEDIUM" as Priority,
  });

  const handleMaintenanceFieldChange = (
    field: keyof typeof maintenanceRequest,
    value: string | Priority
  ) => {
    setMaintenanceRequest((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitMaintenanceRequest = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("equipmentId", formState.equipmentId);
      formData.append("equipmentIssue", maintenanceRequest.equipmentIssue);
      formData.append("additionalInfo", maintenanceRequest.additionalInfo);
      formData.append("priority", maintenanceRequest.priority);
      formData.append("createdBy", "currentUserId"); // Replace with actual user ID

      await createMaintenanceRequest(formData);

      setNotification("Maintenance request created successfully", "success");
      setMaintenanceRequest({
        equipmentIssue: "",
        additionalInfo: "",
        priority: "MEDIUM",
      });
      router.refresh();
    } catch (error) {
      console.error("Error creating maintenance request:", error);
      setNotification("Failed to create maintenance request", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Holds className="w-full h-full py-5">
      <Contents width={"section"}>
        <Grids rows={"8"} gap={"5"} className="h-full w-full">
          <Holds className="row-start-1 row-end-8 h-full">
            <Texts size="p5">Create Maintenance Request</Texts>

            <Holds className="relative">
              <Labels size="p6">Equipment Issue *</Labels>
              <TextAreas
                maxLength={40}
                placeholder="Describe the equipment issue..."
                value={maintenanceRequest.equipmentIssue}
                onChange={(e) =>
                  handleMaintenanceFieldChange("equipmentIssue", e.target.value)
                }
                required
              />
              <Texts
                size="p3"
                className="text-gray-500 absolute bottom-4 right-2"
              >
                {maintenanceRequest.equipmentIssue.length}/40
              </Texts>
            </Holds>

            <Holds className="relative">
              <Labels size="p6">Additional Information</Labels>
              <TextAreas
                maxLength={40}
                placeholder="Provide any additional information..."
                value={maintenanceRequest.additionalInfo}
                onChange={(e) =>
                  handleMaintenanceFieldChange("additionalInfo", e.target.value)
                }
              />
              <Texts
                size="p3"
                className="text-gray-500 absolute bottom-4 right-2"
              >
                {maintenanceRequest.additionalInfo.length}/40
              </Texts>
            </Holds>
          </Holds>
          <Holds className="row-start-8 row-end-9 h-full">
            <Buttons
              onClick={handleSubmitMaintenanceRequest}
              background="lightBlue"
              className="w-full"
              disabled={
                !maintenanceRequest.equipmentIssue ||
                maintenanceRequest.equipmentIssue.length < 10 ||
                isSubmitting
              }
            >
              {isSubmitting ? "Submitting..." : "Submit Maintenance Request"}
            </Buttons>
          </Holds>
        </Grids>
      </Contents>
    </Holds>
  );
}
