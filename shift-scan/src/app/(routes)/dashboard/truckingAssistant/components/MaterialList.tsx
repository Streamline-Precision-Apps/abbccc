"use client";
import {
  deleteHaulingLogs,
  updateHaulingLogs,
} from "@/actions/truckingActions";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Selects } from "@/components/(reusable)/selects";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import debounce from "lodash.debounce";
import SlidingDiv from "@/components/(animations)/slideDelete";

type Material = {
  name: string;
  id: string;
  LocationOfMaterial: string | null;
  truckingLogId: string;
  quantity: number | null;
  createdAt: Date;
};

export default function MaterialList({
  material,
  setMaterial,
  materialOptions,
  locationOptions,
}: {
  material: Material[] | undefined;
  setMaterial: Dispatch<SetStateAction<Material[] | undefined>>;
  locationOptions: {
    value: string;
    label: string;
  }[];
  materialOptions: {
    value: string;
    label: string;
  }[];
}) {
  // Local state to track changes
  const [editedMaterials, setEditedMaterials] = useState<Material[]>(
    material || []
  );

  // Update material state when prop changes
  useEffect(() => {
    setEditedMaterials(material || []);
  }, [material]);

  // Debounced server update function
  const updateHaulingLog = debounce(async (updatedMaterial: Material) => {
    const formData = new FormData();
    formData.append("id", updatedMaterial.id);
    formData.append("name", updatedMaterial.name || "");
    formData.append(
      "LocationOfMaterial",
      updatedMaterial.LocationOfMaterial || ""
    );
    formData.append("quantity", updatedMaterial.quantity?.toString() || "0");
    formData.append("truckingLogId", updatedMaterial.truckingLogId);

    await updateHaulingLogs(formData);
  }, 1000); // Debounce delay: 1 second

  // Handle Input Change
  const handleChange = (
    index: number,
    field: keyof Material,
    value: string | number
  ) => {
    const updatedMaterials = [...editedMaterials];
    if (updatedMaterials[index]) {
      updatedMaterials[index] = {
        ...updatedMaterials[index],
        [field]: value,
      };
      setEditedMaterials(updatedMaterials);

      // Trigger server action to update database
      updateHaulingLog(updatedMaterials[index]);
    }
  };

  // Handle Delete
  const handleDelete = async (materialId: string) => {
    // Optimistic Update: Remove from local state first
    const updatedMaterials = editedMaterials.filter(
      (material) => material.id !== materialId
    );
    setEditedMaterials(updatedMaterials);
    setMaterial(updatedMaterials); // Sync with parent state

    // Call server action to delete in database
    const isDeleted = await deleteHaulingLogs(materialId);

    // If deletion failed, revert the state change
    if (!isDeleted) {
      alert("Failed to delete. Please try again.");
      setEditedMaterials(updatedMaterials);
      setMaterial(updatedMaterials);
    }
  };

  return (
    <Contents className="overflow-y-auto no-scrollbar">
      {editedMaterials && editedMaterials.length > 0
        ? editedMaterials.map((mat, index) => (
            <SlidingDiv onSwipeLeft={() => handleDelete(mat.id)}>
              <Holds
                key={mat.id || index}
                position={"row"}
                background={"white"}
                className="w-full h-full border-black border-[3px] rounded-[10px] mb-3 "
              >
                <Holds background={"white"} className="w-2/5 px-2">
                  <Selects
                    value={mat.name || ""}
                    onChange={(e) =>
                      handleChange(index, "name", e.target.value)
                    }
                    className={"border-none text-xs py-2 focus:outline-none"}
                  >
                    <option
                      className="text-xs text-center text-app-light-gray"
                      value=""
                    >
                      Material
                    </option>
                    {materialOptions.map((option) => (
                      <option
                        className="text-xs"
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    ))}
                  </Selects>
                </Holds>

                <Holds
                  background={"white"}
                  className="w-2/5 h-full justify-center px-2 rounded-none border-black border-x-[3px]"
                >
                  <Selects
                    value={mat.LocationOfMaterial || ""}
                    onChange={(e) =>
                      handleChange(index, "LocationOfMaterial", e.target.value)
                    }
                    className="border-none text-xs focus:outline-none"
                  >
                    <option
                      value=""
                      className="text-xs text-center text-app-light-gray"
                    >
                      Location
                    </option>
                    {locationOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Selects>
                </Holds>

                <Holds background={"white"} className="w-1/5  ">
                  <Inputs
                    type="number"
                    placeholder="# Loads"
                    value={mat.quantity?.toString() || ""}
                    onChange={(e) =>
                      handleChange(
                        index,
                        "quantity",
                        parseInt(e.target.value, 10) || 0
                      )
                    }
                    className="border-none text-xs text-center h-full focus:outline-none "
                  />
                </Holds>
              </Holds>
            </SlidingDiv>
          ))
        : null}
    </Contents>
  );
}
