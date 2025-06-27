"use client";
import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Types for form building
interface FormField {
  id: string;
  name: string;
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
  helperText?: string;
  options?: string[];
  maxLength?: number;
  order: number;
}

interface FormSettings {
  name: string;
  description: string;
  category: string;
  status: string;
  requireSignature: boolean;
}

const fieldTypes = [
  {
    name: "Text",
    description: "Single line Input",
    icon: "/text.svg",
    color: "bg-sky-400",
  },
  {
    name: "Number",
    description: "Numeric Input",
    icon: "/number.svg",
    color: "bg-fuchsia-400",
  },
  {
    name: "Date",
    description: "Date picker",
    icon: "/date.svg",
    color: "bg-purple-400",
  },
  {
    name: "Time",
    description: "Time picker",
    icon: "/time.svg",
    color: "bg-orange-300",
  },
  {
    name: "Checkbox",
    description: "Yes/No toggle",
    icon: "/checkbox.svg",
    color: "bg-cyan-300",
  },
  {
    name: "Dropdown",
    description: "multiple options",
    icon: "/dropdown.svg",
    color: "bg-red-400",
  },
  {
    name: "Text Area",
    description: "Multi-line Input",
    icon: "/textBox.svg",
    color: "bg-indigo-400",
  },
  {
    name: "Rating",
    description: "Star Rating",
    icon: "/rating.svg",
    color: "bg-yellow-200",
  },
];

