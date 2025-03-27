// app/components/MaintenanceLogEquipment.tsx
"use client";

import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { Labels } from "@/components/(reusable)/labels";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Texts } from "@/components/(reusable)/texts";
import { Dispatch, SetStateAction } from "react";
import { Grids } from "@/components/(reusable)/grids";
import { EquipmentStatus } from "@/lib/types";
import { z } from "zod";
import { Selects } from "@/components/(reusable)/selects";
import { form } from "@nextui-org/theme";
import { Buttons } from "@/components/(reusable)/buttons";
import { deleteMaintenanceInEquipment } from "@/actions/equipmentActions";

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
  maintenanceId: z.object({
    id: z.string().nullable(),
    equipmentIssue: z.string(),
    additionalInfo: z.string(),
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
  t,
  handleFieldChange,
  formState,
}: MaintenanceLogEquipmentProps) {
  return (
    <Holds className="w-full h-full py-5">
      <Contents width={"section"}>
        <Grids rows={"8"} gap={"5"} className="h-full w-full">
          <Holds className="row-start-1 row-end-8 h-full">
            <Holds className="relative">
              <Labels size="p6">Equipment Status *</Labels>
              <Selects
                value={formState.equipment.status}
                onChange={(e) =>
                  handleFieldChange(
                    "Equipment.status",
                    e.target.value as EquipmentStatus
                  )
                }
              >
                <option value={"OPERATIONAL"}>Operational</option>
                <option value={"NEEDS_REPAIR"}>Needs Repair</option>
                <option value={"NEEDS_MAINTENANCE"}>Needs Maintenance</option>
              </Selects>
            </Holds>
            <Holds className="relative">
              <Labels size="p6">Equipment Issue *</Labels>
              <TextAreas
                maxLength={40}
                placeholder="Describe the equipment issue..."
                value={formState.maintenanceId?.equipmentIssue}
                onChange={(e) =>
                  handleFieldChange("equipmentIssue", e.target.value)
                }
                required
              />
              <Texts
                size="p3"
                className="text-gray-500 absolute bottom-4 right-2"
              >
                {formState.maintenanceId?.equipmentIssue?.length}/40
              </Texts>
            </Holds>

            <Holds className="relative">
              <Labels size="p6">Additional Information</Labels>
              <TextAreas
                maxLength={40}
                placeholder="Provide any additional information..."
                value={formState.maintenanceId?.additionalInfo}
                onChange={(e) =>
                  handleFieldChange("additionalInfo", e.target.value)
                }
              />
              <Texts
                size="p3"
                className="text-gray-500 absolute bottom-4 right-2"
              >
                {formState.maintenanceId?.additionalInfo?.length}/40
              </Texts>
            </Holds>
            {formState.isFinished && formState.maintenanceId?.id && (
              <Buttons
                onClick={() => {
                  if (formState.maintenanceId?.id) {
                    deleteMaintenanceInEquipment(formState.id);
                  }
                }}
              >
                Delete Maintenance Request
              </Buttons>
            )}
          </Holds>
        </Grids>
      </Contents>
    </Holds>
  );
}
