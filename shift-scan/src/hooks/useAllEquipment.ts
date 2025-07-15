import { useEffect, useState } from 'react';

export interface EquipmentSummary {
  id: string;
  qrId: string;
  name: string;
}

/**
 * Custom hook to fetch all equipment with id, qrId, and name.
 * Returns an array of equipment or an empty array if not loaded.
 */
export const useAllEquipment = (): EquipmentSummary[] => {
  const [allEquipment, setAllEquipment] = useState<EquipmentSummary[]>([]);

  useEffect(() => {
    // Replace with your actual API endpoint
    fetch('/api/getAllEquipmentIdAndQrId')
      .then((res) => res.json())
      .then((data) => setAllEquipment(data))
      .catch(() => setAllEquipment([]));
  }, []);

  return allEquipment;
};
