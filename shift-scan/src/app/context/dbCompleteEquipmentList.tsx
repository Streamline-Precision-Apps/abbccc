import React, { createContext, useContext, useState, ReactNode } from "react";
import { Equipment } from "@/lib/types";

type EquipmentContextType = {
  equipmentListResults: Equipment[];
  setEquipmentListResults: React.Dispatch<React.SetStateAction<Equipment[]>>;
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
  const [equipmentListResults, setEquipmentListResults] = useState<Equipment[]>(
    []
  );

  return (
    <EquipmentContext.Provider
      value={{ equipmentListResults, setEquipmentListResults }}
    >
      {children}
    </EquipmentContext.Provider>
  );
};

export const useDBCompleteEquipmentList = () => useContext(EquipmentContext);
