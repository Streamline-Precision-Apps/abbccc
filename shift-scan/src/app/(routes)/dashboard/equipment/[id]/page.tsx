"use client";

import {
  DeleteLogs,
  updateEmployeeEquipmentLog,
} from "@/actions/equipmentActions";
import { useNotification } from "@/app/context/NotificationContext";
import { CheckBox } from "@/components/(inputs)/checkBox";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Spinner } from "@nextui-org/react";
import { Buttons } from "@/components/(reusable)/buttons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { z } from "zod";
import SelectWtihRevert from "@/components/(reusable)/selectWithRevert";
import TextInputWithRevert from "@/components/(reusable)/textInputWithRevert";
import NumberInputWithRevert from "@/components/(reusable)/numberInputWithRevert";
import { EquipmentStatus, FormStatus } from "@prisma/client";
import { Titles } from "@/components/(reusable)/titles";

const EquipmentLogSchema = z.object({
  id: z.string(),
  equipmentId: z.string(),
  employeeId: z.string(),
  startTime: z.string(),
  endTime: z.string().optional(),
  comment: z.string().optional(),
  isSubmitted: z.boolean(),
  fuel: z.number().optional(),
  Equipment: z.object({
    name: z.string(),
    status: z.string().optional(),
  }),
});

type EquipmentLog = z.infer<typeof EquipmentLogSchema>;

