"use client";
import { setStartingMileage } from "@/actions/cookieActions";
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

type StartingMileageProps = {
  startingMileage: number | null;
  setStartingMileage: (startingMileage: number | null) => void;
};

const StartingMileage = createContext<StartingMileageProps | undefined>(
  undefined,
);

export const StartingMileageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [startingMileage, setStartingMileageState] = useState<number | null>(
    null,
  );
  const [isInitialized, setIsInitialized] = useState(false);
  const { execute: executeServerAction } = useServerAction();
  const { data: session, status } = useSession();

  // Initialize only once
  useEffect(() => {
    if (isInitialized || status === "loading") return;

    // Only make API calls if user is authenticated
    if (status === "unauthenticated") {
      setIsInitialized(true);
      return;
    }

    const initializeMileage = async () => {
      try {
        const previousStartingMileage = await fetchWithOfflineCache(
          "startingMileage",
          () =>
            fetch("/api/cookies?method=get&name=truck").then((res) =>
              res.json(),
            ),
        );
        if (previousStartingMileage && previousStartingMileage !== "") {
          setStartingMileageState(previousStartingMileage);
        }
      } catch (error) {
        console.error("Error fetching starting mileage cookie:", error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeMileage();
  }, [isInitialized, status]);

  // Save changes only after initialization
  useEffect(() => {
    if (!isInitialized || startingMileage === null) return;

    console.log("StartingMileageContext2");
    const setStartingMileageStateAsync = async () => {
      try {
        if (startingMileage !== null) {
          await executeServerAction(
            "setStartingMileage",
            setStartingMileage,
            startingMileage?.toString() || "",
          );
        }
      } catch (error) {
        console.error("Error saving starting mileage cookie:", error);
      }
    };

    // Properly handle the async function call
    setStartingMileageStateAsync().catch((error) => {
      console.error("Unhandled error in setStartingMileageStateAsync:", error);
    });
  }, [startingMileage, executeServerAction, isInitialized]);

  // Removed redundant sync call - useOfflineSync hook handles auto-sync
  return (
    <StartingMileage.Provider
      value={{ startingMileage, setStartingMileage: setStartingMileageState }}
    >
      {children}
    </StartingMileage.Provider>
  );
};

export const useStartingMileage = () => {
  const context = useContext(StartingMileage);
  if (!context) {
    throw new Error(
      "useStartingMileage must be used within a StartingMileageProvider",
    );
  }
  return context;
};
