// Removed Feature for now.

// // This stores the previous 5 cost codes, jobsites, and equipment that the user has selected. This will make it easier to change cost codes.

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { fetchWithOfflineCache } from "@/utils/offlineApi";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { JobCodes, CostCodes, EquipmentCode } from "@/lib/types";
import { z } from "zod";
import { usePathname } from "next/navigation";

const CostCodesRecentSchema = z
  .array(
    z.object({
      id: z.string(),
      name: z.string(),
    }),
  )
  .nullable();

const EquipmentSchema = z.array(
  z.object({
    id: z.string(),
    qrId: z.string(),
    name: z.string(),
    equipmentTag: z.enum(["EQUIPMENT", "VEHICLE", "TRUCK", "TRAILER"]),
  }),
);

const JobsitesRecentSchema = z
  .array(
    z.object({
      id: z.string(),
      qrId: z.string(),
      isActive: z.boolean().optional(),
      status: z.string().optional(),
      name: z.string(),
      streetNumber: z.string().nullable().optional(),
      streetName: z.string().optional(),
      city: z.string().optional(),
      state: z.string().nullable().optional(),
      country: z.string().optional(),
      description: z.string().nullable().optional(),
      comment: z.string().nullable().optional(),
    }),
  )
  .nullable();

// type RecentJobSiteContextType = {
//   recentlyUsedJobCodes: JobCodes[];
//   setRecentlyUsedJobCodes: React.Dispatch<React.SetStateAction<JobCodes[]>>;
//   addRecentlyUsedJobCode: (code: JobCodes) => void;
// };

// const RecentJobSiteContext = createContext<RecentJobSiteContextType>({
//   recentlyUsedJobCodes: [],
//   setRecentlyUsedJobCodes: () => {},
//   addRecentlyUsedJobCode: () => {},
// });

// export const RecentJobSiteProvider = ({
//   children,
// }: {
//   children: ReactNode;
// }) => {
//   const [recentlyUsedJobCodes, setRecentlyUsedJobCodes] = useState<JobCodes[]>(
//     []
//   );
type RecentJobSiteContextType = {
  recentlyUsedJobCodes: JobCodes[];
  setRecentlyUsedJobCodes: React.Dispatch<React.SetStateAction<JobCodes[]>>;
  addRecentlyUsedJobCode: (code: JobCodes) => void;
};

const RecentJobSiteContext = createContext<
  RecentJobSiteContextType | undefined
>(undefined);

export const RecentJobSiteProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [recentlyUsedJobCodes, setRecentlyUsedJobCodes] = useState<JobCodes[]>(
    [],
  );
  const recentJobsiteUrl = usePathname();
  const recentJobsiteOnline = useOnlineStatus();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (
          recentJobsiteUrl === "/clock" ||
          recentJobsiteUrl === "/dashboard/equipment/log-new" ||
          recentJobsiteUrl === "/dashboard/switch-jobs" ||
          recentJobsiteUrl === "/break"
        ) {
          const recentJobSites = await fetchWithOfflineCache(
            "getRecentJobsites",
            () => fetch("/api/getRecentJobsites").then((res) => res.json()),
          );
          const validatedRecentJobSites =
            JobsitesRecentSchema.parse(recentJobSites);
          setRecentlyUsedJobCodes(validatedRecentJobSites ?? []);
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error(
            "Validation error in Recent JobSites schema:",
            error.issues,
          );
        }
      }
    };
    fetchData();
  }, [recentJobsiteUrl, recentJobsiteOnline]);

  const addRecentlyUsedJobCode = (code: JobCodes) => {
    setRecentlyUsedJobCodes((prev) => {
      const updatedList = [code, ...prev.filter((c) => c.qrId !== code.qrId)];
      return updatedList.slice(0, 5);
    });
  };

  return (
    <RecentJobSiteContext.Provider
      value={{
        recentlyUsedJobCodes,
        setRecentlyUsedJobCodes,
        addRecentlyUsedJobCode,
      }}
    >
      {children}
    </RecentJobSiteContext.Provider>
  );
};

