"use client";
import { setStartingMileage } from "@/actions/cookieActions";
import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";

type StartingMileageProps = {
  startingMileage: number | null;
  setStartingMileage: (startingMileage: number | null) => void;
};

const StartingMileage = createContext<StartingMileageProps | undefined>(
  undefined
);

export const StartingMileageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [startingMileage, setStartingMileageState] = useState<number | null>(
    null
  );
  useEffect(() => {
    const initializeMileage = async () => {
      try {
        // Fetch cookie data once during initialization
        const previousStartingMileage = await fetch(
          "/api/cookies?method=get&name=truck"
        ).then((res) => res.json());

        if (previousStartingMileage && previousStartingMileage !== "") {
          setStartingMileageState(previousStartingMileage);
        }
      } catch (error) {
        console.error("Error fetching job site cookie:", error);
      }
    };

    initializeMileage();
  }, []); // Run only on mount

  useEffect(() => {
    const setStartingMileageState = async () => {
      try {
        if (startingMileage !== null) {
          await setStartingMileage(startingMileage?.toString() || ""); // Set the cookie if scanResult changes
        }
      } catch (error) {
        console.error("Error saving job site cookie:", error);
      }
    };
    setStartingMileageState();
  }, [startingMileage]);
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
      "useStartingMileage must be used within a StartingMileageProvider"
    );
  }
  return context;
};
