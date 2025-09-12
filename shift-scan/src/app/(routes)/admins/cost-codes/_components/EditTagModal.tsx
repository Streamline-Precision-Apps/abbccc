"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { updateTagAdmin } from "@/actions/AssetActions";
import { toast } from "sonner";
import { Combobox } from "@/components/ui/combobox";
import { Tag, useTagDataById } from "./useTagDataById";

export default function EditTagModal({
  cancel,
  pendingEditId,
  rerender,
}: {
  cancel: () => void;
  pendingEditId: string;
  rerender: () => void;
}) {
  const { tagDetails, costCodeSummaries, jobsiteSummaries, loading } =
    useTagDataById(pendingEditId);
  const [formData, setFormData] = useState<Tag | null>(null);
  const [originalForm, setOriginalForm] = useState<Tag | null>(null);

  useEffect(() => {
    if (tagDetails) {
      setFormData(tagDetails);
      setOriginalForm(tagDetails);
    }
  }, [tagDetails]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            [name]:
              type === "number" ? (value === "" ? null : Number(value)) : value,
          }
        : prev,
    );
  };

  const handleSaveChanges = async () => {
    if (!formData) {
      toast.error("No form data to save.", { duration: 3000 });
      return;
    }
    try {
      const fd = new FormData();
      fd.append("id", formData.id);
      fd.append("name", formData.name);
      fd.append("description", formData.description);
      fd.append("Jobsites", JSON.stringify(formData.Jobsites.map((j) => j.id)));
      fd.append(
        "CostCodeTags",
        JSON.stringify(formData.CostCodes.map((c) => c.id)),
      );

      const result = await updateTagAdmin(fd);

      if (result?.success) {
        toast.success("Tag updated successfully.", { duration: 3000 });
        cancel();
        rerender();
      } else {
        throw new Error(result?.message || "Failed to update Tag.");
      }
    } catch (err) {
      toast.error("Error updating Tag. Please try again.", { duration: 3000 });
      console.error(err);
    }
  };

  if (loading || !formData || !originalForm) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-lg shadow-lg w-[600px] max-h-[80vh] overflow-y-auto no-scrollbar p-8 flex flex-col items-center">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }
  const safeJobsiteSummaries = Array.isArray(jobsiteSummaries)
    ? jobsiteSummaries
    : [];
  const allJobsites = [
    ...safeJobsiteSummaries,
    ...formData.Jobsites.filter(
      (js) => !safeJobsiteSummaries.some((j) => j.id === js.id),
    ),
  ];

  const safeCostCodeSummaries = Array.isArray(costCodeSummaries)
    ? costCodeSummaries
    : [];
  const allCostCodes = [
    ...safeCostCodeSummaries,
    ...formData.CostCodes.filter(
      (cc) => !safeCostCodeSummaries.some((c) => c.id === cc.id),
    ),
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-[600px] max-h-[80vh] overflow-y-auto no-scrollbar p-8 flex flex-col items-center">
        <div className="flex flex-col w-full ">
          {/* <div className="flex flex-row justify-between mb-4">
            <p className="text-xs  text-gray-500">
              {`last updated at ${format(formData.updatedAt, "PPpp")}`}
            </p>
          </div>*/}
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
              <Label htmlFor="name" className="text-sm">
                Name
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
              <Label htmlFor="description" className="text-sm">
                Description
              </Label>
              <Input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full text-xs"
              />
            </div>
            <div>
              {jobsiteSummaries && (
                <div className="my-4 border-t border-gray-200 pt-4">
                  <Combobox
                    label={`Jobsites (Optional)`}
                    options={
                      allJobsites
                        ? allJobsites
                            .filter(
                              (jobsite) => jobsite.name.toLowerCase() !== "all",
                            )
                            .map((jobsite) => ({
                              label: jobsite.name,
                              value: jobsite.id,
                            }))
                        : []
                    }
                    // name prop removed, not supported by ComboboxProps
                    value={formData.Jobsites.map((jobsite) => jobsite.id)}
                    onChange={(selectedIds: string[]) => {
                      setFormData((prev) =>
                        prev
                          ? {
                              ...prev,
                              Jobsites: allJobsites.filter((jobsite) =>
                                selectedIds.includes(jobsite.id),
                              ),
                            }
                          : prev,
                      );
                    }}
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
                              setFormData((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      Jobsites: prev.Jobsites.filter(
                                        (j) => j.id !== js.id,
                                      ),
                                    }
                                  : prev,
                              );
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

              {costCodeSummaries && (
                <div className="mt-2">
                  <div className="my-4 border-t border-gray-200 pt-4">
                    <Combobox
                      label={`Cost Codes (Optional)`}
                      options={
                        allCostCodes
                          ? allCostCodes
                              .filter(
                                (costCode) =>
                                  costCode.name.toLowerCase() !== "all",
                              )
                              .map((costCode) => ({
                                label: costCode.name,
                                value: costCode.id,
                              }))
                          : []
                      }
                      // name prop removed, not supported by ComboboxProps
                      value={formData.CostCodes.map((costCode) => costCode.id)}
                      onChange={(selectedIds: string[]) => {
                        setFormData((prev) =>
                          prev
                            ? {
                                ...prev,
                                CostCodes: allCostCodes.filter((costCode) =>
                                  selectedIds.includes(costCode.id),
                                ),
                              }
                            : prev,
                        );
                      }}
                    />
                    <div className="min-h-[100px] border border-gray-200 rounded p-2 mt-2">
                      <div className=" flex flex-wrap gap-2">
                        {formData.CostCodes.map((cc) => (
                          <div
                            key={cc.id}
                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded flex items-center gap-1"
                          >
                            <span>{cc.name}</span>
                            <button
                              type="button"
                              className="text-blue-800 hover:text-blue-900"
                              onClick={() => {
                                setFormData((prev) =>
                                  prev
                                    ? {
                                        ...prev,
                                        CostCodes: prev.CostCodes.filter(
                                          (c) => c.id !== cc.id,
                                        ),
                                      }
                                    : prev,
                                );
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
    </div>
  );
}
