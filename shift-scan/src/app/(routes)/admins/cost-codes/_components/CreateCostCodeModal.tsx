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
import { createCostCode, createJobsiteAdmin } from "@/actions/AssetActions";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { StateOptions } from "@/data/stateValues";
import { Combobox } from "@/components/ui/combobox";
import { TagSummary } from "./useTagData";
import { code } from "@nextui-org/theme";

export default function CreateCostCodeModal({
  cancel,
  rerender,
}: {
  cancel: () => void;
  rerender: () => void;
}) {
  const { data: session } = useSession();
  const [tagSummaries, setTagSummaries] = useState<TagSummary[]>([]);

  if (!session) {
    toast.error("You must be logged in to create equipment.");
    return null;
  }

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch("/api/getTagSummary");
        const data = await res.json();
        // If API returns { tags: [...] }
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
    name: "",
    isActive: true,
    CCTags: [],
  });

  const [submitting, setSubmitting] = useState(false);
  const handleCreateJobsite = async () => {
    setSubmitting(true);
    try {
      // Basic validation
      if (!formData.name.trim()) {
        toast.error("Jobsite name is required");
        setSubmitting(false);
        return;
      }

      // Prepare payload
      const payload = {
        code: formData.code.trim(),
        name: formData.name.trim(),
        isActive: formData.isActive,
        CCTags: formData.CCTags.map((tag) => ({
          id: tag.id,
          name: tag.name,
        })),
      };

      const result = await createCostCode(payload);
      if (result.success) {
        toast.success("Cost Code created successfully!");
        rerender();
        cancel();
      } else {
        toast.error("Failed to create Cost Code");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to create Cost Code");
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
              <div className="mt-4">
                <Label htmlFor="cc-number" className={`text-sm `}>
                  Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="cc-number"
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, code: e.target.value }))
                  }
                  placeholder="#100.00"
                  className="w-full text-xs"
                  required
                />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="mt-4">
                <Label htmlFor="cc-name" className={`text-sm `}>
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="cc-name"
                  type="tex t"
                  name="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full text-xs"
                  required
                />
              </div>
            </div>
            {tagSummaries && (
              <div className="mt-4">
                <Label htmlFor="isActive" className="text-sm font-medium">
                  Cost Code Tags
                </Label>
                <Combobox
                  options={tagSummaries.map((tag) => ({
                    label: tag.name,
                    value: tag.id,
                  }))}
                  value={formData.CCTags.map((tag) => tag.id)}
                  onChange={(selectedIds: string[]) => {
                    setFormData((prev) => ({
                      ...prev,
                      CCTags: tagSummaries.filter((tag) =>
                        selectedIds.includes(tag.id)
                      ),
                    }));
                  }}
                />
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
