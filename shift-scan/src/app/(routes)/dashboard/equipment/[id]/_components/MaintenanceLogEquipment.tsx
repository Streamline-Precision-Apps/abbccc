// app/components/MaintenanceLogEquipment.tsx
"use client";

import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { Labels } from "@/components/(reusable)/labels";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Texts } from "@/components/(reusable)/texts";
import { Grids } from "@/components/(reusable)/grids";
import { EquipmentStatus } from "@/lib/types";
import { z } from "zod";
import { Selects } from "@/components/(reusable)/selects";
import { Buttons } from "@/components/(reusable)/buttons";
import { deleteMaintenanceInEquipment } from "@/actions/equipmentActions";
import { Titles } from "@/components/(reusable)/titles";
import { useState } from "react";
import { NModals } from "@/components/(reusable)/newmodals";
import { set } from "date-fns";

const maintenanceSchema = z.object({
  id: z.string().optional(),
  equipmentIssue: z.string().nullable(),
  additionalInfo: z.string().nullable(), // assuming this might be null
});

const EquipmentLogSchema = z.object({
  id: z.string(),
  equipmentId: z.string(),
  employeeId: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  comment: z.string().optional(),
  isFinished: z.boolean(),
  equipment: z.object({
    name: z.string(),
    status: z.string().optional(),
  }),
  maintenanceId: maintenanceSchema.nullable(),
  fullyOperational: z.boolean(),
});

type EquipmentLog = z.infer<typeof EquipmentLogSchema>;

interface MaintenanceLogEquipmentProps {
  formState: EquipmentLog;
  handleFieldChange: (
    field: string,
    value: string | number | boolean | EquipmentStatus | null
  ) => void;
  t: (key: string) => string;
  hasChanged: boolean | undefined;
}

export default function MaintenanceLogEquipment({
  t,
  handleFieldChange,
  formState,
  hasChanged,
}: MaintenanceLogEquipmentProps) {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <Holds className="w-full h-full py-5">
      <Contents width={"section"}>
        <Grids rows={"8"} gap={"5"} className="h-full w-full">
          {formState.fullyOperational ? (
            <Holds className="row-start-1 row-end-8 h-full">
              <Holds className="flex justify-center items-center h-full w-full">
                <Titles size="h3">Equipment Marked as Fully Operational</Titles>
              </Holds>
            </Holds>
          ) : (
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
                  value={formState.maintenanceId?.equipmentIssue || ""}
                  onChange={(e) =>
                    handleFieldChange(
                      "maintenanceId.equipmentIssue",
                      e.target.value
                    )
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
                  value={formState.maintenanceId?.additionalInfo || ""}
                  onChange={(e) =>
                    handleFieldChange(
                      "maintenanceId.additionalInfo",
                      e.target.value
                    )
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
                      setIsOpened(true);
                    }
                  }}
                >
                  Delete Maintenance Request
                </Buttons>
              )}
              <NModals
                isOpen={isOpened}
                handleClose={() => setIsOpened(false)}
                size={"medWW"}
              >
                <Holds background={"white"} className="w-full h-full">
                  <Grids rows={"4"} gap={"5"} className="h-full w-full">
                    <Holds className="row-start-1 row-end-4">
                      <Texts>
                        Are you sure you want to delete this maintenance
                        request?
                      </Texts>
                    </Holds>
                    <Holds
                      position={"row"}
                      className="row-start-4 row-end-5 gap-5"
                    >
                      <Buttons onClick={() => setIsOpened(false)}>
                        Cancel
                      </Buttons>
                      <Buttons
                        background={"red"}
                        onClick={() => {
                          if (formState.maintenanceId?.id) {
                            deleteMaintenanceInEquipment(formState.id);
                            handleFieldChange("maintenanceId", null);
                            setIsOpened(false);
                          }
                        }}
                      >
                        Delete
                      </Buttons>
                    </Holds>
                  </Grids>
                </Holds>
              </NModals>
            </Holds>
          )}
        </Grids>
      </Contents>
    </Holds>
  );
}
