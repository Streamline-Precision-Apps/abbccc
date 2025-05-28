export type Equipment = {
  id: string;
  qrId: string;
  name: string;
  description?: string;
  equipmentTag: string;
  status?: string;
  isActive: boolean;
  inUse: boolean;
  overWeight: boolean;
  currentWeight: number;
  equipmentVehicleInfo?: {
    make: string | null;
    model: string | null;
    year: string | null;
    licensePlate: string | null;
    registrationExpiration: Date | null;
    mileage: number | null;
  };
};
