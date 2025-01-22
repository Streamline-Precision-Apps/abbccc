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
// import { calculateDuration } from "@/utils/calculateDuration";
import { Titles } from "@/components/(reusable)/titles";
import SelectWtihRevert from "@/components/(reusable)/selectWithRevert";
import TextInputWithRevert from "@/components/(reusable)/textInputWithRevert";
import NumberInputWithRevert from "@/components/(reusable)/numberInputWithRevert";
import { EquipmentStatus, FormStatus } from "@prisma/client";

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
  //TODO add a banner to show notification
  const { setNotification } = useNotification();
  const t = useTranslations("Equipment");
  const [isLoading, setIsLoading] = useState(true);
  const [refueled, setRefueled] = useState(false);
  // const [editTime, setEditTime] = useState(false);

  const [formState, setFormState] = useState({
    id: "",
    equipmentId: "",
    employeeId: "",
    startTime: "",
    endTime: "",
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

        const processedData = {
          id: data.id || "",
          equipmentId: data.equipmentId || "",
          employeeId: data.employeeId || "",
          startTime: data.startTime || "",
          endTime: data.endTime || "",
          comment: data.comment || "",
          isSubmitted: data.isSubmitted || false,
          fuel: data.fuel || 0,
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

        // const validatedData = result.data;

        // setFormState(validatedData);
        // setOriginalState(validatedData);

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

  // const handleFieldChange = (fieldName: string, value: string | number | boolean | FormStatus | EquipmentStatus) => {
  //   setFormState((prevState) => {
  //     const newState = { ...prevState as EquipmentLog };
  //     const keys = fieldName.split(".");

  //     let current = newState;
  //     for (let i = 0; i < keys.length - 1; i++) {
  //       if (!current[keys[i]]) {
  //         current[keys[i]] = {};
  //       }
  //       current = current[keys[i]];
  //     }

  //     current[keys[keys.length - 1]] = value;
  //     return newState;
  //   });
  // };

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

  const handleChangeRefueled = () => {
    setRefueled((prev) => !prev);
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

  const deleteLog = async () => {
    try {
      const formData = new FormData();
      formData.append("id", id);
      await DeleteLogs(formData);
      setNotification(t("Deleted"), "success");
      router.replace("/dashboard/equipment");
    } catch (error) {
      console.error("Error deleting log:", error);
      setNotification(t("FailedToDelete"), "error");
    }
  };

  useEffect(() => {
    console.log("Form state changed:", formState);
  }, [formState]);

  const hasChanges = () => {
    return JSON.stringify(formState) !== JSON.stringify(originalState);
  };

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
                titleImg="/current.svg"
                titleImgAlt="Current"
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
        <Grids rows={"10"} gap={"5"}>
          <Holds background={"white"} className="my-auto row-span-1 h-full">
            <TitleBoxes
              version="horizontal"
              title={formState.Equipment.name}
              type="noIcon"
              titleImg="/current.svg"
              titleImgAlt="No equipment image"
              variant="default"
              size="default"
            />
          </Holds>

          <Holds background={"white"} className="row-span-3 h-full">
            <Contents width={"section"} className="h-full">
              <Grids rows={"2"} cols={"4"} className="h-full">
                <Holds className="my-auto col-span-3 row-span-1">
                  <Texts size={"p2"} position={"left"}>
                    {t("Refueled")}
                  </Texts>
                </Holds>
                <Holds
                  position={"right"}
                  className="col-span-1 my-auto row-span-1"
                >
                  <CheckBox
                    id="refueled"
                    name="refueled"
                    label=""
                    checked={refueled}
                    onChange={() => handleChangeRefueled()}
                  />
                </Holds>

                {/* Fuel Section */}
                {refueled && (
                  <Holds className="row-span-1 col-span-4 my-4">
                    <NumberInputWithRevert
                      label={t("Fuel")}
                      size="large"
                      value={formState.fuel || 0}
                      onChange={(newValue) =>
                        handleFieldChange("fuel", newValue)
                      }
                      showAsterisk={false}
                      defaultValue={originalState.fuel || 0}
                    />
                  </Holds>
                )}
              </Grids>
            </Contents>
          </Holds>

          <Holds background={"white"} className="row-span-5 h-full">
            <Contents width={"section"}>
              {/* <Holds position={"row"} className="row-span-1 my-4">
                <SelectWtihRevert
                  label={t("LogStatus")}
                  options={[
                    { value: "PENDING", label: t("Pending") },
                    { value: "APPROVED", label: t("Approved") },
                  ]}
                  size="large"
                  value={formState.status}
                  onChange={(value) => handleFieldChange("status", value)}
                  defaultValue={originalState.status}
                  showAsterisk
                />
              </Holds> */}

              {/* Status Section */}
              <Holds position={"row"} className="row-span-1 my-4">
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
                  onChange={(value) =>
                    handleFieldChange("Equipment.status", value)
                  }
                  defaultValue={originalState.Equipment.status || ""}
                  showAsterisk
                />
              </Holds>

              {/* Comments Section */}
              <Holds position={"row"} className="row-span-2 h-full">
                <TextInputWithRevert
                  label={t("Comment")}
                  size="large"
                  value={formState.comment || ""}
                  onChange={(newValue) =>
                    handleFieldChange("comment", newValue)
                  }
                  showAsterisk={false}
                  defaultValue={originalState.comment || ""}
                />
              </Holds>
            </Contents>
          </Holds>
        </Grids>
        {/* Buttons Section */}
        <Holds position="row" className="mt-4 gap-4">
          {hasChanges() && (
            <Buttons onClick={saveEdits} background="green">
              <Titles>{t("Save")}</Titles>
            </Buttons>
          )}
          <Buttons onClick={deleteLog} background="red">
            <Titles>{t("Delete")}</Titles>
          </Buttons>
        </Holds>
      </Contents>
    </Bases>
  );
}
