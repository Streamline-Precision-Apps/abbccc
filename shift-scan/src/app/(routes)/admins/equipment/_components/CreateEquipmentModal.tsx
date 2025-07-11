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
import { useState } from "react";
import { registerEquipment } from "@/actions/AssetActions";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

export default function CreateEquipmentModal({
  cancel,
  rerender,
}: {
  cancel: () => void;
  rerender: () => void;
}) {
  const { data: session } = useSession();
  if (!session) {
    toast.error("You must be logged in to create equipment.");
    return null;
  }

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    equipmentTag: "",
    status: "APPROVED",
    IsActive: true,
    inUse: false,
    overWeight: null,
    currentWeight: null,
    equipmentVehicleInfo: {
      make: "",
      model: "",
      year: "",
      licensePlate: "",
      registrationExpiration: null,
      mileage: null,
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? null : Number(value)) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "overWeight"
          ? value === "true"
            ? true
            : value === "false"
            ? false
            : null
          : value,
    }));
  };

  const handleVehicleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      equipmentVehicleInfo: {
        ...prev.equipmentVehicleInfo,
        [name]:
          type === "number" ? (value === "" ? null : Number(value)) : value,
      },
    }));
  };

  const hasVehicleInfo =
    formData.equipmentTag === "TRUCK" ||
    formData.equipmentTag === "VEHICLE" ||
    formData.equipmentTag === "TRAILER";

  const [submitting, setSubmitting] = useState(false);

  const handleCreateEquipment = async () => {
    setSubmitting(true);
    try {
      // Basic validation
      if (!formData.name.trim()) {
        toast.error("Equipment name is required");
        setSubmitting(false);
        return;
      }
      if (!formData.equipmentTag) {
        toast.error("Equipment type is required");
        setSubmitting(false);
        return;
      }
      // Prepare payload
      const payload = {
        name: formData.name.trim(),
        description: formData.description?.trim() || "",
        equipmentTag: formData.equipmentTag,
        overWeight: formData.overWeight,
        currentWeight: formData.currentWeight,
        equipmentVehicleInfo: hasVehicleInfo
          ? {
              make: formData.equipmentVehicleInfo?.make || null,
              model: formData.equipmentVehicleInfo?.model || null,
              year: formData.equipmentVehicleInfo?.year || null,
              licensePlate: formData.equipmentVehicleInfo?.licensePlate || null,
              registrationExpiration: formData.equipmentVehicleInfo
                ?.registrationExpiration
                ? new Date(formData.equipmentVehicleInfo.registrationExpiration)
                : null,
              mileage: formData.equipmentVehicleInfo?.mileage ?? null,
            }
          : undefined,
      };
      const createdById = session.user.id;
      const result = await registerEquipment(payload, createdById);
      if (result.success) {
        toast.success("Equipment created successfully!");
        rerender();
        cancel();
      } else {
        toast.error(result.error || "Failed to create equipment");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to create equipment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-[600px] max-h-[80vh] overflow-y-auto no-scrollbar p-8 flex flex-col items-center">
        <div className="flex flex-col gap-4 w-full">
          <div>
            <h2 className="text-lg font-semibold">Create Equipment</h2>
            <p className="text-sm text-gray-600">
              Fill in the details to create new equipment.
            </p>
          </div>
          <div>
            <div className="flex flex-col gap-4">
              <div>
                <Label htmlFor="name" className={`text-sm `}>
                  Equipment Name <span className="text-red-500">*</span>
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
                  name="description" // Corresponds to formData key
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full text-xs min-h-[96px]"
                  placeholder="Enter equipment description..."
                  style={{ resize: "none" }}
                />
              </div>

              <div>
                <Label htmlFor="currentWeight" className={`text-sm `}>
                  {`Current Weight (lbs)`}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  name="currentWeight" // Corresponds to formData key
                  onChange={handleInputChange}
                  value={
                    formData.currentWeight === null
                      ? ""
                      : formData.currentWeight
                  } // Handle null value for input
                  placeholder="0"
                  className="text-xs"
                  required
                />
              </div>
              <div>
                <Label htmlFor="overWeight" className={`text-sm `}>
                  Overweight Equipment
                </Label>
                <Select
                  onValueChange={(value) =>
                    handleSelectChange("overWeight", value)
                  }
                  name="overWeight" // Corresponds to formData key
                  value={
                    formData.overWeight === true
                      ? "true"
                      : formData.overWeight === false
                      ? "false"
                      : ""
                  }
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue placeholder="Select Weight Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label
                  htmlFor="equipmentTag"
                  className={`text-sm font-medium `}
                >
                  Equipment Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  name="equipmentTag" // Corresponds to formData key
                  value={formData.equipmentTag}
                  onValueChange={(value) =>
                    handleSelectChange("equipmentTag", value)
                  }
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue placeholder="Select Equipment Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TRUCK">Truck</SelectItem>
                    <SelectItem value="TRAILER">Trailer</SelectItem>
                    <SelectItem value="VEHICLE">Vehicle</SelectItem>
                    <SelectItem value="EQUIPMENT">Equipment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Conditional rendering for vehicle specific fields */}
              {hasVehicleInfo && formData.equipmentVehicleInfo && (
                <>
                  <div>
                    <Label htmlFor="make" className={`text-sm font-medium `}>
                      Vehicle Make <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      name="make" // Corresponds to equipmentVehicleInfo key
                      value={formData.equipmentVehicleInfo?.make || ""}
                      onChange={handleVehicleInfoChange}
                      placeholder="Make"
                      className="text-xs"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="model" className={`text-sm font-medium`}>
                      Vehicle Model <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      name="model" // Corresponds to equipmentVehicleInfo key
                      value={formData.equipmentVehicleInfo?.model || ""}
                      onChange={handleVehicleInfoChange}
                      placeholder="Model"
                      className="text-xs"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="year" className={`text-sm font-medium `}>
                      Vehicle Year <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="text" // Changed to text to allow YYYY, can also be number
                      inputMode="numeric"
                      pattern="[0-9]{4}"
                      maxLength={4}
                      name="year" // Corresponds to equipmentVehicleInfo key
                      value={formData.equipmentVehicleInfo?.year || ""}
                      onChange={handleVehicleInfoChange}
                      placeholder="YYYY"
                      className="text-xs"
                      required
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="licensePlate"
                      className={`text-sm font-medium `}
                    >
                      License Plate <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      name="licensePlate" // Corresponds to equipmentVehicleInfo key
                      value={formData.equipmentVehicleInfo?.licensePlate || ""}
                      onChange={handleVehicleInfoChange}
                      placeholder="License Plate"
                      className="text-xs"
                      required
                    />
                  </div>

                  {/* DatePicker for registrationExpiration - Assuming you have a DatePicker component */}
                  <div>
                    <Label
                      htmlFor="registrationExpiration"
                      className={`text-sm `}
                    >
                      Registration Expiration{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    {/* Replace with your actual DatePicker component */}
                    <Input // Placeholder for DatePicker
                      type="date"
                      name="registrationExpiration"
                      value={
                        formData.equipmentVehicleInfo?.registrationExpiration
                          ? new Date(
                              formData.equipmentVehicleInfo.registrationExpiration
                            )
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      onChange={handleVehicleInfoChange}
                      className="w-full text-xs"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="mileage" className={`text-sm `}>
                      Vehicle Mileage <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="number"
                      name="mileage" // Corresponds to equipmentVehicleInfo key
                      value={
                        formData.equipmentVehicleInfo?.mileage === null
                          ? ""
                          : formData.equipmentVehicleInfo?.mileage
                      }
                      onChange={handleVehicleInfoChange}
                      placeholder="Mileage"
                      className="text-xs"
                      required
                    />
                  </div>
                </>
              )}
            </div>
            <div className="flex flex-col p-1 mt-3">
              <p className="text-base font-medium">
                Safety Documents and Policies
              </p>
              <p className="text-sm text-slate-500">Coming Soon!</p>
            </div>
          </div>
          <div className="flex flex-row justify-end gap-2 w-full">
            <Button
              variant="outline"
              className="bg-emerald-400 text-white"
              onClick={handleCreateEquipment}
              disabled={submitting}
            >
              {submitting ? "Creating..." : "Create Equipment"}
            </Button>

            <Button
              variant="outline"
              onClick={cancel}
              className="bg-red-400 text-white "
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