export const useRecentDBJobsite = () => {
  const context = useContext(RecentJobSiteContext);
  if (!context)
    throw new Error(
      "useRecentDBJobsite must be used within a RecentJobSiteProvider",
    );
  return context;
};

//   const addRecentlyUsedJobCode = (code: JobCodes) => {
//     setRecentlyUsedJobCodes((prev) => {
//       const updatedList = [code, ...prev.filter((c) => c.qrId !== code.qrId)];
//       return updatedList.slice(0, 5);
//     });
//   };

//   return (
//     <RecentJobSiteContext.Provider
//       value={{
//         recentlyUsedJobCodes,
//         setRecentlyUsedJobCodes,
//         addRecentlyUsedJobCode,
//       }}
//     >
//       {children}
//     </RecentJobSiteContext.Provider>
//   );
// };

// export const useRecentDBJobsite = () => useContext(RecentJobSiteContext);

// interface RecentCostCodeContextType {
//   recentlyUsedCostCodes: CostCodes[];
//   setRecentlyUsedCostCodes: React.Dispatch<React.SetStateAction<CostCodes[]>>;
//   addRecentlyUsedCostCode: (code: CostCodes) => void;
// }

// const RecentCostCodeContext = createContext<RecentCostCodeContextType>({
//   recentlyUsedCostCodes: [],
//   setRecentlyUsedCostCodes: () => {},
//   addRecentlyUsedCostCode: () => {},
// });

// export const RecentCostCodeProvider = ({
//   children,
// }: {
//   children: ReactNode;
// }) => {
//   const [recentlyUsedCostCodes, setRecentlyUsedCostCodes] = useState<
//     CostCodes[]
//   >([]);
type RecentCostCodeContextType = {
  recentlyUsedCostCodes: CostCodes[];
  setRecentlyUsedCostCodes: React.Dispatch<React.SetStateAction<CostCodes[]>>;
  addRecentlyUsedCostCode: (code: CostCodes) => void;
};

const RecentCostCodeContext = createContext<
  RecentCostCodeContextType | undefined
>(undefined);

export const RecentCostCodeProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [recentlyUsedCostCodes, setRecentlyUsedCostCodes] = useState<
    CostCodes[]
  >([]);
  const recentCostCodeUrl = usePathname();
  const recentCostCodeOnline = useOnlineStatus();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (
          recentCostCodeUrl === "/clock" ||
          recentCostCodeUrl === "/dashboard/equipment/log-new" ||
          recentCostCodeUrl === "/dashboard/switch-jobs" ||
          recentCostCodeUrl === "/break"
        ) {
          const recentCostCodes = await fetchWithOfflineCache(
            "getRecentCostCodes",
            () => fetch("/api/getRecentCostCodes").then((res) => res.json()),
          );
          const validatedRecentCostCodes =
            CostCodesRecentSchema.parse(recentCostCodes);
          setRecentlyUsedCostCodes(validatedRecentCostCodes ?? []);
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error(
            "Validation error in Recent CostCodes schema:",
            error.issues,
          );
        }
      }
    };
    fetchData();
  }, [recentCostCodeUrl, recentCostCodeOnline]);

  const addRecentlyUsedCostCode = (code: CostCodes) => {
    setRecentlyUsedCostCodes((prev) => {
      const updatedList = [
        code,
        ...prev.filter((c) => c !== null && c.name !== code.name),
      ];
      return updatedList.slice(0, 5);
    });
  };

  return (
    <RecentCostCodeContext.Provider
      value={{
        recentlyUsedCostCodes,
        setRecentlyUsedCostCodes,
        addRecentlyUsedCostCode,
      }}
    >
      {children}
    </RecentCostCodeContext.Provider>
  );
};

export const useRecentDBCostcode = () => {
  const context = useContext(RecentCostCodeContext);
  if (!context)
    throw new Error(
      "useRecentDBCostcode must be used within a RecentCostCodeProvider",
    );
  return context;
};

//   const addRecentlyUsedCostCode = (code: CostCodes) => {
//     setRecentlyUsedCostCodes((prev) => {
//       const updatedList = [
//         code,
//         ...prev.filter((c) => c !== null && c.name !== code.name), // Check if c is not null
//       ];
//       return updatedList.slice(0, 5);
//     });
//   };

