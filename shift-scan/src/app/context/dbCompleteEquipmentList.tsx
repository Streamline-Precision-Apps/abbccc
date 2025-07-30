import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { fetchWithOfflineCache } from "@/utils/offlineApi";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
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

  const equipmentListUrl = usePathname();
  const equipmentListOnline = useOnlineStatus();
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (
          equipmentListUrl === "/clock" ||
          equipmentListUrl === "/dashboard/equipment/log-new" ||
          equipmentListUrl === "/dashboard/switch-jobs" ||
          equipmentListUrl === "/break"
        ) {
          const recentEquipmentList = await fetchWithOfflineCache(
            "getEquipmentList",
            () => fetch("/api/getEquipmentList").then((res) => res.json())
          );
          const validatedEquipmentList = EquipmentSchema.parse(recentEquipmentList);
          const isAvailableEquipment = validatedEquipmentList.filter(
            (item) => item.state === "AVAILABLE"
          );
          setEquipmentListResults(isAvailableEquipment);
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error("Validation error in Equipment List schema:", error);
        }
      }
    };
    fetchData();
  }, [equipmentListUrl, equipmentListOnline]);

  return (
    <EquipmentContext.Provider
      value={{ equipmentListResults, setEquipmentListResults }}
    >
      {children}
    </EquipmentContext.Provider>
  );
};

export const useDBCompleteEquipmentList = () => useContext(EquipmentContext);
