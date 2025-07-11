"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEquipmentDataById } from "./useEquipmentDataById";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { SquareCheck, SquareXIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";

type Equipment = {
  id: string;
  qrId: string;
  name: string;
  description?: string;
  equipmentTag: string;
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED" | "DRAFT";
  state: "AVAILABLE" | "IN_USE" | "MAINTENANCE" | "NEEDS_REPAIR" | "RETIRED";
  isDisabledByAdmin: boolean;
  overWeight: boolean;
  currentWeight: number | null;
  createdById: string;
  createdVia: string;
  updatedAt: Date;
  creationReason?: string;
  equipmentVehicleInfo?: {
    make: string | null;
    model: string | null;
    year: string | null;
    licensePlate: string | null;
    registrationExpiration: Date | null;
    mileage: number | null;
  };
};

export default function EditEquipmentModal({
  cancel,
  pendingEditId,
}: {
  cancel: () => void;
  pendingEditId: string;
}) {
  const { equipmentDetails, loading } = useEquipmentDataById(pendingEditId);
  const [formData, setFormData] = useState<Equipment | null>(null);
  const [originalForm, setOriginalForm] = useState<Equipment | null>(null);

  useEffect(() => {
    if (equipmentDetails) {
      setFormData(equipmentDetails);
      setOriginalForm(equipmentDetails);
    }
  }, [equipmentDetails]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            [name]:
              type === "number" ? (value === "" ? null : Number(value)) : value,
          }
        : prev
    );
  };

  const handleVehicleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => {
      if (!prev) return prev;
      const prevInfo = prev.equipmentVehicleInfo ?? {
        make: null,
        model: null,
        year: null,
        licensePlate: null,
        registrationExpiration: null,
        mileage: null,
      };
      return {
        ...prev,
        equipmentVehicleInfo: {
          ...prevInfo,
          [name]:
            type === "number" ? (value === "" ? null : Number(value)) : value,
        },
      };
    });
  };

  const hasVehicleInfo = !!formData?.equipmentVehicleInfo;

  const handleSaveChanges = () => {
    // TODO: Implement save logic using formData
  };

  if (loading || !formData || !originalForm) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-lg shadow-lg min-w-[500px] max-w-[90vw] max-h-[80vh] overflow-y-auto no-scrollbar p-8 flex flex-col items-center">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg min-w-[500px] max-w-[90vw] max-h-[80vh] overflow-y-auto no-scrollbar p-8 flex flex-col items-center">
        <div className="flex flex-col w-full ">
          <div className="flex flex-row mb-4">
            <p className="text-xs  text-gray-500">
              {`last updated at ${format(formData.updatedAt, "PPpp")}`}
            </p>
          </div>
          <div className="flex flex-row justify-between ">
            <div className="flex flex-col mb-4">
              <h2 className="text-lg font-semibold">{`Edit ${originalForm.name}`}</h2>
              <div>
                <p className="text-sm text-gray-600">
                  {`Created via: ${
                    formData.createdVia.toLowerCase() || "Admin"
                  } by ${formData.createdById || "System"}`}
                </p>
                <p className="text-xs text-gray-600">
                  {`Status: `}
                  <span
                    className={`text-sm ${
                      originalForm.approvalStatus === "APPROVED"
                        ? "text-green-600"
                        : originalForm.approvalStatus === "PENDING"
                        ? "text-sky-600"
                        : "text-red-600"
                    }`}
                  >
                    {originalForm.approvalStatus
                      .toLowerCase()
                      .slice(0, 1)
                      .toUpperCase() +
                      originalForm.approvalStatus.toLowerCase().slice(1)}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs text-gray-600">Disable in App</p>
              <div className="flex justify-end">
                <Switch
                  checked={formData.isDisabledByAdmin}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev!,
                      isDisabledByAdmin: checked,
                    }))
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 mb-4">
            {originalForm.approvalStatus === "PENDING" && (
              <div className="flex flex-col">
                <Label htmlFor="creationReason" className="text-sm">
                  Creation Reason
                </Label>
                <Textarea
                  name="creationReason"
                  value={formData.creationReason}
                  onChange={handleInputChange}
                  className="w-full text-xs"
                />
              </div>
            )}
            <div>
              <Label htmlFor="name" className="text-sm">
                Equipment Name
              </Label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full text-xs"
                required
              />
            </div>
            <div>
              <Label htmlFor="description" className="text-sm font-medium">
                Equipment Description
              </Label>
              <Textarea
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                className="w-full text-xs"
              />
            </div>
            <div>
              <Label htmlFor="currentWeight" className="text-sm">
                Overweight Equipment
              </Label>
              <Select
                name="overWeight"
                value={formData.overWeight ? "true" : "false"}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev!,
                    overWeight: value === "true",
                  }))
                }
              >
                <SelectTrigger className="w-full text-xs">
                  <SelectValue placeholder="Select Overweight Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="currentWeight" className="text-sm">
                Overweight amount (lbs)
              </Label>
              <Input
                type="number"
                name="currentWeight"
                value={formData.currentWeight ?? ""}
                onChange={handleInputChange}
                className="text-xs"
                required
                disabled={formData.overWeight === false}
              />
            </div>

            {/* Add more fields as needed */}
            {hasVehicleInfo && (
              <>
                <div>
                  <Label htmlFor="make" className="text-sm font-medium">
                    Vehicle Make
                  </Label>
                  <Input
                    type="text"
                    name="make"
                    value={formData.equipmentVehicleInfo?.make || ""}
                    onChange={handleVehicleInfoChange}
                    className="text-xs"
                  />
                </div>
                <div>
                  <Label htmlFor="model" className="text-sm font-medium">
                    Vehicle Model
                  </Label>
                  <Input
                    type="text"
                    name="model"
                    value={formData.equipmentVehicleInfo?.model || ""}
                    onChange={handleVehicleInfoChange}
                    className="text-xs"
                  />
                </div>
                <div>
                  <Label htmlFor="year" className="text-sm font-medium">
                    Vehicle Year
                  </Label>
                  <Input
                    type="text"
                    name="year"
                    value={formData.equipmentVehicleInfo?.year || ""}
                    onChange={handleVehicleInfoChange}
                    className="text-xs"
                  />
                </div>
              </>
            )}
          </div>
          <div className="flex flex-row justify-end gap-2 w-full">
            {originalForm && originalForm.approvalStatus === "PENDING" && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  className={`bg-red-200 hover:bg-red-300 text-red-800 px-4 py-2 rounded ${
                    formData.approvalStatus !== "REJECTED"
                      ? "bg-opacity-50 "
                      : " border-red-800 hover:border-red-900 border-2"
                  }`}
                  onClick={() =>
                    setFormData({ ...formData, approvalStatus: "REJECTED" })
                  }
                  disabled={loading}
                >
                  {formData.approvalStatus === "REJECTED" ? "" : "Deny"}
                  {formData.approvalStatus === "REJECTED" && (
                    <SquareXIcon className="text-red-800" />
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className={`bg-green-400 hover:bg-green-300 text-green-800 px-4 py-2 rounded ${
                    formData.approvalStatus !== "APPROVED"
                      ? "bg-opacity-50 "
                      : " border-green-800 hover:border-green-900 border-2"
                  }`}
                  onClick={() =>
                    setFormData({ ...formData, approvalStatus: "APPROVED" })
                  }
                  disabled={loading}
                >
                  <div className="flex flex-row items-center gap-2">
                    {formData.approvalStatus === "APPROVED" ? `` : "Approve"}
                    {formData.approvalStatus === "APPROVED" && (
                      <SquareCheck className="text-green-800" />
                    )}
                  </div>
                </Button>
              </>
            )}
            <Button
              variant="outline"
              onClick={cancel}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={handleSaveChanges}
              className={`bg-sky-500 hover:bg-sky-400 text-white px-4 py-2 rounded ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Save Changes
            </Button>
          </div>
          <div className="flex flex-row justify-end mt-4">
            <p className="text-xs  text-gray-500">
              {`Marked as ${
                formData.approvalStatus
                  .toLowerCase()
                  .slice(0, 1)
                  .toUpperCase() +
                formData.approvalStatus.toLowerCase().slice(1)
              } save changes to update the status.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