//   return (
//     <RecentCostCodeContext.Provider
//       value={{
//         recentlyUsedCostCodes,
//         setRecentlyUsedCostCodes,
//         addRecentlyUsedCostCode,
//       }}
//     >
//       {children}
//     </RecentCostCodeContext.Provider>
//   );
// };

// export const useRecentDBCostcode = () => useContext(RecentCostCodeContext);

// interface RecentEquipmentContextType {
//   recentlyUsedEquipment: EquipmentCode[];
//   setRecentlyUsedEquipment: React.Dispatch<
//     React.SetStateAction<EquipmentCode[]>
//   >;
//   addRecentlyUsedEquipment: (equipment: EquipmentCode) => void;
// }

// const RecentEquipmentContext = createContext<RecentEquipmentContextType>({
//   recentlyUsedEquipment: [],
//   setRecentlyUsedEquipment: () => {},
//   addRecentlyUsedEquipment: () => {},
// });

// export const RecentEquipmentProvider = ({
//   children,
// }: {
//   children: ReactNode;
// }) => {
//   const [recentlyUsedEquipment, setRecentlyUsedEquipment] = useState<
//     EquipmentCode[]
//   >([]);
type RecentEquipmentContextType = {
  recentlyUsedEquipment: EquipmentCode[];
  setRecentlyUsedEquipment: React.Dispatch<
    React.SetStateAction<EquipmentCode[]>
  >;
  addRecentlyUsedEquipment: (equipment: EquipmentCode) => void;
};

const RecentEquipmentContext = createContext<
  RecentEquipmentContextType | undefined
>(undefined);

export const RecentEquipmentProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [recentlyUsedEquipment, setRecentlyUsedEquipment] = useState<
    EquipmentCode[]
  >([]);
  const recentEquipmentUrl = usePathname();
  const recentEquipmentOnline = useOnlineStatus();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (
          recentEquipmentUrl === "/clock" ||
          recentEquipmentUrl === "/dashboard/log-new" ||
          recentEquipmentUrl === "/dashboard/switch-jobs" ||
          recentEquipmentUrl === "/break"
        ) {
          const recentEquipment = await fetchWithOfflineCache(
            "getRecentEquipment",
            () => fetch("/api/getRecentEquipment").then((res) => res.json()),
          );
          const validatedRecentEquipment =
            EquipmentSchema.parse(recentEquipment);
          setRecentlyUsedEquipment(validatedRecentEquipment ?? []);
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error(
            "Validation error in Recent Equipment schema:",
            error.issues,
          );
        }
      }
    };
    fetchData();
  }, [recentEquipmentUrl, recentEquipmentOnline]);

  const addRecentlyUsedEquipment = (equipment: EquipmentCode) => {
    setRecentlyUsedEquipment((prev) => {
      const updatedList = [
        equipment,
        ...prev.filter((e) => e.qrId !== equipment.qrId),
      ];
      return updatedList.slice(0, 5);
    });
  };

  return (
    <RecentEquipmentContext.Provider
      value={{
        recentlyUsedEquipment,
        setRecentlyUsedEquipment,
        addRecentlyUsedEquipment,
      }}
    >
      {children}
    </RecentEquipmentContext.Provider>
  );
};

export const useRecentDBEquipment = () => {
  const context = useContext(RecentEquipmentContext);
  if (!context)
    throw new Error(
      "useRecentDBEquipment must be used within a RecentEquipmentProvider",
    );
  return context;
};

//   const addRecentlyUsedEquipment = (equipment: EquipmentCode) => {
//     setRecentlyUsedEquipment((prev) => {
//       const updatedList = [
//         equipment,
//         ...prev.filter((e) => e.qrId !== equipment.qrId),
//       ];
//       return updatedList.slice(0, 5);
//     });
//   };

//   return (
//     <RecentEquipmentContext.Provider
//       value={{
//         recentlyUsedEquipment,
//         setRecentlyUsedEquipment,
//         addRecentlyUsedEquipment,
//       }}
//     >
//       {children}
//     </RecentEquipmentContext.Provider>
//   );
// };

// export const useRecentDBEquipment = () => useContext(RecentEquipmentContext);
