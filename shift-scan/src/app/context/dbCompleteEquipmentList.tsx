import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Equipment } from "@/lib/types";
import { z } from "zod";
import { usePathname } from "next/navigation";

type EquipmentContextType = {
  equipmentListResults: Equipment[];
  setEquipmentListResults: React.Dispatch<React.SetStateAction<Equipment[]>>;
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
    equipmentTag: z.string().default("EQUIPMENT"),
    lastInspection: z.date().refine((date) => !isNaN(date.getTime()), {
      message: "Invalid date format",
    }),
    lastRepair: z.date().refine((date) => !isNaN(date.getTime()), {
      message: "Invalid date format",
    }),
    status: z.string().optional(),
    make: z.string().nullable().optional(),
    model: z.string().nullable().optional(),
    year: z.string().nullable().optional(),
    licensePlate: z.string().nullable().optional(),
    registrationExpiration: z.date().refine((date) => !isNaN(date.getTime()), {
      message: "Invalid date format",
    }),
    mileage: z.number().nullable().optional(),
    isActive: z.boolean().optional(),
    image: z.string().nullable().optional(),
    inUse: z.boolean().optional(),
  })
);

export const EquipmentListProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [equipmentListResults, setEquipmentListResults] = useState<Equipment[]>(
    []
  );

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
