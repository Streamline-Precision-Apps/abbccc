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
import { createJobsiteAdmin } from "@/actions/AssetActions";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { StateOptions } from "@/data/stateValues";
import { Combobox } from "@/components/ui/combobox";
type TagSummary = {
  id: string;
  name: string;
};

type ClientsSummary = {
  id: string;
  name: string;
};
export default function CreateJobsiteModal({
  cancel,
  rerender,
}: {
  cancel: () => void;
  rerender: () => void;
}) {
  const { data: session } = useSession();
  const [tagSummaries, setTagSummaries] = useState<TagSummary[]>([]);
  const [clients, setClients] = useState<ClientsSummary[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const [tag, client] = await Promise.all([
          fetch("/api/getTagSummary"),
          fetch("/api/getClientsSummary"),
        ]).then((res) => Promise.all(res.map((r) => r.json())));

        const filteredTags = tag.tags.map(
          (tag: { id: string; name: string }) => ({
            id: tag.id,
            name: tag.name,
          })
        );
        setTagSummaries(filteredTags);

        setClients(client);
      } catch (error) {
        console.error("Failed to fetch tags:", error);
      }
    };
    fetchTags();
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    ApprovalStatus: "APPROVED",
    isActive: false,
    Address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
    Client: {
      id: "",
    },
    CCTags: [{ id: "", name: "" }],
    CreatedVia: "ADMIN",
    createdById: "",
  });

  // Handles both input and select changes for address fields
  const handleAddressChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      | { name: string; value: string | number }
  ) => {
    let name: string, value: string | number, type: string | undefined;
    if ("target" in e) {
      name = e.target.name;
      value = e.target.value;
      type = (e.target as HTMLInputElement).type;
    } else {
      name = e.name;
      value = e.value;
      type = undefined;
    }
    setFormData((prev: typeof formData) => ({
      ...prev,
      Address: {
        ...prev.Address,
        [name]:
          type === "number" ? (value === "" ? null : Number(value)) : value,
      },
    }));
  };
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
        name: formData.name.trim(),
        description: formData.description?.trim() || "",
        ApprovalStatus: formData.ApprovalStatus,
        isActive: formData.isActive,
        Address: {
          street: formData.Address.street.trim(),
          city: formData.Address.city.trim(),
          state: formData.Address.state.trim(),
          zipCode: formData.Address.zipCode.trim(),
        },
        Client: {
          id: formData.Client.id,
        },
        CCTags: formData.CCTags ? [formData.CCTags] : [],
        CreatedVia: formData.CreatedVia,
        createdById: session?.user.id ? session.user.id : "",
      };

      const result = await createJobsiteAdmin({ payload });
      if (result.success) {
        toast.success("Jobsite created successfully!");
        rerender();
        cancel();
      } else {
        toast.error("Failed to create jobsite");
      }
    } catch (error) {
      toast.error("Failed to create jobsite");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-[600px] max-h-[80vh] overflow-y-auto no-scrollbar p-8 flex flex-col items-center">
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold">Create Jobsite</h2>
            <p className="text-xs text-gray-600">
              Fill in the details to create a new jobsite.
            </p>
            <p className="text-xs text-red-500">
              All fields marked with * are required
            </p>
          </div>
          <div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <Label htmlFor="client-id" className={`text-sm `}>
                  Client ID{" "}
                </Label>
                <Select
                  name="client-id"
                  value={formData.Client.id}
                  onValueChange={(selected) =>
                    setFormData((prev) => ({
                      ...prev,
                      Client: {
                        ...prev.Client,
                        id: selected,
                      },
                    }))
                  }
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
              </div>
              <div>
                <Label htmlFor="jobsite-name" className={`text-sm `}>
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="jobsite-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full text-xs"
                  required
                />
              </div>
              <div>
                <Label
                  htmlFor="jobsite-description"
                  className="text-sm font-medium"
                >
                  Description
                </Label>
                <Textarea
                  id="jobsite-description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full text-xs min-h-[96px]"
                  placeholder="Enter jobsite description..."
                  style={{ resize: "none" }}
                />
              </div>

              <div>
                <Label htmlFor="jobsite-active-status" className={`text-sm `}>
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
                  <SelectTrigger id="jobsite-active-status" className="text-xs">
                    <SelectValue placeholder="Select Active Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="my-2">
                <p className="text-xs text-gray-600">
                  Please provide the jobsite&apos;s address details.
                </p>
              </div>
              <div>
                <Label
                  htmlFor="jobsite-street"
                  className={`text-sm font-medium `}
                >
                  Street <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="jobsite-street"
                  name="street"
                  value={formData.Address.street}
                  onChange={handleAddressChange}
                  className="w-full text-xs"
                  required
                />
              </div>
              <div>
                <Label
                  htmlFor="jobsite-city"
                  className={`text-sm font-medium `}
                >
                  City <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="jobsite-city"
                  name="city"
                  value={formData.Address.city}
                  onChange={handleAddressChange}
                  className="w-full text-xs"
                  required
                />
              </div>
              <div>
                <Label
                  htmlFor="jobsite-state"
                  className={`text-sm font-medium `}
                >
                  State <span className="text-red-500">*</span>
                </Label>
                <Select
                  name="state"
                  value={formData.Address.state}
                  onValueChange={(value) =>
                    handleAddressChange({ name: "state", value })
                  }
                >
                  <SelectTrigger id="jobsite-state" className="text-xs">
                    <SelectValue placeholder="Select a State" />
                  </SelectTrigger>
                  <SelectContent>
                    {StateOptions.map((state) => (
                      <SelectItem key={state.value} value={state.value}>
                        {state.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="jobsite-zip" className={`text-sm font-medium `}>
                  Zip Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="jobsite-zip"
                  name="zipCode"
                  value={formData.Address.zipCode}
                  onChange={handleAddressChange}
                  className="w-full text-xs"
                  required
                />
              </div>
            </div>
            <div className="my-4">
              <p className="text-xs text-gray-600">
                Please Select the cost code groups to associate with the
                jobsite.
              </p>
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
                    // name prop removed, not supported by ComboboxProps
                    value={formData.CCTags.map((tag) => tag.id)}
                    onChange={(selectedIds: string[]) => {
                      setFormData((prev) =>
                        prev
                          ? {
                              ...prev,
                              CCTags: tagSummaries.filter((tag) =>
                                selectedIds.includes(tag.id)
                              ),
                            }
                          : prev
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
                                      (j) => j.id !== js.id
                                    ),
                                  }
                                : prev
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
              {submitting ? "Creating..." : "Create Jobsite"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
