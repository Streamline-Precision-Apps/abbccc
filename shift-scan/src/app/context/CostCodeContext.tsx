// This is used to store the state of costcode.

"use client";
import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { useSession } from "next-auth/react";
import { fetchWithOfflineCache } from "@/utils/offlineApi";
import { useServerAction } from "@/utils/serverActionWrapper";
import { setCostCode as setCostCodeCookie } from "@/actions/cookieActions";
// creates a prop to be passes to a context
type SavedCostCodeProps = {
  savedCostCode: string | null;
  setCostCode: (costCode: string | null) => void;
};
// creates a value to a savedCostCode context
type savedCostCode = {
  savedCostCode: string;
};
// creates a context for the savedCostCode we pass this through the export
const savedCostCode = createContext<SavedCostCodeProps | undefined>(undefined);

export const SavedCostCodeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [costcode, setCostCode] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const { execute: executeServerAction } = useServerAction();
  const { data: session, status } = useSession();

  // Initialize only once - but only when user is authenticated
  useEffect(() => {
    if (isInitialized || status === "loading") return;

    // Only make API calls if user is authenticated
    if (status === "unauthenticated") {
      setIsInitialized(true);
      return;
    }

    const initializeCostCode = async () => {
      try {
        const previousCostCode = await fetchWithOfflineCache("costCode", () =>
          fetch("/api/cookies?method=get&name=costCode").then((res) =>
            res.json(),
          ),
        );
        if (previousCostCode && previousCostCode !== "") {
          setCostCode(previousCostCode);
        }
      } catch (error) {
        console.error("Error fetching cost code cookie:", error);
      } finally {
        setIsInitialized(true);
      }
    };
    initializeCostCode();
  }, [isInitialized, status]);

  // Save changes only after initialization
  useEffect(() => {
    if (!isInitialized || costcode === null || costcode === "") return;

    const savedCostCodeAsync = async () => {
      try {
        await executeServerAction(
          "setCostCodeCookie",
          setCostCodeCookie,
          costcode,
        );
      } catch (error) {
        console.error("Failed to save cost code:", error);
      }
    };
    
    // Properly handle the async function call
    savedCostCodeAsync().catch((error) => {
      console.error("Unhandled error in savedCostCodeAsync:", error);
    });
  }, [costcode, executeServerAction, isInitialized]);

  // Removed redundant sync call - useOfflineSync hook handles auto-sync
  return (
    <savedCostCode.Provider value={{ savedCostCode: costcode, setCostCode }}>
      {children}
    </savedCostCode.Provider>
  );
};
// this is used to get the value of the savedCostCode
export const useSavedCostCode = () => {
  const context = useContext(savedCostCode);
  if (context === undefined) {
    throw new Error("useScanData must be used within a ScanDataProvider");
  }
  return context;
};
