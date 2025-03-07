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
import { Buttons } from "@/components/(reusable)/buttons";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { EquipmentStatus, FormStatus } from "@prisma/client";
import { Titles } from "@/components/(reusable)/titles";
import { Labels } from "@/components/(reusable)/labels";
import { Inputs } from "@/components/(reusable)/inputs";
import { differenceInSeconds, format, parseISO, set } from "date-fns";
import { Selects } from "@/components/(reusable)/selects";
import { TextAreas } from "@/components/(reusable)/textareas";
import {
  createRefuelEquipmentLog,
  deleteEmployeeEquipmentLog,
} from "@/actions/truckingActions";
import RefuelEquipmentLogsList from "./RefuelEquipmentLogsList";
import Spinner from "@/components/(animations)/spinner";

type Refueled = {
  id: string;
  employeeEquipmentLogId: string | null;
  truckingLogId: string | null;
  gallonsRefueled: number | null;
  milesAtfueling: number | null;
  tascoLogId: string | null;
};

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

export default function CombinedForm({ params }: { params: { id: string } }) {
  const router = useRouter();
  const id = params.id;
  const { setNotification } = useNotification();
  const t = useTranslations("Equipment");
  const [isLoading, setIsLoading] = useState(true);
  const [refuelLogs, setRefuelLogs] = useState<Refueled[]>();
  const [formState, setFormState] = useState({
    id: "",
    equipmentId: "",
    employeeId: "",
    startTime: "",
    endTime: "",
    comment: "",
    isFinished: false,
    refueled: [],
    equipment: {
      name: "",
      status: EquipmentStatus.OPERATIONAL,
    },
  } as EquipmentLog);

  const [originalState, setOriginalState] = useState(formState);
  const [hasChanged, setHasChanged] = useState<boolean>();
  const [refueledLogs, setRefueledLogs] = useState<boolean>();

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
          startTime: data.startTime.toString(),
          endTime: data.endTime
            ? data.endTime.toString()
            : new Date().toISOString(),
          comment: data.comment || "",
          isFinished: data.isFinished || false,
          refueled: [
            {
              gallonsRefueled: data.gallonsRefueled || 0,
              milesAtfueling: data.milesAtfueling || 0,
            },
          ],
          equipment: {
            name: data.equipment?.name || "",
            status: data.equipment?.status || EquipmentStatus.OPERATIONAL,
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

        const isRefueled = data.refueled.length > 0;

        console.log("isRefueled: ", isRefueled);

        setRefueledLogs(isRefueled);
      } catch (error) {
        console.error("Error fetching equipment log:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEqLog();
  }, [id]);

  useEffect(() => {
    const fetchRefuelLogs = async () => {
      try {
        const response = await fetch(`/api/getEquipmentRefueledLogs/${id}`);
        const data = await response.json();
        setRefuelLogs(data);
      } catch (error) {
        console.error("Error fetching refuel logs:", error);
      }
    };

    fetchRefuelLogs();
  }, [id]);

  const handleFieldChange = (
    field: string,
    value: string | number | boolean | FormStatus | EquipmentStatus
  ) => {
    if (field === "Equipment.status") {
      setFormState((prev) => ({
        ...prev,
        equipment: {
          ...prev.equipment,
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

  const AddRefuelLog = async () => {
    const formData = new FormData();
    formData.append("employeeEquipmentLogId", formState.id ?? "");
    try {
      const tempRefuelLog = await createRefuelEquipmentLog(formData);
      setRefuelLogs((prev) => [
        {
          id: tempRefuelLog.id,
          employeeEquipmentLogId: tempRefuelLog.employeeEquipmentLogId ?? "",
          truckingLogId: tempRefuelLog.truckingLogId ?? "",
          gallonsRefueled: tempRefuelLog.gallonsRefueled ?? 0,
          milesAtfueling: tempRefuelLog.milesAtfueling ?? 0,
          tascoLogId: tempRefuelLog.tascoLogId ?? "",
        },
        ...(prev ?? []),
      ]);
    } catch (error) {
      console.log("error adding state Mileage", error);
    }
  };

  const handleChangeRefueled = () => {
    if (refueledLogs) {
      setRefueledLogs(false);
    } else {
      setRefueledLogs(true);
    }
  };

  const deleteLog = async () => {
    try {
      await deleteEmployeeEquipmentLog(formState.id);
      setNotification(t("Deleted"), "success");
      router.replace("/dashboard/equipment");
    } catch (error) {
      console.error("Error deleting equipment log:", error);
      setNotification(t("FailedToDelete"), "error");
    }
  };

  const saveEdits = async () => {
    try {
      const formData = new FormData();
      Object.entries(formState).forEach(([key, value]) => {
        if (key === "equipment") {
        } else {
          formData.append(key, String(value));
        }
      });
      formData.set(
        "Equipment.status",
        formState.equipment.status || EquipmentStatus.OPERATIONAL
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

  const start = parseISO(formState.startTime);
  const end = formState.endTime ? parseISO(formState.endTime) : new Date();
  const diffInSeconds = differenceInSeconds(end, start);
  const hours = Math.floor(diffInSeconds / 3600);
  const minutes = Math.floor((diffInSeconds % 3600) / 60);
  const seconds = diffInSeconds % 60;
  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  useEffect(() => {
    if (formState !== originalState) {
      setHasChanged(true);
    }
  }, [formState, originalState]);
  return (
    <Bases className="fixed h-full w-full">
      <Contents>
        <Grids rows={"7"} gap={"5"} className="h-full w-full ">
          <Holds
            background="white"
            className={
              isLoading
                ? "row-span-1 h-full justify-center animate-pulse"
                : "row-span-1 h-full justify-center"
            }
          >
            <TitleBoxes
              title={
                isLoading
                  ? "Loading..."
                  : `${formState.equipment.name.slice(0, 16)}...`
              }
              type="row"
              titleImg=""
              titleImgAlt="No equipment image"
              className="w-full h-full"
            />
          </Holds>

          <Holds
            background="white"
            className={
              isLoading
                ? "row-start-2 row-end-8 h-full animate-pulse"
                : "row-start-2 row-end-8 h-full "
            }
          >
            {isLoading ? (
              <>
                <Holds className="h-full w-full justify-center">
                  <Spinner />
                </Holds>
              </>
            ) : (
              <>
                <Contents width={"section"}>
                  <Grids rows={"8"} gap={"5"} className="h-full w-full py-3">
                    <Holds className="row-start-1 row-end-8 w-full h-full overflow-y-auto no-scrollbar  ">
                      <Labels size="p5">Total Usage</Labels>
                      <Inputs
                        type="text"
                        disabled
                        value={formattedTime}
                        className="border-[3px] border-black p-1 w-full text-center"
                      />
                      <Holds position={"row"} className="w-full ">
                        <Holds className="w-full">
                          <Labels size="p5">Start Time</Labels>
                          <Inputs
                            type="time"
                            value={
                              formState.startTime
                                ? format(new Date(formState.startTime), "HH:mm")
                                : ""
                            }
                            className="w-full border-[3px] border-r-[1.5px] border-black p-1 rounded-[10px] rounded-r-none"
                            onChange={(e) => {
                              const newTime = e.target.value; // e.g., "14:30"
                              // Use the existing startTime date or default to today's date if empty
                              const currentDate = new Date(
                                formState.startTime || new Date()
                              );
                              // Split the new time string into hours and minutes
                              const [newHours, newMinutes] = newTime
                                .split(":")
                                .map(Number);
                              // Update the date with the new hours and minutes (set seconds and ms to 0)
                              currentDate.setHours(newHours, newMinutes, 0, 0);
                              // Update the state with the new ISO string
                              handleFieldChange(
                                "startTime",
                                currentDate.toISOString()
                              );
                            }}
                          />
                        </Holds>
                        <Holds className="w-full">
                          <Labels size="p5">End Time</Labels>
                          <Inputs
                            type="time"
                            value={
                              formState.endTime
                                ? format(
                                    new Date(parseISO(formState.endTime)),
                                    "HH:mm"
                                  )
                                : ""
                            }
                            className="w-full border-[3px] border-l-[1.5px] border-black p-1 rounded-[10px] rounded-l-none"
                            onChange={(e) => {
                              const newTime = e.target.value; // e.g., "15:45"
                              // Use the existing endTime date or default to today's date if empty
                              const currentDate = new Date(
                                formState.endTime || new Date()
                              );
                              const [newHours, newMinutes] = newTime
                                .split(":")
                                .map(Number);
                              currentDate.setHours(newHours, newMinutes, 0, 0);
                              handleFieldChange(
                                "endTime",
                                currentDate.toISOString()
                              );
                            }}
                          />
                        </Holds>
                      </Holds>

                      <Labels size="p6">Equipment Status</Labels>
                      <Selects
                        className="w-full text-center rounded-[10px] border-[3px] border-black focus:outline-none p-2"
                        value={formState.equipment.status || ""}
                        onChange={(e) =>
                          handleFieldChange(
                            "Equipment.status",
                            e.currentTarget.value
                          )
                        }
                      >
                        <option value="OPERATIONAL">{t("Operational")}</option>
                        <option value="NEEDS_REPAIR">{t("NeedsRepair")}</option>
                        <option value="NEEDS_MAINTENANCE">
                          {t("NeedsMaintenance")}
                        </option>
                      </Selects>
                      <Holds background="white" className="w-full  relative">
                        <Labels size="p5">{t("Comment")}</Labels>
                        <TextAreas
                          maxLength={40}
                          placeholder="Enter comments here..."
                          value={formState.comment || ""}
                          onChange={(e) =>
                            handleFieldChange("comment", e.target.value)
                          }
                        />
                        <Texts
                          size="p3"
                          className={`${
                            typeof formState.comment === "string" &&
                            formState.comment.length >= 40
                              ? "text-red-500 absolute bottom-4 right-4"
                              : "absolute bottom-4 right-4"
                          }`}
                        >
                          {`${
                            typeof formState.comment === "string"
                              ? formState.comment.length
                              : 0
                          }/40`}
                        </Texts>
                      </Holds>
                      <Holds position={"row"} className="w-full pb-4">
                        <Holds size={"40"} className="h-full justify-center">
                          <Texts position={"left"} size="p5">
                            Did you refuel?
                          </Texts>
                        </Holds>
                        <Holds
                          size={"30"}
                          className="h-full justify-center relative"
                        >
                          <CheckBox
                            id="refueled"
                            name="refueled"
                            size={2}
                            checked={refueledLogs}
                            onChange={() => handleChangeRefueled()}
                          />
                        </Holds>
                        {refueledLogs && (
                          <Holds size={"30"} className="h-full justify-center">
                            <Holds position={"left"} className="p-2">
                              <Buttons
                                background={"green"}
                                className="py-1.5"
                                onClick={() => {
                                  AddRefuelLog();
                                }}
                              >
                                +
                              </Buttons>
                            </Holds>
                          </Holds>
                        )}
                      </Holds>

                      {refueledLogs && refuelLogs && refuelLogs.length > 0 && (
                        <Holds>
                          <RefuelEquipmentLogsList
                            refuelLogs={refuelLogs}
                            setRefuelLogs={setRefuelLogs}
                          />
                        </Holds>
                      )}
                    </Holds>

                    <Holds
                      position={"row"}
                      background="white"
                      className="w-full gap-4 row-start-8 row-end-9 py-2"
                    >
                      <Buttons
                        onClick={() => {
                          deleteLog();
                        }}
                        background="red"
                        className="w-full "
                      >
                        <Titles size="h5">Delete Log</Titles>
                      </Buttons>
                      {/* {hasChanged && ( */}
                      <Buttons
                        onClick={() => {
                          saveEdits();
                        }}
                        background="lightBlue"
                        className="w-full "
                      >
                        <Titles size="h5">Finish Logs</Titles>
                      </Buttons>
                      {/* )} */}
                    </Holds>
                  </Grids>
                </Contents>
              </>
            )}
          </Holds>
        </Grids>
      </Contents>
    </Bases>
  );
}
