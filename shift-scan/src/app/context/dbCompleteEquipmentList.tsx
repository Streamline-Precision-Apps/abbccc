import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { z } from "zod";
import { usePathname } from "next/navigation";

const EquipmentSchema = z.array(
  z.object({
    id: z.string(),
    qrId: z.string(),
    name: z.string(),
    state: z.enum([
      "NEEDS_REPAIR",
      "MAINTENANCE",
      "AVAILABLE",
      "IN_USE",
      "RETIRED",
    ]),
  })
);

type EquipmentItem = z.infer<typeof EquipmentSchema>[number];

type EquipmentContextType = {
  equipmentListResults: EquipmentItem[];
  setEquipmentListResults: React.Dispatch<
    React.SetStateAction<EquipmentItem[]>
  >;
};

const EquipmentContext = createContext<EquipmentContextType>({
  equipmentListResults: [],
  setEquipmentListResults: () => {},
});

export const EquipmentListProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [equipmentListResults, setEquipmentListResults] = useState<
    EquipmentItem[]
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
          // added filter to only include available equipment
          const isAvailableEquipment = validatedEquipmentList.filter(
            (item) => item.state === "AVAILABLE"
          );
          setEquipmentListResults(isAvailableEquipment);
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
