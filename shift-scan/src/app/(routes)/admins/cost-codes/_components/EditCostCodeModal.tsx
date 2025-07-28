"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { updateCostCodeAdmin } from "@/actions/AssetActions";
import { toast } from "sonner";
import { Combobox } from "@/components/ui/combobox";
import { Switch } from "@/components/ui/switch";
import { CostCode, useCostCodeDataById } from "./useCostCodeDataById";
import { format } from "date-fns";

export default function EditCostCodeModal({
  cancel,
  pendingEditId,
  rerender,
}: {
  cancel: () => void;
  pendingEditId: string;
  rerender: () => void;
}) {
  const { costCodeDetails, tagSummaries, loading } =
    useCostCodeDataById(pendingEditId);
  const [formData, setFormData] = useState<CostCode>();
  const [originalForm, setOriginalForm] = useState<CostCode | null>(null);

  useEffect(() => {
    if (costCodeDetails) {
      setFormData(costCodeDetails);
      setOriginalForm(costCodeDetails);
    }
  }, [costCodeDetails]);

  const handleSaveChanges = async () => {
    if (!formData) {
      toast.error("No form data to save.");
      return;
    }
    try {
      const fd = new FormData();
      fd.append("id", formData.id);
      fd.append("code", formData.code);
      fd.append("name", formData.name);
      fd.append("isActive", String(formData.isActive));
      fd.append("CCTags", JSON.stringify(formData.CCTags.map((tag) => tag.id)));

      const result = await updateCostCodeAdmin(fd);

      if (result?.success) {
        toast.success("CostCode updated successfully.");
        cancel();
        rerender();
      } else {
        throw new Error(result?.message || "Failed to update CostCode.");
      }
    } catch (err) {
      toast.error("Error updating CostCode. Please try again.");
      console.error(err);
    }
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

  const getCode = () => formData.name.split(" ")[0] || "";
  const getName = () => formData.name.split(" ").slice(1).join(" ") || "";

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCode = e.target.value;
    const currentName = getName();
    setFormData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        name: `${newCode} ${currentName}`.trim(),
      };
    });
    setFormData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        code: newCode.split("#")[1] || "",
      };
    });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    const currentCode = getCode();
    setFormData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        name: `${currentCode} ${newName}`.trim(),
      };
    });
  };

  const safeTagSummaries = Array.isArray(tagSummaries) ? tagSummaries : [];
  // Merge all tags, ensuring no duplicates
  const allTags = [
    ...safeTagSummaries,
    ...formData.CCTags.filter(
      (tag) => !safeTagSummaries.some((t) => t.id === tag.id)
    ),
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg min-w-[500px] max-w-[90vw] max-h-[80vh] overflow-y-auto no-scrollbar p-8 flex flex-col items-center">
        <div className="flex flex-col w-full ">
          <div className="flex flex-row justify-between mb-4">
            <p className="text-xs  text-gray-500">
              {`last updated at ${format(formData.updatedAt, "PPpp")}`}
            </p>
            <div className="flex items-center gap-4">
              <Label className="ml-2">
                {formData.isActive ? "Active" : "Inactive"}
              </Label>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(value) => {
                  setFormData((prev) => {
                    if (!prev) return prev;
                    return { ...prev, isActive: value };
                  });
                }}
              />
            </div>
          </div>
          <div className="flex flex-row justify-between ">
            <div className="flex flex-col mb-4">
              <h2 className="text-lg font-semibold">{`Edit ${originalForm.name}`}</h2>
              <div>
                <p className="text-sm text-gray-600">
                  {`Created via: Admin created by System`}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 mb-4">
            <div>
              <Label htmlFor="code" className="text-sm">
                Code
              </Label>
              <Input
                type="text"
                name="code"
                value={getCode()}
                onChange={handleCodeChange}
                className="w-full text-xs"
                required
              />
            </div>

            <div>
              <Label htmlFor="name" className="text-sm">
                Name
              </Label>
              <Input
                type="text"
                name="name"
                value={getName()}
                onChange={handleNameChange}
                className="w-full text-xs"
                required
              />
            </div>
            {tagSummaries && (
              <div className="my-4 border-t border-gray-200 pt-4">
                <Combobox
                  label={`Tags (Optional)`}
                  options={
                    allTags
                      ? allTags.map((tag) => ({
                          label: tag.name,
                          value: tag.id,
                        }))
                      : []
                  }
                  // name prop removed, not supported by ComboboxProps
                  value={formData.CCTags.map((tag) => tag.id)}
                  onChange={(selectedIds: string[]) => {
                    setFormData((prev) =>
                      prev
                        ? {
                            ...prev,
                            CCTags: safeTagSummaries.filter((tag) =>
                              selectedIds.includes(tag.id)
                            ),
                          }
                        : prev
                    );
                  }}
                />
              </div>
            )}
          </div>
          <div className="flex flex-row justify-end gap-2 w-full">
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
                loading ? "opacity-50" : ""
              }`}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
