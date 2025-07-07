"use client";

import React, { use, useEffect, useState } from "react";
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
import { FormIndividualTemplate } from "./hooks/types";
import { toast } from "sonner";
import { Combobox } from "@/components/ui/combobox";

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
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [submittedBy, setSubmittedBy] = useState<{
    id: string;
    firstName: string;
    lastName: string;
  } | null>(null);
  const [submittedByTouched, setSubmittedByTouched] = useState(false);
  const [assets, setAssets] = useState<
    { id: string; name: string; type: string }[]
  >([]);
  const [workers, setWorkers] = useState<
    { id: string; firstName: string; lastName: string }[]
  >([]);

  const [users, setUsers] = useState<
    { id: string; firstName: string; lastName: string }[]
  >([]);

  const userOptions = users.map((u) => ({
    value: u.id,
    label: `${u.firstName} ${u.lastName}`,
  }));
  const clientOptions = assets.map((c) => ({
    value: c.id,
    label: `${c.name}`,
  }));

  useEffect(() => {
    const fetchEmployees = async () => {
      const res = await fetch("/api/getAllActiveEmployeeName");
      const employees = await res.json();
      setUsers(employees);
    };
    fetchEmployees();
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
      const res = await createFormSubmission({
        formTemplateId: formTemplate.id,
        data: { ...formData },
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
            label="User"
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
            {group.title && (
              <p className="font-semibold text-base mb-2">{group.title}</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              {group.Fields.map((field: any) => {
                const value = formData[field.id] ?? "";
                type OptionType = {
                  id: string;
                  value: string;
                  fieldId?: string;
                };
                const options: OptionType[] = field.Options || [];
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
                            {options.map((opt: OptionType) => (
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
                          {options.map((opt: OptionType) => (
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
                          {options.map((opt: OptionType) => (
                            <label
                              key={opt.id}
                              className="flex items-center gap-2 cursor-pointer select-none"
                            >
                              <Checkbox
                                checked={
                                  Array.isArray(value)
                                    ? value.includes(opt.value)
                                    : false
                                }
                                onCheckedChange={(checked) => {
                                  let newValue = Array.isArray(value)
                                    ? [...value]
                                    : [];
                                  if (checked) {
                                    if (!newValue.includes(opt.value))
                                      newValue.push(opt.value);
                                  } else {
                                    newValue = newValue.filter(
                                      (v) => v !== opt.value
                                    );
                                  }
                                  handleFieldChange(field.id, newValue);
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
                    return (
                      <div key={field.id} className="flex flex-col">
                        <Label className="text-sm font-medium mb-1">
                          {field.label}
                        </Label>
                        <Select
                          value={value}
                          onValueChange={(val) =>
                            handleFieldChange(field.id, val)
                          }
                        >
                          <SelectTrigger className="border rounded px-2 py-1 bg-white">
                            <SelectValue placeholder="Search for a worker..." />
                          </SelectTrigger>
                          <SelectContent>
                            {options.map((opt: OptionType) => (
                              <SelectItem key={opt.id} value={opt.value}>
                                {opt.value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    );
                  case "SEARCH_ASSET":
                    return (
                      <div key={field.id} className="flex flex-col">
                        <Label className="text-sm font-medium mb-1">
                          {field.label}
                        </Label>
                        <Select
                          value={value}
                          onValueChange={(val) =>
                            handleFieldChange(field.id, val)
                          }
                        >
                          <SelectTrigger className="border rounded px-2 py-1 bg-white">
                            <SelectValue placeholder="Search for an asset..." />
                          </SelectTrigger>
                          <SelectContent>
                            {options.map((opt: OptionType) => (
                              <SelectItem key={opt.id} value={opt.value}>
                                {opt.value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    );
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
          <div className="w-full flex flex-row justify-between">
            <div className="flex flex-col">
              <p className="text-lg text-black font-semibold">
                {formTemplate?.name || "N/A"}
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
