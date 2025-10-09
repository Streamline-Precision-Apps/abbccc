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
import { useEffect, useState } from "react";
import { createCostCode } from "@/actions/AssetActions";
import { toast } from "sonner";
import { Combobox } from "@/components/ui/combobox";
import { TagSummary } from "./useTagData";

export default function CreateCostCodeModal({
  cancel,
  rerender,
}: {
  cancel: () => void;
  rerender: () => void;
}) {
  const [tagSummaries, setTagSummaries] = useState<TagSummary[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch("/api/getTagSummary");
        const data = await res.json();
        setTagSummaries(data.tags || []);
      } catch (error) {
        console.error("Failed to fetch tags:", error);
      }
    };
    fetchTags();
  }, []);

  const [formData, setFormData] = useState<{
    code: string;
    name: string;
    isActive: boolean;
    CCTags: TagSummary[];
  }>({
    code: "",
    name: "", // This should always contain ONLY the name part, never the code
    isActive: true,
    CCTags: [],
  });

  const [submitting, setSubmitting] = useState(false);
  const handleCreateJobsite = async () => {
    setSubmitting(true);
    try {
      if (!formData.code.trim()) {
        toast.error("Cost code number is required", { duration: 3000 });
        setSubmitting(false);
        return;
      }

      if (!formData.name.trim()) {
        toast.error("Cost code name is required", { duration: 3000 });
        setSubmitting(false);
        return;
      }
      // Prepare payload - ensure clean separation of code and name
      const cleanCode = formData.code.trim();
      const cleanName = formData.name.trim();

      const payload = {
        code: cleanCode, // Save code without #
        name: `#${cleanCode} ${cleanName}`.trim(), // Save name as "#code name"
        isActive: formData.isActive,
        CCTags: [
          ...formData.CCTags.map((tag) => ({
            id: tag.id,
            name: tag.name,
          })),
          { id: "All", name: "All" },
        ],
      };

      const result = await createCostCode(payload);
      if (result.success) {
        toast.success("Cost Code created successfully!", { duration: 3000 });
        rerender();
        cancel();
      } else {
        toast.error("Failed to create Cost Code", { duration: 3000 });
      }
    } catch (error) {
      console.error("Error creating cost code:", error);
      toast.error("An error occurred while creating the Cost Code", {
        duration: 3000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-[600px] max-h-[80vh] overflow-y-auto no-scrollbar p-8 flex flex-col items-center">
        <div className="flex flex-col gap-4 w-full">
          <div>
            <h2 className="text-lg font-semibold">Create Cost Code</h2>
            <p className="text-xs text-gray-600">
              Fill in the details to create a new cost code.
            </p>
          </div>
          <div>
            <div className="flex flex-col gap-4">
              <div className="">
                <Label htmlFor="cc-number" className={`text-xs `}>
                  Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="cc-number"
                  type="text"
                  name="code"
                  value={`#${formData.code}`}
                  onChange={(e) => {
                    let value = e.target.value;
                    // Ensure it starts with # and prevent multiple #
                    if (!value.startsWith("#")) {
                      value = "#" + value;
                    }
                    // Remove any additional # characters
                    value = "#" + value.slice(1).replace(/#/g, "");

                    // Extract the numeric part after #
                    const numericPart = value.slice(1);
                    // Only allow numbers and one decimal point
                    const validNumericPart = numericPart
                      .replace(/[^0-9.]/g, "")
                      .replace(/(\..*?)\..*/g, "$1");

                    // Update ONLY the code field, never touch the name field
                    setFormData((prev) => ({
                      ...prev,
                      code: validNumericPart,
                    }));
                  }}
                  onKeyDown={(e) => {
                    // Prevent deletion of # at the beginning
                    if (e.key === "Backspace" || e.key === "Delete") {
                      const input = e.target as HTMLInputElement;
                      const selectionStart = input.selectionStart || 0;
                      const selectionEnd = input.selectionEnd || 0;

                      // If trying to delete the # or select text that includes #
                      if (
                        selectionStart === 0 ||
                        (selectionStart === 0 && selectionEnd > 0)
                      ) {
                        e.preventDefault();
                      }
                    }
                  }}
                  onClick={(e) => {
                    // Prevent cursor from going before #
                    const input = e.target as HTMLInputElement;
                    if (input.selectionStart === 0) {
                      input.setSelectionRange(1, 1);
                    }
                  }}
                  placeholder="#100.00"
                  className="w-full text-xs"
                  required
                />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="mt-4">
                <Label htmlFor="cc-name" className={`text-xs `}>
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="cc-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) => {
                    // Update ONLY the name field, never touch the code field
                    setFormData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }));
                  }}
                  className="w-full text-xs"
                  required
                />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="mt-4">
                <Label htmlFor="cc-active-status" className={`text-xs `}>
                  Active Status
                </Label>
                <Select
                  name="isActive"
                  value={formData.isActive ? "true" : "false"}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      isActive: value === "true",
                    }))
                  }
                >
                  <SelectTrigger id="cc-active-status" className="text-xs">
                    <SelectValue placeholder="Select Active Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-6 border-t border-gray-200 pt-2">
              <p className="text-base text-gray-400">{`Add Costcode to Tags`}</p>
            </div>
            {tagSummaries && (
              <div className="mt-4">
                <Combobox
                  label={` Tags (Optional)`}
                  options={tagSummaries
                    .filter((tag) => tag.name.toLowerCase() !== "all")
                    .map((tag) => ({
                      label: tag.name,
                      value: tag.id,
                    }))}
                  value={formData.CCTags.map((tag) => tag.id)}
                  onChange={(selectedIds: string[]) => {
                    setFormData((prev) => ({
                      ...prev,
                      CCTags: tagSummaries.filter((tag) =>
                        selectedIds.includes(tag.id),
                      ),
                    }));
                  }}
                  placeholder="Select one or more tags..."
                />
                <p className="text-xs pt-1 flex flex-row justify-end text-gray-400">
                  {`Automatically connects to main list.`}
                </p>
              </div>
            )}
          </div>
          <div className="flex flex-row justify-end gap-2 w-full mt-4">
            <Button
              variant="outline"
              onClick={cancel}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={handleCreateJobsite}
              className={`bg-sky-500 hover:bg-sky-400 text-white px-4 py-2 rounded ${
                submitting ? "opacity-50" : ""
              }`}
            >
              {submitting ? "Creating..." : "Create Cost Code"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
