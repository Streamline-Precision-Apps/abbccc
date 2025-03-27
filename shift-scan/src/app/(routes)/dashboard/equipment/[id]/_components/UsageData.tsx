import { CheckBox } from "@/components/(inputs)/checkBox";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Selects } from "@/components/(reusable)/selects";
import { Texts } from "@/components/(reusable)/texts";
import RefuelEquipmentLogsList from "../RefuelEquipmentLogsList";
import { Titles } from "@/components/(reusable)/titles";
import { differenceInSeconds, format, parseISO } from "date-fns";

import { TextAreas } from "@/components/(reusable)/textareas";
import { z } from "zod";
import { useNotification } from "@/app/context/NotificationContext";
import { EquipmentStatus } from "@/lib/types";

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
  maintenanceId: z.object({
    id: z.string().nullable(),
    equipmentIssue: z.string(),
    additionalInfo: z.string(),
  }),
});

type EquipmentLog = z.infer<typeof EquipmentLogSchema>;

interface UsageDataProps {
  formState: EquipmentLog;
  handleFieldChange: (
    field: string,
    value: string | number | boolean | EquipmentStatus
  ) => void;
  formattedTime: string;
  refueledLogs: boolean | undefined;
  handleChangeRefueled: () => void;
  AddRefuelLog: () => void;
  refuelLogs: Refueled[] | undefined;
  setRefuelLogs: React.Dispatch<React.SetStateAction<Refueled[] | undefined>>;
  deleteLog: () => void;
  saveEdits: () => void;
  handleFullOperational: () => void;
  fullyOperational: boolean | undefined;
  t: (key: string) => string;
  isFormValid: () => boolean;
}

export default function UsageData({
  formState,
  handleFieldChange,
  formattedTime,
  refueledLogs,
  handleChangeRefueled,
  handleFullOperational,
  AddRefuelLog,
  refuelLogs,
  setRefuelLogs,
  deleteLog,
  saveEdits,
  fullyOperational,
  t,
  isFormValid,
}: UsageDataProps) {
  const { setNotification } = useNotification();
  return (
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
              const newTime = e.target.value;
              const currentDate = new Date(formState.startTime || new Date());
              const [newHours, newMinutes] = newTime.split(":").map(Number);
              currentDate.setHours(newHours, newMinutes, 0, 0);
              handleFieldChange("startTime", currentDate.toISOString());
            }}
          />
        </Holds>
        <Holds className="w-full">
          <Labels size="p5">End Time</Labels>
          <Inputs
            type="time"
            value={
              formState.endTime
                ? format(new Date(parseISO(formState.endTime)), "HH:mm")
                : ""
            }
            className="w-full border-[3px] border-l-[1.5px] border-black p-1 rounded-[10px] rounded-l-none"
            onChange={(e) => {
              const newTime = e.target.value;
              const currentDate = new Date(formState.endTime || new Date());
              const [newHours, newMinutes] = newTime.split(":").map(Number);
              currentDate.setHours(newHours, newMinutes, 0, 0);
              handleFieldChange("endTime", currentDate.toISOString());
            }}
          />
        </Holds>
      </Holds>

      <Holds background="white" className="w-full  relative">
        <Labels size="p5">{t("Comment")}</Labels>
        <TextAreas
          maxLength={40}
          placeholder="Enter comments here..."
          value={formState.comment || ""}
          onChange={(e) => handleFieldChange("comment", e.target.value)}
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
            typeof formState.comment === "string" ? formState.comment.length : 0
          }/40`}
        </Texts>
      </Holds>

      <Holds position={"row"} className="w-full pb-4">
        <Holds size={"90"} className="h-full justify-center">
          <Texts position={"left"} size="p5">
            Fully Operational?
          </Texts>
        </Holds>
        <Holds size={"20"} className="h-full  justify-center relative">
          <CheckBox
            id="fullyOperational"
            name="fullyOperational"
            size={2}
            checked={fullyOperational}
            onChange={() => handleFullOperational()}
          />
        </Holds>
      </Holds>

      <Holds position={"row"} className="w-full pb-4">
        <Holds size={"70"} className="h-full justify-center">
          <Texts position={"left"} size="p5">
            Did you refuel?
          </Texts>
        </Holds>

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
      </Holds>

      {refueledLogs && refuelLogs && refuelLogs.length > 0 && (
        <Holds>
          <RefuelEquipmentLogsList
            refuelLogs={refuelLogs}
            setRefuelLogs={setRefuelLogs}
            mileage={false}
          />
        </Holds>
      )}
    </Holds>
  );
}
