"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { createTag } from "@/actions/AssetActions";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { Combobox } from "@/components/ui/combobox";
import { ApprovalStatus } from "@/lib/enums";
import { Textarea } from "@/components/ui/textarea";

type JobsiteSummary = {
  id: string;
  name: string;
  approvalStatus: ApprovalStatus;
};

type CostCodeSummary = {
  id: string;
  name: string;
  isActive: boolean;
};

export default function CreateTagModal({
  cancel,
  rerender,
}: {
  cancel: () => void;
  rerender: () => void;
}) {
  const [jobsite, setJobsite] = useState<JobsiteSummary[]>([]);
  const [costCode, setCostCode] = useState<CostCodeSummary[]>([]);
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    Jobsites: Array<{ id: string; name: string }>;
    CostCodes: Array<{ id: string; name: string }>;
  }>({
    name: "",
    description: "",
    Jobsites: [],
    CostCodes: [],
  });

  useEffect(() => {
    const fetchJobsites = async () => {
      try {
        const res = await fetch("/api/getJobsiteSummary");
        const data = await res.json();
        const filteredJobsites = data
          .filter(
            (jobsite: {
              id: string;
              name: string;
              approvalStatus: ApprovalStatus;
            }) => jobsite.approvalStatus !== ApprovalStatus.REJECTED,
          )
          .map((jobsite: { id: string; name: string }) => ({
            id: jobsite.id,
            name: jobsite.name,
          }));

        setJobsite(filteredJobsites || []);
      } catch (error) {
        console.error("Failed to fetch jobsites:", error);
      }
    };
    fetchJobsites();
  }, []);

  useEffect(() => {
    const fetchCostCodes = async () => {
      try {
        const res = await fetch("/api/getCostCodeSummary");
        const data = await res.json();
        const filteredCostCodes = data
          .filter(
            (costCode: { id: string; name: string; isActive: boolean }) =>
              costCode.isActive === true,
          )
          .map((costCode: { id: string; name: string }) => ({
            id: costCode.id,
            name: costCode.name,
          }));

        setCostCode(filteredCostCodes || []);
      } catch (error) {
        console.error("Failed to fetch jobsites:", error);
      }
    };
    fetchCostCodes();
  }, []);

  const [submitting, setSubmitting] = useState(false);
  const handleCreateJobsite = async () => {
    setSubmitting(true);
    try {
      if (!formData.name.trim()) {
        toast.error("Tag name is required", { duration: 3000 });
        setSubmitting(false);
        return;
      }

      if (!formData.description.trim()) {
        toast.error("Tag description is required", { duration: 3000 });
        setSubmitting(false);
        return;
      }

      // Prepare payload
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        CostCode: formData.CostCodes.map((costCode) => ({
          id: costCode.id,
          name: costCode.name,
        })),
        Jobsites: formData.Jobsites.map((jobsite) => ({
          id: jobsite.id,
          name: jobsite.name,
        })),
      };

      const result = await createTag(payload);
      if (result.success) {
        toast.success("Tag created successfully!", { duration: 3000 });
        rerender();
        cancel();
      } else {
        toast.error("Failed to create Tag", { duration: 3000 });
      }
    } catch (error) {
      console.error("Error creating tag:", error);
      toast.error("Failed to create Tag. Please try again.", {
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
            <h2 className="text-lg font-semibold">Create Tag</h2>
            <p className="text-xs text-gray-600">
              Fill in the details to create a new tag.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="mt-4">
              <Label htmlFor="cc-name" className={`text-xs `}>
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
                placeholder="Enter tag name"
                className="w-full text-xs"
                required
              />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="">
              <Label htmlFor="cc-number" className={`text-xs `}>
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="cc-number"
                name="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Enter tag description"
                className="w-full text-xs"
                required
              />
            </div>
            <div className="mt-2 border-t border-gray-200 pt-2">
              <p className="text-sm text-gray-400">{`Items Linked`}</p>
            </div>
            {jobsite && (
              <div className="mt-2">
                <Combobox
                  label={` Jobsites (Optional)`}
                  options={jobsite.map((j) => ({
                    label: j.name,
                    value: j.id,
                  }))}
                  value={formData.Jobsites.map((tag) => tag.id)}
                  onChange={(selectedIds: string[]) => {
                    setFormData((prev) => ({
                      ...prev,
                      Jobsites: jobsite.filter((j) =>
                        selectedIds.includes(j.id),
                      ),
                    }));
                  }}
                  placeholder="Select Jobs..."
                />
                <div className="min-h-[100px] border border-gray-200 rounded p-2 mt-2">
                  <div className=" flex flex-wrap gap-2">
                    {formData.Jobsites.map((js) => (
                      <div
                        key={js.id}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded flex items-center gap-1"
                      >
                        <span>{js.name}</span>
                        <button
                          type="button"
                          className="text-blue-800 hover:text-blue-900"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              Jobsites: prev.Jobsites.filter(
                                (j) => j.id !== js.id,
                              ),
                            }));
                          }}
                          aria-label={`Remove ${js.name}`}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {costCode && (
              <div className="mt-4">
                <Combobox
                  label={` Cost Codes (Optional)`}
                  options={costCode.map((c) => ({
                    label: c.name,
                    value: c.id,
                  }))}
                  value={formData.CostCodes.map((tag) => tag.id)}
                  onChange={(selectedIds: string[]) => {
                    setFormData((prev) => ({
                      ...prev,
                      CostCodes: costCode.filter((c) =>
                        selectedIds.includes(c.id),
                      ),
                    }));
                  }}
                  placeholder="Select Cost Codes..."
                />
                <div className="min-h-[100px] border border-gray-200 rounded p-2 mt-2">
                  <div className=" flex flex-wrap gap-2">
                    {formData.CostCodes.map((cc) => (
                      <div
                        key={cc.id}
                        className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded flex items-center gap-1"
                      >
                        <span>{cc.name}</span>
                        <button
                          type="button"
                          className="text-green-800 hover:text-green-900"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              CostCodes: prev.CostCodes.filter(
                                (c) => c.id !== cc.id,
                              ),
                            }));
                          }}
                          aria-label={`Remove ${cc.name}`}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4 w-full mt-6">
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
