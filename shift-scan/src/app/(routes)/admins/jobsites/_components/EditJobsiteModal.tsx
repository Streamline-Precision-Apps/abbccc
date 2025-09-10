"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Jobsite, useJobsiteDataById } from "./useJobsiteDataById";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { SquareCheck, SquareXIcon } from "lucide-react";
import { format } from "date-fns";
import { updateJobsiteAdmin } from "@/actions/AssetActions";
import { toast } from "sonner";
import { Combobox } from "@/components/ui/combobox";
import { Switch } from "@/components/ui/switch";
import { useDashboardData } from "../../_pages/sidebar/DashboardDataContext";

export default function EditJobsiteModal({
  cancel,
  pendingEditId,
  rerender,
}: {
  cancel: () => void;
  pendingEditId: string;
  rerender: () => void;
}) {
  const { jobSiteDetails, tagSummaries, loading } =
    useJobsiteDataById(pendingEditId);
  const { refresh } = useDashboardData();
  const [formData, setFormData] = useState<Jobsite>();
  const [originalForm, setOriginalForm] = useState<Jobsite | null>(null);

  useEffect(() => {
    if (jobSiteDetails) {
      setFormData(jobSiteDetails);
      setOriginalForm(jobSiteDetails);
    }
  }, [jobSiteDetails]);

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
      fd.append("code", formData.code || ""); // Ensure code is included
      fd.append("name", formData.name);
      fd.append("description", formData.description || "");
      fd.append("creationReason", formData.creationReason || "");
      fd.append("approvalStatus", formData.approvalStatus);
      fd.append("isActive", String(formData.isActive));
      fd.append(
        "CCTags",
        JSON.stringify(formData.CCTags.map((tag) => ({ id: tag.id }))),
      );

      const result = await updateJobsiteAdmin(fd);

      if (result?.success) {
        toast.success("Jobsite updated successfully.", { duration: 3000 });
        cancel();
        refresh();
        rerender();
      } else {
        throw new Error(result?.message || "Failed to update jobsite.");
      }
    } catch (err) {
      toast.error("Error updating jobsite. Please try again.", {
        duration: 3000,
      });
      console.error(err);
    }
  };

  if (loading || !formData || !originalForm || !tagSummaries) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-lg shadow-lg w-[600px] max-h-[80vh] overflow-y-auto no-scrollbar p-8 flex flex-col items-center">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-[600px] max-h-[80vh] overflow-y-auto no-scrollbar p-8 flex flex-col items-center">
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
          </div>
          {/* <div className="flex flex-col">
            <Label htmlFor="client-id" className={`text-sm`}>
              Client ID
            </Label>
            <Select
              name="client-id"
              value={formData.Client?.id || ""}
              onValueChange={(selectedId) => {
                const selectedClient = clients.find((c) => c.id === selectedId);
                setFormData((prev) => {
                  if (!prev) return prev;
                  if (selectedClient) {
                    return { ...prev, Client: selectedClient };
                  } else {
                    // Remove Client property if none selected
                    const { Client, ...rest } = prev;
                    return { ...rest } as Jobsite;
                  }
                });
              }}
            >
              <SelectTrigger id="jobsite-cctags" className="text-xs">
                <SelectValue placeholder="Select a cost code group" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div> */}

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
              <Label htmlFor="jobsite-code" className={`text-sm `}>
                Code Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="jobsite-code"
                type="text"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                className="w-full text-xs"
                required
              />
              <p className="pl-1 text-xs italic text-gray-600">
                Enter the code only
              </p>
            </div>
            <div>
              <Label htmlFor="name" className="text-sm">
                Full Name
              </Label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full text-xs"
                required
              />
              <p className="pl-1 text-xs italic text-gray-600">
                Include jobsite code in full name
              </p>
            </div>
            <div>
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                className="w-full text-xs"
              />
            </div>
            {tagSummaries && (
              <div>
                <div>
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
                      setFormData((prev) =>
                        prev
                          ? {
                              ...prev,
                              CCTags: tagSummaries.filter((tag) =>
                                selectedIds.includes(tag.id),
                              ),
                            }
                          : prev,
                      );
                    }}
                  />
                </div>
                <div className="min-h-[100px] border border-gray-200 rounded p-2 mt-2">
                  <div className=" flex flex-wrap gap-2">
                    {formData.CCTags.map((js) => (
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
                                    CCTags: prev.CCTags.filter(
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
                loading ? "opacity-50" : ""
              }`}
            >
              {loading ? "Saving..." : "Save Changes"}
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
