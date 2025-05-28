import { EditableFields } from "@/components/(reusable)/EditableField";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { useState, useEffect } from "react";
import EquipmentRegistrationForm from "../forms/EquipmentRegistrationForm";
import {
  updateEquipmentAsset,
  registerEquipment,
} from "@/actions/AssetActions";
import Spinner from "@/components/(animations)/spinner";
import { useSession } from "next-auth/react";

type Equipment = {
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
export default function EquipmentMainContent({
  assets,
  selectEquipment,
  isRegistrationFormOpen,
  setIsRegistrationFormOpen,
  setSelectEquipment,
}: {
  assets: string;
  selectEquipment: Equipment | null;
  isRegistrationFormOpen: boolean;
  setIsRegistrationFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectEquipment: React.Dispatch<React.SetStateAction<Equipment | null>>;
}) {
  // State for form data and tracking changes
  const [formData, setFormData] = useState<Equipment | null>(null);
  const [changedFields, setChangedFields] = useState<Set<string>>(new Set());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successfullyUpdated, SetSuccessfullyUpdated] = useState(false);

  // Get user session for equipment registration
  const { data: session } = useSession();

  // Initialize form data when selectEquipment changes
  useEffect(() => {
    if (selectEquipment) {
      setFormData({ ...selectEquipment });
      setChangedFields(new Set());
      setHasUnsavedChanges(false);
    }
  }, [selectEquipment]);

  // Generic handler for input changes
  const handleInputChange = (
    fieldName: string,
    value: string | number | boolean | Date
  ) => {
    if (!formData || !selectEquipment) return;

    setFormData((prev) => {
      if (!prev) return prev;

      // Handle nested vehicle info fields
      if (fieldName.startsWith("vehicle.")) {
        const vehicleField = fieldName.replace("vehicle.", "");
        return {
          ...prev,
          equipmentVehicleInfo: {
            make: null,
            model: null,
            year: null,
            licensePlate: null,
            registrationExpiration: null,
            mileage: null,
            ...prev.equipmentVehicleInfo,
            [vehicleField]: value,
          },
        };
      }

      return { ...prev, [fieldName]: value };
    });

    // Track which fields have changed
    const newChangedFields = new Set(changedFields);

    // Check if the value is different from original
    let originalValue;
    if (fieldName.startsWith("vehicle.")) {
      const vehicleField = fieldName.replace("vehicle.", "");
      originalValue =
        selectEquipment.equipmentVehicleInfo?.[
          vehicleField as keyof typeof selectEquipment.equipmentVehicleInfo
        ];
    } else {
      originalValue = selectEquipment[fieldName as keyof Equipment];
    }

    if (value !== originalValue) {
      newChangedFields.add(fieldName);
    } else {
      newChangedFields.delete(fieldName);
    }

    setChangedFields(newChangedFields);
    setHasUnsavedChanges(newChangedFields.size > 0);
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    if (!formData || !hasUnsavedChanges || isSaving) return;

    setIsSaving(true); // Start the save operation

    try {
      // Create FormData for the server action
      const formDataToSend = new FormData();
      formDataToSend.append("id", formData.id);
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description || "");
      formDataToSend.append("equipmentTag", formData.equipmentTag);
      formDataToSend.append("status", formData.status || "");
      formDataToSend.append("currentWeight", formData.currentWeight.toString());
      formDataToSend.append("overWeight", formData.overWeight.toString());

      // Add vehicle information if it exists
      if (formData.equipmentVehicleInfo) {
        const vehicleInfo = formData.equipmentVehicleInfo;
        formDataToSend.append("make", vehicleInfo.make || "");
        formDataToSend.append("model", vehicleInfo.model || "");
        formDataToSend.append("year", vehicleInfo.year || "");
        formDataToSend.append("licensePlate", vehicleInfo.licensePlate || "");
        formDataToSend.append(
          "mileage",
          vehicleInfo.mileage?.toString() || "0"
        );

        if (vehicleInfo.registrationExpiration) {
          // Handle both Date objects and date strings
          const dateValue =
            vehicleInfo.registrationExpiration instanceof Date
              ? vehicleInfo.registrationExpiration.toISOString().split("T")[0]
              : String(vehicleInfo.registrationExpiration);
          formDataToSend.append("registrationExpiration", dateValue);
        }
      }

      const result = await updateEquipmentAsset(formDataToSend);

      console.log("Equipment saved successfully:", result);

      // Reset change tracking after successful save
      setChangedFields(new Set());
      setHasUnsavedChanges(false);

      // Update the selectEquipment with the saved data from the server
      if (result.data) {
        // Map the server response to match the Equipment type
        const updatedEquipment: Equipment = {
          id: result.data.id,
          qrId: result.data.qrId || "",
          name: result.data.name,
          description: result.data.description || "",
          equipmentTag: result.data.equipmentTag,
          status: result.data.status || "",
          isActive: result.data.isActive ?? true,
          inUse: result.data.inUse ?? false,
          overWeight: result.data.overWeight ?? false,
          currentWeight: result.data.currentWeight ?? 0,
          equipmentVehicleInfo: result.data.equipmentVehicleInfo || undefined,
        };
        setSelectEquipment(updatedEquipment);
      } else {
        setSelectEquipment({ ...formData });
      }

      SetSuccessfullyUpdated(true); // Indicate successful update

      setTimeout(() => {
        SetSuccessfullyUpdated(false);
      }, 3000); // Hide success message after 3 seconds
    } catch (error) {
      console.error("Error saving equipment:", error);
      // Show error message to user
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      alert(`Failed to save equipment: ${errorMessage}`);
    } finally {
      setIsSaving(false); // End the save operation
    }
  };

  // Handle discard changes
  const handleDiscardChanges = () => {
    if (selectEquipment) {
      if (
        hasUnsavedChanges &&
        !confirm(
          "Are you sure you want to discard all changes? This action cannot be undone."
        )
      ) {
        return;
      }
      setFormData({ ...selectEquipment });
      setChangedFields(new Set());
      setHasUnsavedChanges(false);
    }
  };

  // Handle new equipment registration
  const handleNewEquipmentSubmit = async (newEquipment: {
    name: string;
    description?: string;
    equipmentTag: string;
    status?: string;
    isActive: boolean;
    inUse: boolean;
    overWeight: boolean | null;
    currentWeight: number;
    equipmentVehicleInfo?: {
      make: string | null;
      model: string | null;
      year: string | null;
      licensePlate: string | null;
      registrationExpiration: Date | null;
      mileage: number | null;
    };
  }) => {
    if (!session?.user?.id) {
      console.error("User session not found");
      alert("Please log in to register equipment.");
      return;
    }

    try {
      setIsSaving(true);

      const result = await registerEquipment(newEquipment, session.user.id);

      if (result.success) {
        console.log("Equipment registered successfully:", result.data);

        // Close the registration form
        setIsRegistrationFormOpen(false);

        // Set the newly created equipment as selected
        if (result.data) {
          // Convert the database result to match the Equipment type
          const equipmentToSelect: Equipment = {
            id: result.data.id,
            qrId: result.data.qrId,
            name: result.data.name,
            description: result.data.description,
            equipmentTag: result.data.equipmentTag,
            status: result.data.status,
            isActive: result.data.isActive,
            inUse: result.data.inUse,
            overWeight: result.data.overWeight || false,
            currentWeight: result.data.currentWeight || 0,
            equipmentVehicleInfo:
              (
                result.data as unknown as {
                  equipmentVehicleInfo?: Equipment["equipmentVehicleInfo"];
                }
              ).equipmentVehicleInfo || undefined,
          };
          setSelectEquipment(equipmentToSelect);
        }

        // Show success message
        SetSuccessfullyUpdated(true);
        setTimeout(() => {
          SetSuccessfullyUpdated(false);
        }, 3000);
      } else {
        console.error("Equipment registration failed:", result.error);
        alert(`Failed to register equipment: ${result.error}`);
      }
    } catch (error) {
      console.error("Error creating equipment:", error);
      alert("An unexpected error occurred while registering the equipment.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle revert individual field change
  const handleRevertField = (fieldName: string) => {
    if (!selectEquipment || !formData) return;

    setFormData((prev) => {
      if (!prev) return prev;

      // Handle nested vehicle info fields
      if (fieldName.startsWith("vehicle.")) {
        const vehicleField = fieldName.replace("vehicle.", "");
        const originalVehicleValue =
          selectEquipment.equipmentVehicleInfo?.[
            vehicleField as keyof typeof selectEquipment.equipmentVehicleInfo
          ];

        return {
          ...prev,
          equipmentVehicleInfo: {
            make: null,
            model: null,
            year: null,
            licensePlate: null,
            registrationExpiration: null,
            mileage: null,
            ...prev.equipmentVehicleInfo,
            [vehicleField]: originalVehicleValue,
          },
        };
      }

      // Handle regular fields
      const originalValue = selectEquipment[fieldName as keyof Equipment];
      return { ...prev, [fieldName]: originalValue };
    });

    // Remove from changed fields
    const newChangedFields = new Set(changedFields);
    newChangedFields.delete(fieldName);
    setChangedFields(newChangedFields);
    setHasUnsavedChanges(newChangedFields.size > 0);
  };

  return (
    <>
      {!selectEquipment && isRegistrationFormOpen === false ? (
        <Holds className="w-full h-full col-span-8">
          <Grids className="w-full h-full grid-rows-[40px_1fr] gap-4">
            <Holds
              background={"white"}
              position={"row"}
              className="w-full h-full rounded-[10px] justify-between px-4 "
            >
              <Texts
                position={"left"}
                size={"sm"}
                text={"link"}
                className="cursor-pointer"
                onClick={() => setIsRegistrationFormOpen(true)}
              >
                Register New Equipment
              </Texts>
            </Holds>
          </Grids>
        </Holds>
      ) : selectEquipment && isRegistrationFormOpen === false ? (
        <Holds className="w-full h-full col-span-4">
          <Grids className="w-full h-full grid-rows-[40px_1fr] gap-4">
            <Holds
              background={"white"}
              position={"row"}
              className="w-full h-full rounded-[10px] justify-between px-4 relative "
            >
              <Holds className="w-full h-full flex justify-center">
                <Texts
                  position={"left"}
                  size={"sm"}
                  text={"link"}
                  className={`cursor-pointer ${
                    hasUnsavedChanges
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:underline"
                  }`}
                  onClick={
                    hasUnsavedChanges
                      ? undefined
                      : () => {
                          setIsRegistrationFormOpen(true);
                          setSelectEquipment(null);
                        }
                  }
                >
                  Register New Equipment
                </Texts>
              </Holds>
              <Holds
                position={"row"}
                className="h-full flex items-center justify-between"
              >
                <Texts
                  size={"sm"}
                  text={"link"}
                  className={`cursor-pointer ${
                    !hasUnsavedChanges
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:underline"
                  }`}
                  onClick={hasUnsavedChanges ? handleDiscardChanges : undefined}
                >
                  Discard All Changes{" "}
                  {hasUnsavedChanges && `(${changedFields.size})`}
                </Texts>
                <Texts
                  size={"sm"}
                  text={"link"}
                  className={`cursor-pointer ${
                    !hasUnsavedChanges || isSaving
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:underline font-semibold"
                  }`}
                  onClick={
                    hasUnsavedChanges && !isSaving
                      ? handleSaveChanges
                      : undefined
                  }
                >
                  {isSaving ? "Saving..." : "Save changes"}
                </Texts>
              </Holds>
              {successfullyUpdated && (
                <Holds
                  background={"green"}
                  className="w-full h-full absolute left-0 top-0 z-50 rounded-[10px] flex items-center justify-center"
                >
                  <Texts size={"sm"} className="text-center">
                    Successfully Updated Equipment!
                  </Texts>
                </Holds>
              )}
            </Holds>

            <Holds
              background={"white"}
              className="w-full h-full rounded-[10px] p-3 px-5 relative"
            >
              {/* Loading overlay - only show when saving */}
              {isSaving && (
                <Holds className="w-full h-full justify-center items-center absolute left-0 top-0 z-50 bg-white bg-opacity-80 rounded-[10px]">
                  <Spinner size={80} />
                </Holds>
              )}
              <Grids className="w-full h-full grid-rows-[50px_1fr]">
                <Holds position={"row"} className="w-full h-full ">
                  <Titles position={"left"} size={"xl"} className="font-bold">
                    {formData?.name || selectEquipment.name}
                  </Titles>
                  {/*Todo: add qr code here */}
                </Holds>
                <Holds className="w-full h-full">
                  <Grids className="w-full h-full grid-cols-[1fr_1fr] gap-4">
                    <Holds className="w-full h-full col-span-1 overflow-y-scroll no-scrollbar">
                      <Holds>
                        <label htmlFor="EquipmentName" className="text-sm">
                          Equipment Name
                        </label>
                        <EditableFields
                          type="text"
                          name="EquipmentName"
                          value={formData?.name || ""}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          isChanged={changedFields.has("name")}
                          onRevert={() => handleRevertField("name")}
                          variant={
                            changedFields.has("name") ? "edited" : "default"
                          }
                          size="sm"
                          disable={isSaving}
                        />
                        <label htmlFor="EquipmentCode" className="text-sm">
                          Equipment Code
                        </label>
                        <EditableFields
                          type="text"
                          name="EquipmentCode"
                          value={formData?.qrId || ""}
                          isChanged={false}
                          readonly={true}
                          disable={true}
                          variant="default"
                          size="sm"
                        />
                        <label htmlFor="EquipmentStatus" className="text-sm">
                          Equipment Status
                        </label>
                        <EditableFields
                          formDatatype="select"
                          name="EquipmentStatus"
                          value={formData?.status || ""}
                          onChange={(e) =>
                            handleInputChange("status", e.target.value)
                          }
                          isChanged={changedFields.has("status")}
                          onRevert={() => handleRevertField("status")}
                          variant={
                            changedFields.has("status") ? "edited" : "default"
                          }
                          size="sm"
                          options={[
                            { label: "Operational", value: "OPERATIONAL" },
                            { label: "Needs Repair", value: "NEEDS_REPAIR" },
                            {
                              label: "Needs Maintenance",
                              value: "NEEDS_MAINTENANCE",
                            },
                          ]}
                        />
                        <label htmlFor="CurrentWeight" className="text-sm">
                          Current Weight
                        </label>
                        <EditableFields
                          type="number"
                          name="CurrentWeight"
                          value={formData?.currentWeight?.toString() || "0"}
                          onChange={(e) =>
                            handleInputChange(
                              "currentWeight",
                              Number(e.target.value)
                            )
                          }
                          isChanged={changedFields.has("currentWeight")}
                          onRevert={() => handleRevertField("currentWeight")}
                          variant={
                            changedFields.has("currentWeight")
                              ? "edited"
                              : "default"
                          }
                          size="sm"
                        />
                        <label
                          htmlFor="OverweightEquipment"
                          className="text-sm"
                        >
                          Overweight Equipment
                        </label>
                        <EditableFields
                          formDatatype="select"
                          name="OverweightEquipment"
                          value={formData?.overWeight ? "true" : "false"}
                          onChange={(e) =>
                            handleInputChange(
                              "overWeight",
                              e.target.value === "true"
                            )
                          }
                          isChanged={changedFields.has("overWeight")}
                          onRevert={() => handleRevertField("overWeight")}
                          variant={
                            changedFields.has("overWeight")
                              ? "edited"
                              : "default"
                          }
                          size="sm"
                          options={[
                            { label: "True", value: "true" },
                            { label: "False", value: "false" },
                          ]}
                        />
                        <label htmlFor="EquipmentTag" className="text-sm">
                          Equipment Tag
                        </label>
                        <EditableFields
                          type="text"
                          name="EquipmentTag"
                          value={formData?.equipmentTag || ""}
                          onChange={(e) =>
                            handleInputChange("equipmentTag", e.target.value)
                          }
                          isChanged={changedFields.has("equipmentTag")}
                          onRevert={() => handleRevertField("equipmentTag")}
                          variant={
                            changedFields.has("equipmentTag")
                              ? "edited"
                              : "default"
                          }
                          size="sm"
                        />

                        {selectEquipment.equipmentVehicleInfo && (
                          <>
                            <label htmlFor="VehicleMake" className="text-sm">
                              Vehicle Make
                            </label>
                            <EditableFields
                              type="text"
                              name="VehicleMake"
                              value={formData?.equipmentVehicleInfo?.make || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  "vehicle.make",
                                  e.target.value
                                )
                              }
                              isChanged={changedFields.has("vehicle.make")}
                              onRevert={() => handleRevertField("vehicle.make")}
                              variant={
                                changedFields.has("vehicle.make")
                                  ? "edited"
                                  : "default"
                              }
                              size="sm"
                            />
                            <label htmlFor="VehicleModel" className="text-sm">
                              Vehicle Model
                            </label>
                            <EditableFields
                              type="text"
                              name="VehicleModel"
                              value={
                                formData?.equipmentVehicleInfo?.model || ""
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  "vehicle.model",
                                  e.target.value
                                )
                              }
                              isChanged={changedFields.has("vehicle.model")}
                              onRevert={() =>
                                handleRevertField("vehicle.model")
                              }
                              variant={
                                changedFields.has("vehicle.model")
                                  ? "edited"
                                  : "default"
                              }
                              size="sm"
                            />
                            <label htmlFor="VehicleYear" className="text-sm">
                              Vehicle Year
                            </label>
                            <EditableFields
                              type="text"
                              name="VehicleYear"
                              value={formData?.equipmentVehicleInfo?.year || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  "vehicle.year",
                                  e.target.value
                                )
                              }
                              isChanged={changedFields.has("vehicle.year")}
                              onRevert={() => handleRevertField("vehicle.year")}
                              variant={
                                changedFields.has("vehicle.year")
                                  ? "edited"
                                  : "default"
                              }
                              size="sm"
                              placeholder="YYYY"
                              pattern="[0-9]{4}"
                              maxLength={4}
                            />
                            <label
                              htmlFor="VehicleLicensePlate"
                              className="text-sm"
                            >
                              License Plate
                            </label>
                            <EditableFields
                              type="text"
                              name="VehicleLicensePlate"
                              value={
                                formData?.equipmentVehicleInfo?.licensePlate ||
                                ""
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  "vehicle.licensePlate",
                                  e.target.value
                                )
                              }
                              isChanged={changedFields.has(
                                "vehicle.licensePlate"
                              )}
                              onRevert={() =>
                                handleRevertField("vehicle.licensePlate")
                              }
                              variant={
                                changedFields.has("vehicle.licensePlate")
                                  ? "edited"
                                  : "default"
                              }
                              size="sm"
                            />
                            <label
                              htmlFor="VehicleRegistration"
                              className="text-sm"
                            >
                              Registration Expiration
                            </label>
                            <EditableFields
                              type="date"
                              name="VehicleRegistration"
                              value={
                                formData?.equipmentVehicleInfo
                                  ?.registrationExpiration
                                  ? new Date(
                                      formData.equipmentVehicleInfo.registrationExpiration
                                    )
                                      .toISOString()
                                      .split("T")[0]
                                  : ""
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  "vehicle.registrationExpiration",
                                  new Date(e.target.value)
                                )
                              }
                              isChanged={changedFields.has(
                                "vehicle.registrationExpiration"
                              )}
                              onRevert={() =>
                                handleRevertField(
                                  "vehicle.registrationExpiration"
                                )
                              }
                              variant={
                                changedFields.has(
                                  "vehicle.registrationExpiration"
                                )
                                  ? "edited"
                                  : "default"
                              }
                              size="sm"
                            />
                            <label htmlFor="VehicleMileage" className="text-sm">
                              Vehicle Mileage
                            </label>
                            <EditableFields
                              type="number"
                              name="VehicleMileage"
                              value={
                                formData?.equipmentVehicleInfo?.mileage?.toString() ||
                                ""
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  "vehicle.mileage",
                                  Number(e.target.value)
                                )
                              }
                              isChanged={changedFields.has("vehicle.mileage")}
                              onRevert={() =>
                                handleRevertField("vehicle.mileage")
                              }
                              variant={
                                changedFields.has("vehicle.mileage")
                                  ? "edited"
                                  : "default"
                              }
                              size="sm"
                            />
                          </>
                        )}
                      </Holds>
                    </Holds>
                    <Holds className="w-full h-full">
                      <Grids className="w-full h-full grid-rows-[135px_1fr] gap-4">
                        <Holds className="w-full h-full">
                          <label
                            htmlFor="EquipmentDescription"
                            className="text-base"
                          >
                            Equipment Description
                          </label>
                          <EditableFields
                            formDatatype="textarea"
                            name="EquipmentDescription"
                            value={formData?.description || ""}
                            onChange={(e) =>
                              handleInputChange("description", e.target.value)
                            }
                            isChanged={changedFields.has("description")}
                            onRevert={() => handleRevertField("description")}
                            variant={
                              changedFields.has("description")
                                ? "edited"
                                : "default"
                            }
                            size="sm"
                            rows={4}
                            placeholder="Enter equipment description..."
                          />
                        </Holds>
                        <Holds className="w-full h-full">
                          <label htmlFor="EquipmentTag" className="text-base">
                            Safety Documents & Policies
                          </label>
                          <Holds className="w-full h-full border-[3px] border-black rounded-[10px]"></Holds>
                        </Holds>
                      </Grids>
                    </Holds>
                  </Grids>
                </Holds>
              </Grids>
            </Holds>
          </Grids>
        </Holds>
      ) : (
        !selectEquipment &&
        isRegistrationFormOpen === true && (
          <Holds className="w-full h-full col-span-4">
            <Grids className="w-full h-full grid-rows-[40px_1fr] gap-4">
              <Holds
                background={"white"}
                position={"row"}
                className="w-full h-full rounded-[10px] justify-between px-4 "
              >
                <Holds className="w-full h-full flex justify-center">
                  <Texts
                    position={"left"}
                    size={"sm"}
                    text={"link"}
                    className="cursor-pointer"
                    onClick={() => {
                      setIsRegistrationFormOpen(false);
                    }}
                  >
                    Submit New Equipment
                  </Texts>
                </Holds>
                <Holds className="h-full flex justify-center ">
                  <Texts
                    position={"right"}
                    size={"sm"}
                    text={"link"}
                    className="cursor-pointer"
                    onClick={() => {
                      setIsRegistrationFormOpen(false);
                    }}
                  >
                    Cancel Registration
                  </Texts>
                </Holds>
              </Holds>

              <Holds
                background={"white"}
                className="w-full h-full rounded-[10px] p-3"
              >
                <Grids className="w-full h-full grid-rows-[50px_1fr]">
                  <Holds>
                    <Titles position={"left"} size={"xl"} className="font-bold">
                      New Equipment
                    </Titles>
                  </Holds>
                  <Holds className="w-full h-full">
                    <EquipmentRegistrationForm
                      onSubmit={handleNewEquipmentSubmit}
                      onCancel={() => setIsRegistrationFormOpen(false)}
                    />
                  </Holds>
                </Grids>
              </Holds>
            </Grids>
          </Holds>
        )
      )}
    </>
  );
}