export default function FormBuilder({ onCancel }: { onCancel?: () => void }) {
  // Form state
  const [formSettings, setFormSettings] = useState<FormSettings>({
    name: "",
    description: "",
    category: "",
    status: "inactive",
    requireSignature: false,
  });

  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [selectedField, setSelectedField] = useState<FormField | null>(null);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [advancedOptionsOpen, setAdvancedOptionsOpen] = useState<
    Record<string, boolean>
  >({});

  // Add field to form
  const addField = (fieldType: string) => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      name: `${fieldType.toLowerCase().replace(/\s+/g, "_")}_${
        formFields.length + 1
      }`,
      label: `${fieldType} Field`,
      type: fieldType.toLowerCase().replace(/\s+/g, "_"),
      required: false,
      placeholder: "",
      helperText: "",
      options: fieldType === "Dropdown" ? ["Option 1"] : undefined,
      maxLength: fieldType === "Text" ? 100 : undefined,
      order: formFields.length,
    };
    setFormFields([...formFields, newField]);
  };

  // Remove field from form
  const removeField = (fieldId: string) => {
    setFormFields(formFields.filter((field) => field.id !== fieldId));
    if (selectedField?.id === fieldId) {
      setSelectedField(null);
      setEditingFieldId(null);
    }
    // Clean up advanced options state
    setAdvancedOptionsOpen((prev) => {
      const newState = { ...prev };
      delete newState[fieldId];
      return newState;
    });
  };

  // Toggle advanced options for a field
  const toggleAdvancedOptions = (fieldId: string) => {
    setAdvancedOptionsOpen((prev) => ({
      ...prev,
      [fieldId]: !prev[fieldId],
    }));
  };

  // Update field
  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setFormFields(
      formFields.map((field) =>
        field.id === fieldId ? { ...field, ...updates } : field
      )
    );
    if (selectedField?.id === fieldId) {
      setSelectedField({ ...selectedField, ...updates });
    }
  };

  // Update form settings
  const updateFormSettings = (
    key: keyof FormSettings,
    value: string | boolean
  ) => {
    setFormSettings({ ...formSettings, [key]: value });
  };

  // Move field up/down
  const moveField = (fieldId: string, direction: "up" | "down") => {
    const fieldIndex = formFields.findIndex((f) => f.id === fieldId);
    if (
      (direction === "up" && fieldIndex === 0) ||
      (direction === "down" && fieldIndex === formFields.length - 1)
    ) {
      return;
    }

    const newFields = [...formFields];
    const targetIndex = direction === "up" ? fieldIndex - 1 : fieldIndex + 1;
    [newFields[fieldIndex], newFields[targetIndex]] = [
      newFields[targetIndex],
      newFields[fieldIndex],
    ];

    // Update order
    newFields.forEach((field, index) => {
      field.order = index;
    });

    setFormFields(newFields);
  };

  // Save form to database
  const saveForm = async () => {
    if (!formSettings.name.trim()) {
      alert("Please enter a form name");
      return;
    }

    try {
      const { saveFormTemplate } = await import("@/actions/records-forms");

      // Get company ID from current session/user - in this system it's hardcoded as "1"
      const companyId = "1"; // Based on the codebase pattern

      const payload = {
        settings: formSettings,
        fields: formFields,
        companyId,
      };

      const result = await saveFormTemplate(payload);

      if (result.success) {
        alert("Form saved successfully!");
        console.log("Saved form:", result);
        // Reset form or redirect
        setFormSettings({
          name: "",
          description: "",
          category: "",
          status: "inactive",
          requireSignature: false,
        });
        setFormFields([]);
        setSelectedField(null);
      } else {
        alert(`Failed to save form: ${result.error}`);
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Error saving form");
    }
  };

  // Render field preview
  const renderFieldPreview = (field: FormField) => {
    const baseProps = {
      placeholder: field.placeholder,
      className: "w-full bg-white rounded-lg text-xs",
      disabled: true,
    };

    switch (field.type) {
      case "text":
        return <Input {...baseProps} />;
      case "number":
        return <Input {...baseProps} type="number" />;
      case "date":
        return <Input {...baseProps} type="date" />;
      case "time":
        return <Input {...baseProps} type="time" />;
      case "text_area":
        return <Textarea {...baseProps} rows={3} />;
      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <input type="checkbox" disabled className="rounded" />
            <span className="text-xs">Checkbox option</span>
          </div>
        );
      case "dropdown":
        return (
          <Select disabled>
            <SelectTrigger className="w-full bg-white rounded-lg text-xs">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
          </Select>
        );
      case "rating":
        return (
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <img key={star} src="/star.svg" alt="star" className="w-4 h-4" />
            ))}
          </div>
        );
      default:
        return <Input {...baseProps} />;
    }
  };

  return (
    <div className="w-full h-full flex flex-col row-span-2">
      {/* Action Buttons */}
      <div className="h-12 flex flex-row items-center w-full gap-4 px-2 mb-4">
        <Button
          variant={"outline"}
          size={"sm"}
          className="bg-red-300 border-none"
          onClick={onCancel}
        >
          <div className="flex flex-row items-center">
            <img
              src="/statusDenied.svg"
              alt="Cancel Icon"
              className="w-3 h-3 mr-2"
            />
            <p className="text-xs">Cancel</p>
          </div>
        </Button>
        <Button
          variant={"outline"}
          size={"sm"}
          className="bg-sky-400 border-none"
          onClick={saveForm}
          disabled={!formSettings.name.trim()}
        >
          <div className="flex flex-row items-center">
            <img
              src="/formSave.svg"
              alt="Save Icon"
              className="w-3 h-3 mr-2 "
            />
            <p className="text-xs">Save</p>
          </div>
        </Button>
        {!formSettings.name.trim() && (
          <p className="text-xs text-red-500 flex items-start">
            Please enter a form name to save
          </p>
        )}
      </div>

      {/* Form Builder Content */}
      <div className="w-full flex-1 grid grid-cols-[275px_1fr_250px] px-2">
        <ScrollArea className="w-full h-full bg-white bg-opacity-40 rounded-tl-lg rounded-bl-lg  relative">
          <Tabs defaultValue="settings" className="w-full h-full p-4 ">
            <TabsList className="w-full">
              <TabsTrigger
                value="settings"
                className="w-full text-xs data-[state=active]:bg-sky-400 py-2 "
              >
                Settings
              </TabsTrigger>
              <TabsTrigger
                value="preview"
                className="w-full text-xs data-[state=active]:bg-sky-400 py-2 "
              >
                Preview
              </TabsTrigger>
            </TabsList>
            <TabsContent value="settings">
              <div className="flex flex-col mt-4">
                <Label htmlFor="name" className="text-xs ">
                  Form Name
                </Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formSettings.name}
                  onChange={(e) => updateFormSettings("name", e.target.value)}
                  placeholder="Enter Form Name"
                  className="mb-4 bg-white rounded-lg text-xs"
                />
              </div>
              <div className=" w-full mb-4">
                <Label htmlFor="description" className="text-xs">
                  Description
                </Label>
                <Textarea
                  placeholder="Describe the purpose of this form"
                  id="description"
                  value={formSettings.description}
                  onChange={(e) =>
                    updateFormSettings("description", e.target.value)
                  }
                  rows={5}
                  maxLength={200}
                  className="bg-white rounded-lg text-xs "
                />
              </div>
              <div className=" w-full mb-4">
                <Label htmlFor="category" className="text-xs">
                  Category
                </Label>
                <Select
                  name="category"
                  value={formSettings.category}
                  onValueChange={(value) =>
                    updateFormSettings("category", value)
                  }
                >
                  <SelectTrigger className="w-full bg-white rounded-lg text-xs">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="safety">Safety</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="inspection">Inspection</SelectItem>
                    <SelectItem value="incident">Incident Report</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className=" w-full mb-6">
                <Label htmlFor="status" className="text-xs">
                  Status
                </Label>
                <Select
                  name="status"
                  value={formSettings.status}
                  onValueChange={(value) => updateFormSettings("status", value)}
                >
                  <SelectTrigger className="w-full bg-white rounded-lg text-xs">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full flex flex-row justify-between items-center ">
                <Label htmlFor="airplane-mode" className="text-xs">
                  Require Signature
                </Label>
                <Switch
                  id="airplane-mode"
                  name="airplane-mode"
                  checked={formSettings.requireSignature}
                  onCheckedChange={(checked) =>
                    updateFormSettings("requireSignature", checked)
                  }
                  className="bg-white  data-[state=unchecked]:bg-neutral-500 data-[state=checked]:bg-sky-400 w-10"
                />
              </div>
            </TabsContent>
            <TabsContent
              value="preview"
              className="w-full h-full flex flex-col gap-5 overflow-auto"
            >
              <div className="w-full h-fit justify-between mt-4 flex flex-row gap-5">
                <div className="w-full h-full px-2 py-1 bg-white flex flex-col justify-center items-center rounded-lg">
                  <p>{formFields.length}</p>
                  <p className="text-xs">Fields</p>
                </div>
                <div className="w-full h-full px-2 py-1 bg-white flex flex-col justify-center items-center rounded-lg">
                  <p>{formFields.filter((f) => f.required).length}</p>
                  <p className="text-xs">Required</p>
                </div>
              </div>
              {formFields.length === 0 ? (
                <div className="w-full h-full  justify-center items-center flex flex-col rounded-lg p-4 mt-6">
                  <img
                    src="/formInspect.svg"
                    alt="Form Preview Placeholder"
                    className="w-full h-6 mb-2"
                  />
                  <p className="text-xs text-gray-500">No fields added yet</p>
                </div>
              ) : (
                <div className="w-full flex flex-col gap-3">
                  {formFields.map((field) => (
                    <div key={field.id} className="bg-white p-3 rounded-lg">
                      <div className="flex flex-row justify-between items-center mb-2">
                        <Label className="text-xs font-medium">
                          {field.label}
                          {field.required && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </Label>
                        <span className="text-xs text-gray-400 capitalize">
                          {field.type.replace("_", " ")}
                        </span>
                      </div>
                      {renderFieldPreview(field)}
                      {field.helperText && (
                        <p className="text-xs text-gray-500 mt-1">
                          {field.helperText}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </ScrollArea>

        <ScrollArea className="w-full h-full bg-white bg-opacity-10 px-4 pt-2 relative">
          {formFields.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center absolute inset-0">
              <img
                src="/formDuplicate.svg"
                alt="Form Builder Placeholder"
                className="w-12 h-12 mb-2"
              />
              <h2 className="text-lg font-semibold mb-2">
                Start Building Your Form
              </h2>
              <p className="text-xs text-gray-500">
                Add fields using the field type buttons on the right, or click
                below to add a text field.
              </p>
              <Button
                variant={"outline"}
                className="mt-4"
                onClick={() => addField("Text")}
              >
                <div className="flex flex-row items-center">
                  <img
                    src="/plus.svg"
                    alt="Add Field Icon"
                    className="w-4 h-4 mr-2"
                  />
                  Add Text Field
                </div>
              </Button>
            </div>
          ) : (
            <div className="w-full px-4">
              <div className="space-y-4">
                {formFields.map((field, index) => (
                  <div
                    key={field.id}
                    className={`bg-white bg-opacity-40 border-none p-4 rounded-lg transition-all duration-200 ${
                      editingFieldId === field.id
                        ? "border-sky-400 shadow-md"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="w-full  flex flex-row items-center gap-x-4 ">
                      {/* Drag handle icon */}
                      <div className="w-fit h-full bg-slate-50">
                        <img
                          src="/dragHandle.svg"
                          alt="Drag Handle"
                          className="w-4 h-4"
                        />
                      </div>
                      {/* Field type icon */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="default"
                            className={`w-fit rounded-md ${
                              field.type === "text"
                                ? "bg-sky-400 hover:bg-sky-300"
                                : field.type === "number"
                                ? "bg-fuchsia-400 hover:bg-fuchsia-300"
                                : field.type === "date"
                                ? "bg-purple-400 hover:bg-purple-300"
                                : field.type === "time"
                                ? "bg-orange-300 hover:bg-orange-200"
                                : field.type === "checkbox"
                                ? "bg-amber-400 hover:bg-amber-300"
                                : field.type === "dropdown"
                                ? "bg-rose-400 hover:bg-rose-300"
                                : field.type === "text_area"
                                ? "bg-lime-400 hover:bg-lime-300"
                                : "bg-gray-400 hover:bg-gray-300"
                            } mb-1`}
                          >
                            <img
                              src={
                                fieldTypes.find((t) => t.name === field.type)
                                  ?.icon
                              }
                              alt={field.type}
                              className="w-4 h-4 object-contain mx-auto "
                            />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          side="right"
                          align="center"
                          sideOffset={0}
                          className="w-80"
                        >
                          <Select
                            value={field.type.replace("_", " ").toLowerCase()}
                            onValueChange={(value) => {
                              const fieldType =
                                value.charAt(0).toUpperCase() + value.slice(1);
                              const typeKey = fieldType
                                .toLowerCase()
                                .replace(/\s+/g, "_");
                              updateField(field.id, {
                                type: typeKey,
                                // Reset type-specific properties when changing type
                                options:
                                  fieldType === "Dropdown"
                                    ? field.options || ["Option 1"]
                                    : undefined,
                                maxLength:
                                  fieldType === "Text"
                                    ? field.maxLength || 100
                                    : undefined,
                              });
                            }}
                          >
                            <SelectTrigger className="w-full bg-white rounded-lg text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {fieldTypes.map((fieldType) => (
                                <SelectItem
                                  key={fieldType.name}
                                  value={fieldType.name.toLowerCase()}
                                >
                                  <div className="flex items-center gap-2">
                                    <div
                                      className={`w-4 h-4 rounded-sm ${fieldType.color}`}
                                    ></div>
                                    {fieldType.name}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </PopoverContent>
                      </Popover>
                      {/* Field label */}
                      <Input
                        value={field.label}
                        onChange={(e) => {
                          updateField(field.id, { label: e.target.value });
                        }}
                        className="bg-white rounded-lg text-xs border-none "
                        placeholder="Enter field label here"
                      />
                      {/* Field Optional / Required */}
                      {field.required ? (
                        <Button
                          variant="default"
                          size="sm"
                          className="text-black bg-red-300 hover:bg-red-200 rounded-lg"
                          onClick={() =>
                            updateField(field.id, { required: false })
                          }
                        >
                          Required
                        </Button>
                      ) : (
                        <Button
                          variant="default"
                          size="sm"
                          className="text-black bg-gray-300 hover:bg-gray-200 rounded-lg"
                          onClick={() =>
                            updateField(field.id, { required: true })
                          }
                        >
                          Optional
                        </Button>
                      )}

                      <Toggle
                        pressed={advancedOptionsOpen[field.id] || false}
                        onPressedChange={() => toggleAdvancedOptions(field.id)}
                      >
                        <img
                          src="/Settings.svg"
                          alt="Toggle Icon"
                          className="w-4 h-4 object-contain mx-auto"
                        />
                      </Toggle>

                      {/* Remove Field Icon */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => removeField(field.id)}
                      >
                        <img
                          src="/trash-red.svg"
                          alt="Remove Field Icon"
                          className="w-5 h-5 object-contain mx-auto "
                        />
                      </Button>
                    </div>

                    {/* Advanced Options Section - Collapsible */}
                    {advancedOptionsOpen[field.id] && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg border-t">
                        <div className="space-y-4">
                          {/* Helper Text */}
                          <div>
                            <Label className="text-xs">Helper Text</Label>
                            <Input
                              value={field.helperText || ""}
                              onChange={(e) =>
                                updateField(field.id, {
                                  helperText: e.target.value,
                                })
                              }
                              className="mt-1 bg-white rounded-lg text-xs"
                              placeholder="Enter helper text"
                            />
                          </div>

                          {/* Field Name */}
                          <div>
                            <Label className="text-xs">
                              Field Name (Internal)
                            </Label>
                            <Input
                              value={field.name}
                              onChange={(e) =>
                                updateField(field.id, { name: e.target.value })
                              }
                              className="mt-1 bg-white rounded-lg text-xs"
                              placeholder="Enter field name"
                            />
                          </div>

                          {/* Type-specific advanced options */}
                          {field.type === "text" && (
                            <div>
                              <Label className="text-xs">Max Length</Label>
                              <Input
                                type="number"
                                value={field.maxLength || ""}
                                onChange={(e) =>
                                  updateField(field.id, {
                                    maxLength:
                                      parseInt(e.target.value) || undefined,
                                  })
                                }
                                className="mt-1 bg-white rounded-lg text-xs w-32"
                                placeholder="Enter max length"
                              />
                            </div>
                          )}

                          {field.type === "dropdown" && (
                            <div>
                              <Label className="text-xs">
                                Dropdown Options
                              </Label>
                              <div className="space-y-2 mt-1">
                                {field.options?.map((option, optionIndex) => (
                                  <div key={optionIndex} className="flex gap-2">
                                    <Input
                                      value={option}
                                      onChange={(e) => {
                                        const newOptions = [
                                          ...(field.options || []),
                                        ];
                                        newOptions[optionIndex] =
                                          e.target.value;
                                        updateField(field.id, {
                                          options: newOptions,
                                        });
                                      }}
                                      className="bg-white rounded-lg text-xs"
                                      placeholder={`Option ${optionIndex + 1}`}
                                    />
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => {
                                        const newOptions =
                                          field.options?.filter(
                                            (_, i) => i !== optionIndex
                                          );
                                        updateField(field.id, {
                                          options: newOptions,
                                        });
                                      }}
                                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                    >
                                      <img
                                        src="/minus.svg"
                                        alt="Remove"
                                        className="w-3 h-3"
                                      />
                                    </Button>
                                  </div>
                                ))}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    const newOptions = [
                                      ...(field.options || []),
                                      `Option ${
                                        (field.options?.length || 0) + 1
                                      }`,
                                    ];
                                    updateField(field.id, {
                                      options: newOptions,
                                    });
                                  }}
                                  className="w-fit"
                                >
                                  <img
                                    src="/plus.svg"
                                    alt="Add"
                                    className="w-3 h-3 mr-2"
                                  />
                                  Add Option
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="w-full  flex flex-row items-center gap-x-4 ">
                      {/* Field Placeholder and Field */}
                      <div className="flex-1">
                        <Input
                          value={field.placeholder || ""}
                          onChange={(e) =>
                            updateField(field.id, {
                              placeholder: e.target.value,
                            })
                          }
                          className="mt-1 bg-white rounded-lg text-xs"
                          placeholder="Enter placeholder text"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {formSettings.requireSignature && (
                <div className="mt-6 p-4 bg-white rounded-lg border-2 border-gray-200">
                  <Label className="text-sm font-medium text-gray-900">
                    Signature *
                  </Label>
                  <div className="mt-2 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <p className="text-xs text-gray-500">Signature area</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
        <div className="w-full h-full bg-white bg-opacity-40 rounded-tr-lg rounded-br-lg ">
          {/* Field Types */}
          <div className="flex flex-row gap-x-4 h-10 w-full items-center my-5 p-4">
            <Button
              variant={"default"}
              size={"icon"}
              className="bg-emerald-300 hover:bg-emerald-200"
            >
              <img src="/plus.svg" alt="Add Field Icon" className="w-4 h-4" />
            </Button>
            <div className="flex flex-col">
              <p className="text-sm font-bold">Field types</p>
              <p className="text-xs">Click to add field</p>
            </div>
          </div>{" "}
          <div className="flex flex-col gap-3 p-4  bg-white">
            {fieldTypes.map((fieldType) => (
              <button
                key={fieldType.name}
                onClick={() => addField(fieldType.name)}
                className="flex flex-row items-center p-3  rounded-md  hover:shadow-md transition-shadow duration-200 hover:bg-gray-50"
              >
                <div
                  className={`w-6 h-6 mr-3 rounded-sm ${fieldType.color} flex items-center justify-center`}
                >
                  {/* <img
                    src={fieldType.icon}
                    alt={fieldType.name}
                    className="w-4 h-4"
                  /> */}
                </div>
                <div className="flex flex-col text-left">
                  <p className="text-sm font-semibold">{fieldType.name}</p>
                  <p className="text-xs text-gray-400">
                    {fieldType.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
