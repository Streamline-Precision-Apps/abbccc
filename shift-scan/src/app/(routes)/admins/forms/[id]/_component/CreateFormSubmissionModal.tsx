"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Spinner from "@/components/(animations)/spinner";
import { createFormSubmission } from "@/actions/records-forms";
import { toast } from "sonner";
import { Combobox } from "@/components/ui/combobox";

export interface Submission {
  id: string;
  title: string;
  formTemplateId: string;
  userId: string;
  formType: string;
  data: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  submittedAt: string;
  status: string;
  User: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface FormIndividualTemplate {
  id: string;
  name: string;
  formType: string;
  createdAt: string;
  updatedAt: string;
  isActive: string;
  description: string | null;
  isSignatureRequired: boolean;
  FormGrouping: Grouping[];
  Submissions: Submission[];
  total?: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
}

export interface Grouping {
  id: string;
  title: string;
  order: number;
  Fields: Fields[];
}

export interface Fields {
  id: string;
  formGroupingId: string;
  label: string;
  type: string;
  required: boolean;
  order: number;
  placeholder?: string | null;
  minLength?: number | null;
  maxLength?: number | null;
  multiple: boolean | null;
  content?: string | null;
  filter?: string | null;
  Options?: FieldOption[];
}

interface FieldOption {
  id: string;
  fieldId: string;
  value: string;
}

interface CreateFormSubmissionModalProps {
  formTemplate: FormIndividualTemplate;
  closeModal: () => void;
  onSuccess?: () => void;
}

const CreateFormSubmissionModal: React.FC<CreateFormSubmissionModalProps> = ({
  formTemplate,
  closeModal,
  onSuccess,
}) => {
  console.log("Form Template:", formTemplate);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [submittedBy, setSubmittedBy] = useState<{
    id: string;
    firstName: string;
    lastName: string;
  } | null>(null);
  const [submittedByTouched, setSubmittedByTouched] = useState(false);

  // State for different asset types
  const [equipment, setEquipment] = useState<{ id: string; name: string }[]>(
    []
  );
  const [jobsites, setJobsites] = useState<{ id: string; name: string }[]>([]);
  const [costCodes, setCostCodes] = useState<{ id: string; name: string }[]>(
    []
  );

  const [users, setUsers] = useState<
    { id: string; firstName: string; lastName: string }[]
  >([]);
  const [clients, setClients] = useState<{ id: string; name: string }[]>([]);

  const userOptions = users.map((u) => ({
    value: u.id,
    label: `${u.firstName} ${u.lastName}`,
  }));

  const clientOptions = clients.map((c) => ({
    value: c.id,
    label: `${c.name}`,
  }));

  const equipmentOptions = equipment.map((e) => ({
    value: e.id,
    label: e.name,
  }));

  const jobsiteOptions = jobsites.map((j) => ({
    value: j.id,
    label: j.name,
  }));

  const costCodeOptions = costCodes.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  useEffect(() => {
    const fetchEmployees = async () => {
      const res = await fetch("/api/getAllActiveEmployeeName");
      const employees = await res.json();
      setUsers(employees);
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    const fetchClients = async () => {
      const res = await fetch("/api/getClientsSummary");
      const clients = await res.json();
      setClients(clients);
    };
    fetchClients();
  }, []);

  // Fetch equipment data
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const res = await fetch("/api/getEquipmentSummary");
        if (!res.ok) throw new Error("Failed to fetch equipment");
        const data = await res.json();
        setEquipment(data);
      } catch (error) {
        console.error("Error fetching equipment:", error);
      }
    };
    fetchEquipment();
  }, []);

  // Fetch jobsites data
  useEffect(() => {
    const fetchJobsites = async () => {
      try {
        const res = await fetch("/api/getJobsiteSummary");
        if (!res.ok) throw new Error("Failed to fetch jobsites");
        const data = await res.json();

        setJobsites(data);
      } catch (error) {
        console.error("Error fetching jobsites:", error);
      }
    };
    fetchJobsites();
  }, []);

  // Fetch cost codes data
  useEffect(() => {
    const fetchCostCodes = async () => {
      try {
        const res = await fetch("/api/getCostCodeSummary");
        if (!res.ok) throw new Error("Failed to fetch cost codes");
        const data = await res.json();
        setCostCodes(data);
      } catch (error) {
        console.error("Error fetching cost codes:", error);
      }
    };
    fetchCostCodes();
  }, []);

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = async () => {
    setSubmittedByTouched(true);
    if (!submittedBy) {
      toast.error("'Submitted By' is required");
      return;
    }
    setLoading(true);
    try {
      // Process formData to ensure asset data is properly formatted
      const processedFormData = { ...formData };

      const res = await createFormSubmission({
        formTemplateId: formTemplate.id,
        data: processedFormData,
        submittedBy: {
          id: submittedBy.id,
          firstName: submittedBy.firstName,
          lastName: submittedBy.lastName,
        },
      });
      if (res.success) {
        toast.success("Submission created successfully");
        closeModal();
        onSuccess?.();
      } else {
        toast.error(res.error || "Failed to create submission");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const renderFields = () => {
    if (!formTemplate?.FormGrouping) return null;
    return (
      <>
        <div className="mb-4">
          <Label className="text-sm font-medium mb-1 text-red-600">
            Submitted By <span className="text-red-500">*</span>
          </Label>
          <Combobox
            options={userOptions}
            value={submittedBy?.id || ""}
            onChange={(val, option) => {
              if (option) {
                setSubmittedBy({
                  id: option.value,
                  firstName: option.label.split(" ")[0],
                  lastName: option.label.split(" ")[1],
                });
              } else {
                setSubmittedBy(null);
              }
            }}
            placeholder="Select user"
            filterKeys={["value", "label"]}
          />
          {submittedByTouched && !submittedBy?.id.trim() && (
            <span className="text-xs text-red-500">
              This field is required.
            </span>
          )}
        </div>
        {formTemplate.FormGrouping.map((group) => (
          <div key={group.id} className="mb-4">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              {group.Fields.map((field: Fields) => {
                const value = formData[field.id] ?? "";
                const options = field.Options || [];

                switch (field.type) {
                  case "TEXTAREA":
                    return (
                      <div key={field.id} className="flex flex-col">
                        <Label className="text-sm font-medium mb-1">
                          {field.label}
                        </Label>
                        <Textarea
                          className="border rounded px-2 py-1"
                          value={value}
                          onChange={(e) =>
                            handleFieldChange(field.id, e.target.value)
                          }
                        />
                      </div>
                    );
                  case "NUMBER":
                    return (
                      <div key={field.id} className="flex flex-col">
                        <Label className="text-sm font-medium mb-1">
                          {field.label}
                        </Label>
                        <Input
                          type="number"
                          className="border rounded px-2 py-1"
                          value={value}
                          onChange={(e) =>
                            handleFieldChange(field.id, e.target.value)
                          }
                        />
                      </div>
                    );
                  case "DATE":
                    return (
                      <div key={field.id} className="flex flex-col">
                        <Label className="text-sm font-medium mb-1">
                          {field.label}
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Input
                              readOnly
                              value={
                                value
                                  ? format(new Date(value), "yyyy-MM-dd")
                                  : ""
                              }
                              type="Date"
                              placeholder="Select date"
                              className="border rounded px-2 py-1 cursor-pointer bg-white"
                            />
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={value ? new Date(value) : undefined}
                              onSelect={(date) => {
                                if (date) {
                                  handleFieldChange(
                                    field.id,
                                    date.toISOString()
                                  );
                                }
                              }}
                            />
                            {value && (
                              <Button
                                variant="outline"
                                className="w-full text-xs text-blue-600 "
                                onClick={() => handleFieldChange(field.id, "")}
                                type="button"
                              >
                                Clear date
                              </Button>
                            )}
                          </PopoverContent>
                        </Popover>
                      </div>
                    );
                  case "TIME":
                    return (
                      <div key={field.id} className="flex flex-col">
                        <Label className="text-sm font-medium mb-1">
                          {field.label}
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Input
                              readOnly
                              value={value ? value : ""}
                              type="time"
                              placeholder="Select time"
                              className="border rounded px-2 py-1 cursor-pointer bg-white"
                            />
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-2" align="start">
                            <input
                              type="time"
                              className="border rounded px-2 py-1 w-full"
                              value={value || ""}
                              onChange={(e) =>
                                handleFieldChange(field.id, e.target.value)
                              }
                            />
                            {value && (
                              <Button
                                variant="outline"
                                className="w-full text-xs text-blue-600 mt-2"
                                onClick={() => handleFieldChange(field.id, "")}
                                type="button"
                              >
                                Clear time
                              </Button>
                            )}
                          </PopoverContent>
                        </Popover>
                      </div>
                    );
                  case "DROPDOWN":
                    return (
                      <div key={field.id} className="flex flex-col">
                        <label className="text-sm font-medium mb-1">
                          {field.label}
                        </label>
                        <Select
                          value={value}
                          onValueChange={(val) =>
                            handleFieldChange(field.id, val)
                          }
                        >
                          <SelectTrigger className="border rounded px-2 py-1 bg-white">
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            {options.map((opt) => (
                              <SelectItem key={opt.id} value={opt.value}>
                                {opt.value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    );
                  case "RADIO":
                    return (
                      <div key={field.id} className="flex flex-col">
                        <Label className="text-sm font-medium mb-1">
                          {field.label}
                        </Label>
                        <RadioGroup
                          value={value}
                          onValueChange={(val) =>
                            handleFieldChange(field.id, val)
                          }
                          className="flex flex-row gap-2"
                        >
                          {options.map((opt) => (
                            <Label
                              key={opt.id}
                              className="flex items-center gap-1 cursor-pointer select-none"
                            >
                              <RadioGroupItem
                                value={opt.value}
                                id={`${field.id}-radio-${opt.id}`}
                              />
                              <span>{opt.value}</span>
                            </Label>
                          ))}
                        </RadioGroup>
                      </div>
                    );
                  case "CHECKBOX":
                    return (
                      <div
                        key={field.id}
                        className="flex flex-row items-center gap-2"
                      >
                        <Checkbox
                          checked={!!value}
                          onCheckedChange={(checked) =>
                            handleFieldChange(field.id, checked)
                          }
                          id={`checkbox-${field.id}`}
                        />
                        <Label
                          className="text-sm font-medium"
                          htmlFor={`checkbox-${field.id}`}
                        >
                          {field.label}
                        </Label>
                      </div>
                    );
                  case "HEADER":
                    return (
                      <div key={field.id} className="col-span-2">
                        <h2 className="text-xl font-bold my-2">
                          {field.content}
                        </h2>
                      </div>
                    );
                  case "PARAGRAPH":
                    return (
                      <div key={field.id} className="col-span-2">
                        <p className="text-gray-700 my-2">{field.content}</p>
                      </div>
                    );
                  case "MULTISELECT":
                    return (
                      <div key={field.id} className="flex flex-col">
                        <Label className="text-sm font-medium mb-1">
                          {field.label}
                        </Label>
                        <div className="flex flex-col gap-1 border rounded px-2 py-2 bg-white">
                          {options.map((opt) => (
                            <label
                              key={opt.id}
                              className="flex items-center gap-2 cursor-pointer select-none"
                            >
                              <Checkbox
                                checked={
                                  Array.isArray(value) &&
                                  value.includes(opt.value)
                                }
                                onCheckedChange={(checked) => {
                                  const updatedValue = checked
                                    ? [
                                        ...(Array.isArray(value) ? value : []),
                                        opt.value,
                                      ]
                                    : (Array.isArray(value)
                                        ? value
                                        : []
                                      ).filter((v) => v !== opt.value);
                                  handleFieldChange(field.id, updatedValue);
                                }}
                                id={`${field.id}-${opt.id}`}
                              />
                              <span>{opt.value}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  case "SEARCH_PERSON":
                    if (field.multiple) {
                      // For multiple selection of people
                      const selectedPeople = Array.isArray(formData[field.id])
                        ? formData[field.id]
                        : formData[field.id]
                        ? [formData[field.id]]
                        : [];

                      return (
                        <div key={field.id} className="flex flex-col">
                          <Label className="text-sm font-medium mb-1">
                            {field.label}
                          </Label>

                          {/* Combobox for selecting people */}
                          <Combobox
                            options={userOptions}
                            value=""
                            onChange={(val, option) => {
                              if (option) {
                                // Check if person is already selected
                                const isSelected = selectedPeople.some(
                                  (p: any) => p.id === option.value
                                );

                                if (!isSelected) {
                                  const newPerson = {
                                    id: option.value,
                                    name: option.label,
                                  };

                                  const updatedPeople = [
                                    ...selectedPeople,
                                    newPerson,
                                  ];
                                  handleFieldChange(field.id, updatedPeople);
                                }
                              }
                            }}
                            placeholder="Select people..."
                            filterKeys={["value", "label"]}
                          />
                          {/* Display selected people as tags */}
                          {selectedPeople.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2 mb-1">
                              {selectedPeople.map(
                                (person: any, idx: number) => (
                                  <div
                                    key={idx}
                                    className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded flex items-center gap-1"
                                  >
                                    <span>{person.name}</span>
                                    <button
                                      type="button"
                                      className="text-blue-800 hover:text-blue-900"
                                      onClick={() => {
                                        const updatedPeople =
                                          selectedPeople.filter(
                                            (_: any, i: number) => i !== idx
                                          );
                                        handleFieldChange(
                                          field.id,
                                          updatedPeople.length
                                            ? updatedPeople
                                            : null
                                        );
                                      }}
                                    >
                                      ×
                                    </button>
                                  </div>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      );
                    } else {
                      // For single person selection (existing behavior)
                      return (
                        <div key={field.id} className="flex flex-col">
                          <Combobox
                            label={field.label}
                            options={userOptions}
                            value={formData[field.id]?.id || ""}
                            onChange={(val, option) => {
                              if (option) {
                                // Store the selected value in formData instead of a separate asset state
                                handleFieldChange(field.id, {
                                  id: option.value,
                                  name: option.label,
                                });
                              } else {
                                handleFieldChange(field.id, null);
                              }
                            }}
                          />
                        </div>
                      );
                    }
                  case "SEARCH_ASSET":
                    // Determine which options to use based on the field filter
                    let assetOptions = clientOptions;
                    let assetType = "client";

                    if (field.filter) {
                      switch (field.filter.toUpperCase()) {
                        case "Equipment":
                        case "EQUIPMENT":
                          assetOptions = equipmentOptions;
                          assetType = "equipment";
                          break;
                        case "Jobsites":
                        case "JOBSITES":
                          assetOptions = jobsiteOptions;
                          assetType = "jobsite";
                          break;
                        case "Cost Codes":
                        case "COST_CODES":
                          assetOptions = costCodeOptions;
                          assetType = "costCode";
                          break;
                        case "Clients":
                        case "CLIENTS":
                          assetOptions = clientOptions;
                          assetType = "client";
                          break;
                      }
                    }

                    if (field.multiple) {
                      // For multiple selection of assets
                      const selectedAssets = Array.isArray(formData[field.id])
                        ? formData[field.id]
                        : formData[field.id]
                        ? [formData[field.id]]
                        : [];

                      return (
                        <div key={field.id} className="flex flex-col">
                          <Label className="text-sm font-medium mb-1">
                            {field.label}
                          </Label>

                          {/* Combobox for selecting assets */}
                          <Combobox
                            options={assetOptions}
                            value=""
                            onChange={(val, option) => {
                              if (option) {
                                // Check if asset is already selected
                                const isSelected = selectedAssets.some(
                                  (a: any) => a.id === option.value
                                );

                                if (!isSelected) {
                                  const newAsset = {
                                    id: option.value,
                                    name: option.label,
                                    type: assetType,
                                  };

                                  const updatedAssets = [
                                    ...selectedAssets,
                                    newAsset,
                                  ];
                                  handleFieldChange(field.id, updatedAssets);
                                }
                              }
                            }}
                            placeholder={`Select ${assetType}...`}
                            filterKeys={["value", "label"]}
                          />
                          {/* Display selected assets as tags */}
                          {selectedAssets.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2 mb-1">
                              {selectedAssets.map((asset: any, idx: number) => (
                                <div
                                  key={idx}
                                  className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded flex items-center gap-1"
                                >
                                  <span>{asset.name}</span>
                                  <button
                                    type="button"
                                    className="text-green-800 hover:text-green-900"
                                    onClick={() => {
                                      const updatedAssets =
                                        selectedAssets.filter(
                                          (_: any, i: number) => i !== idx
                                        );
                                      handleFieldChange(
                                        field.id,
                                        updatedAssets.length
                                          ? updatedAssets
                                          : null
                                      );
                                    }}
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    } else {
                      // For single asset selection (existing behavior)
                      return (
                        <div key={field.id} className="flex flex-col">
                          <Combobox
                            label={field.label}
                            options={assetOptions}
                            value={formData[field.id]?.id || ""}
                            onChange={(val, option) => {
                              if (option) {
                                // Store the selected value in formData instead of a separate asset state
                                handleFieldChange(field.id, {
                                  id: option.value,
                                  name: option.label,
                                  type: assetType,
                                });
                              } else {
                                handleFieldChange(field.id, null);
                              }
                            }}
                          />
                        </div>
                      );
                    }

                  default:
                    return (
                      <div key={field.id} className="flex flex-col">
                        <Label className="text-sm font-medium mb-1">
                          {field.label}
                        </Label>
                        <Input
                          type="text"
                          className="border rounded px-2 py-1"
                          value={value}
                          onChange={(e) =>
                            handleFieldChange(field.id, e.target.value)
                          }
                        />
                      </div>
                    );
                }
              })}
            </div>
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg min-w-[600px] max-w-[90vw] max-h-[80vh] overflow-y-auto no-scrollbar p-8 flex flex-col items-center">
        <div className="flex flex-col gap-4 w-full items-center">
          <div className="w-full flex flex-col justify-center mb-2 ">
            <div>
              <p className="text-lg text-black font-semibold ">
                Submit A New {formTemplate?.name || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">
                Please complete the form below to initiate a new{" "}
                {formTemplate?.name} submission.
              </p>
            </div>
          </div>
          <div className="w-full">{renderFields()}</div>
          <div className="w-full flex flex-row justify-end gap-2">
            <Button
              size={"sm"}
              onClick={closeModal}
              variant="outline"
              className="bg-gray-100 text-gray-800 hover:bg-gray-50 hover:text-gray-800"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              size={"sm"}
              onClick={handleSubmit}
              variant="outline"
              className="bg-emerald-500 text-white hover:bg-emerald-400 hover:text-white"
              disabled={loading}
            >
              {loading ? <Spinner size={20} /> : "Create Submission"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateFormSubmissionModal;
