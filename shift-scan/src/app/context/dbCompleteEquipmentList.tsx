import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { CompleteListEquipment } from "@/lib/types";
import { z } from "zod";
import { usePathname } from "next/navigation";

type EquipmentContextType = {
  equipmentListResults: CompleteListEquipment[];
  setEquipmentListResults: React.Dispatch<
    React.SetStateAction<CompleteListEquipment[]>
  >;
};

const EquipmentContext = createContext<EquipmentContextType>({
  equipmentListResults: [],
  setEquipmentListResults: () => {},
});
const EquipmentSchema = z.array(
  z.object({
    id: z.string(),
    qrId: z.string(),
    name: z.string(),
    description: z.string().optional(),
    equipmentTag: z.enum(["EQUIPMENT", "VEHICLE", "TRUCK", "TRAILER"]),
    lastInspection: z.string().nullable().optional(),
    nextInspection: z.string().nullable().optional(),
    nextInspectionComment: z.string().nullable().optional(),
    lastRepair: z.string().nullable().optional(),
    status: z.enum(["OPERATIONAL", "NEEDS_REPAIR", "NEEDS_MAINTENANCE"]),
    createdAt: z.string(),
    updatedAt: z.string(),
    make: z.string().nullable().optional(),
    model: z.string().nullable().optional(),
    year: z.string().nullable().optional(),
    licensePlate: z.string().nullable().optional(),
    registrationExpiration: z.string().nullable().optional(),
    mileage: z.number().nullable().optional(),
    isActive: z.boolean(),
    inUse: z.boolean(),
    jobsiteId: z.string().nullable().optional(),
    overWeight: z.boolean().optional(),
    currentWeight: z.number().nullable().optional(),
  })
);

export const EquipmentListProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [equipmentListResults, setEquipmentListResults] = useState<
    CompleteListEquipment[]
  >([]);

  const url = usePathname();
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (
          url === "/clock" ||
          url === "/dashboard/log-new" ||
          url === "/dashboard/switch-jobs"
        ) {
          const response = await fetch("/api/getEquipmentList");
          const recentEquipmentList = await response.json();
          const validatedEquipmentList =
            EquipmentSchema.parse(recentEquipmentList);
          setEquipmentListResults(
            validatedEquipmentList
          ) as unknown as CompleteListEquipment[];
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error(
            "Validation error in Equipment List schema:",
            error.errors
          );
        }
      }
    };
    fetchData();
  }, [url]);

  return (
    <EquipmentContext.Provider
      value={{ equipmentListResults, setEquipmentListResults }}
    >
      {children}
    </EquipmentContext.Provider>
  );
};

export const useDBCompleteEquipmentList = () => useContext(EquipmentContext);
