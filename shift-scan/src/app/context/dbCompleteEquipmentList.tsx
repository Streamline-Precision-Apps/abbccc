import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { ListEquipmentContext } from "@/lib/types";
import { z } from "zod";
import { usePathname } from "next/navigation";

type EquipmentContextType = {
  equipmentListResults: ListEquipmentContext[];
  setEquipmentListResults: React.Dispatch<
    React.SetStateAction<ListEquipmentContext[]>
  >;
};

const EquipmentContext = createContext<EquipmentContextType>({
  equipmentListResults: [],
  setEquipmentListResults: () => {},
});
// Updated to align with EmployeeEquipmentLog changes
const EquipmentSchema = z.array(
  z.object({
    id: z.string(),
    qrId: z.string(),
    name: z.string(),
    description: z.string().optional(),
    equipmentTag: z.enum(["EQUIPMENT", "VEHICLE", "TRUCK", "TRAILER"]),
    status: z.enum(["OPERATIONAL", "NEEDS_REPAIR", "NEEDS_MAINTENANCE"]),
    make: z.string().nullable().optional(),
    model: z.string().nullable().optional(),
    year: z.string().nullable().optional(),
    licensePlate: z.string().nullable().optional(),
    registrationExpiration: z.string().nullable().optional(),
    mileage: z.number().nullable().optional(),
    isActive: z.boolean(),
    inUse: z.boolean(),
    employeeLogs: z
      .array(
        z.object({
          employeeId: z.string(),
          startTime: z.string().nullable(),
          endTime: z.string().nullable(),
          comment: z.string().optional(),
          status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
          workType: z.enum(["GENERAL", "MAINTENANCE", "REFUEL"]),
        })
      )
      .optional(),
  })
);

export const EquipmentListProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [equipmentListResults, setEquipmentListResults] = useState<
    ListEquipmentContext[]
  >([]);

  const url = usePathname();
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (
          url === "/clock" ||
          url === "/dashboard/equipment/log-new" ||
          url === "/dashboard/switch-jobs" ||
          url === "/break"
        ) {
          const response = await fetch("/api/getEquipmentList");
          const recentEquipmentList = await response.json();
          const validatedEquipmentList =
            EquipmentSchema.parse(recentEquipmentList);
          setEquipmentListResults(validatedEquipmentList);
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