export default function CombinedForm({ params }: { params: { id: string } }) {
  const router = useRouter();
  const id = params.id;
  const { setNotification } = useNotification();
  const t = useTranslations("Equipment");
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [formState, setFormState] = useState({
    id: "",
    equipmentId: "",
    employeeId: "",
    startTime: "",
    endTime: new Date().toISOString().slice(11, 16),
    comment: "",
    isSubmitted: false,
    fuel: 0,
    Equipment: {
      name: "",
      status: EquipmentStatus.OPERATIONAL,
    },
  } as EquipmentLog);
  const [originalState, setOriginalState] = useState(formState);

  useEffect(() => {
    const fetchEqLog = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/getEqUserLogs/${id}`);
        const data = await response.json();
        const fuel = data.fuel === undefined ? 0 : data.fuel;

        const processedData = {
          id: data.id || "",
          equipmentId: data.equipmentId || "",
          employeeId: data.employeeId || "",
          startTime: new Date(data.startTime).toISOString().slice(11, 16),
          endTime: data.endTime ? new Date(data.endTime).toISOString().slice(11, 16) : new Date().toISOString().slice(11, 16),
          comment: data.comment || "",
          isSubmitted: data.isSubmitted || false,
          fuel: fuel,
          Equipment: {
            name: data.Equipment?.name || "",
            status: data.Equipment?.status || EquipmentStatus.OPERATIONAL,
          },
        } as EquipmentLog;

        console.log("Processed Data: ", processedData);

        const result = EquipmentLogSchema.safeParse(processedData);
        if (!result.success) {
          console.error("Schema validation failed:", result.error);
          return;
        }

        setFormState(processedData);
        setOriginalState(processedData);
      } catch (error) {
        console.error("Error fetching equipment log:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEqLog();
  }, [id]);

  const handleFieldChange = (
    field: string,
    value: string | number | boolean | FormStatus | EquipmentStatus
  ) => {
    if (field === "Equipment.status") {
      setFormState((prev) => ({
        ...prev,
        Equipment: {
          ...prev.Equipment,
          status: value as EquipmentStatus,
        },
      }));
    } else {
      setFormState((prev) => ({
        ...prev,
        [field]: value,
      }));
      console.log("Field changed:", field);
      console.log("Value:", value);
    }
  };

  const calculateTotalUsage = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const duration = Math.abs(end.getTime() - start.getTime());
    const hours = Math.floor(duration / 3600000);
    const minutes = Math.floor((duration % 3600000) / 60000);
    return `${hours} hours, ${minutes} minutes`;
  };

  const saveTimeChanges = () => {
    setOriginalState((prev) => ({
      ...prev,
      startTime: formState.startTime,
      endTime: formState.endTime,
    }));
    setIsEditingTime(false);
  };

  const revertTimeChanges = () => {
    setFormState((prev) => ({
      ...prev,
      startTime: originalState.startTime,
      endTime: originalState.endTime,
    }));
    setIsEditingTime(false);
  };

  const handleChangeRefueled = () => {
    setFormState((prev) => ({
      ...prev,
      fuel: (prev.fuel ?? 0) > 0 ? 0 : 1,
    }));
  };

  const saveEdits = async () => {
    try {
      const formData = new FormData();
      Object.entries(formState).forEach(([key, value]) => {
        if (key === "Equipment") {
        } else {
          formData.append(key, String(value));
        }
      });
      formData.set(
        "Equipment.status",
        formState.Equipment.status || EquipmentStatus.OPERATIONAL
      );
      console.log("Form Data: ", formData);
      await updateEmployeeEquipmentLog(formData);
      setNotification(t("Saved"), "success");
      router.replace("/dashboard/equipment");
    } catch (error) {
      console.error("Error saving equipment log:", error);
      setNotification(t("FailedToSave"), "error");
    }
  };

  const hasComment = () =>
    formState.comment && formState.comment.trim().length > 0;

  if (isLoading) {
    return (
      <Bases>
        <Contents>
          <Grids rows={"10"} gap={"5"}>
            <Holds
              background={"white"}
              className="row-span-2 h-full my-auto animate-pulse "
            >
              <TitleBoxes
                version="horizontal"
                title="Loading..."
                type="noIcon"
                titleImg=""
                titleImgAlt=""
                variant="default"
                size="default"
                className="my-auto"
              />
            </Holds>
            <Holds
              background={"white"}
              className=" row-span-2 h-full my-auto animate-pulse "
            >
              <Holds className="my-auto">
                <Spinner />
              </Holds>
            </Holds>
            <Holds
              background={"white"}
              className=" row-span-2 h-full my-auto animate-pulse  "
            >
              <Holds></Holds>
            </Holds>
            <Holds
              background={"white"}
              className=" row-span-3 h-full my-auto animate-pulse  "
            >
              <Holds></Holds>
            </Holds>
            <Holds className=" row-span-1 h-full my-auto  ">
              <Holds position={"row"} className="gap-4">
                <Buttons disabled className="h-full py-2">
                  <Titles></Titles>
                </Buttons>
                <Buttons disabled className="h-full py-6">
                  <Titles></Titles>
                </Buttons>
              </Holds>
            </Holds>
          </Grids>
        </Contents>
      </Bases>
    );
  }

  return (
    <Bases>
      <Contents>
        <Grids rows={isEditingTime ? "14" : "15"} cols="5" gap="6">
          <Holds background="white" className="row-span-2 col-span-5 p-4">
            <TitleBoxes
              version="horizontal"
              title={formState.Equipment.name}
              type="noIcon"
              titleImg=""
              titleImgAlt="No equipment image"
              variant="default"
              size="default"
            />
          </Holds>

          <Holds
            background="white"
            className={
              isEditingTime
                ? "row-span-3 col-span-5 p-1"
                : "row-span-1 col-span-5 p-1"
            }
          >
            <Texts size="p2">Total Usage</Texts>
            {!isEditingTime ? (
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  disabled
                  value={calculateTotalUsage(
                    formState.startTime,
                    formState.endTime || new Date().toISOString()
                  )}
                  className="border p-2 w-full"
                />
                <button onClick={() => setIsEditingTime(true)} className="ml-2">
                  Edit
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-4 col-span-5 gap-4">
                <button onClick={revertTimeChanges}>Revert Changes</button>
                <input
                  type="time"
                  value={formState.startTime}
                  defaultValue={originalState.startTime}
                  onChange={(e) =>
                    handleFieldChange("startTime", e.target.value)
                  }
                />
                <input
                  type="time"
                  value={formState.endTime || ""}
                  defaultValue={originalState.endTime}
                  onChange={(e) => handleFieldChange("endTime", e.target.value)}
                />
                <button onClick={saveTimeChanges}>Save Changes</button>
              </div>
            )}
          </Holds>

          <Holds background="white" className="row-span-1 col-span-5 p-4">
            <Texts size="p2">Equipment Status</Texts>
            <SelectWtihRevert
              label={t("Status")}
              options={[
                { value: "OPERATIONAL", label: t("Operational") },
                { value: "NEEDS_REPAIR", label: t("NeedsRepair") },
                {
                  value: "NEEDS_MAINTENANCE",
                  label: t("NeedsMaintenance"),
                },
              ]}
              size="large"
              value={formState.Equipment.status || ""}
              onChange={(value) => handleFieldChange("Equipment.status", value)}
              defaultValue={originalState.Equipment.status || ""}
              showAsterisk
            />
          </Holds>

          <Holds background="white" className="row-span-1 col-span-5 p-4">
            <Texts size="p2">Did you refuel?</Texts>
            <CheckBox
              id="refueled"
              name="refueled"
              label=""
              checked={(formState.fuel ?? 0) > 0}
              onChange={() => handleChangeRefueled()}
            />
          </Holds>
          {(formState.fuel ?? 0) > 0 && (
            <Holds background="white" className="row-span-1 col-span-5 p-4">
              <NumberInputWithRevert
                label={t("Fuel")}
                size="large"
                value={formState.fuel || 0}
                onChange={(newValue) => handleFieldChange("fuel", newValue)}
                showAsterisk={false}
                defaultValue={originalState.fuel || 0}
              />
            </Holds>
          )}

          <Holds
            position="row"
            background="white"
            className="row-span-2 col-span-5 p-4"
          >
            <TextInputWithRevert
              label={t("Comment")}
              size="large"
              value={formState.comment || ""}
              onChange={(newValue) => handleFieldChange("comment", newValue)}
              showAsterisk={false}
              defaultValue={originalState.comment || ""}
            />
          </Holds>

          <Holds
            background="white"
            position="row"
            className="row-span-1 col-span-5 gap-4"
          >
            <Buttons
              onClick={saveEdits}
              background="green"
              disabled={!hasComment()}
            >
              <Titles>{t("Save")}</Titles>
            </Buttons>
          </Holds>
        </Grids>
      </Contents>
    </Bases>
  );
}
