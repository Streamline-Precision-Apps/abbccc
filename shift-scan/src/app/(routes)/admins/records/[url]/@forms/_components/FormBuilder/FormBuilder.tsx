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
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  groupId?: string; // For associating with sections
}

interface FormSection {
  id: string;
  title: string;
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
    name: "text",
    label: "Text",
    description: "Single line Input",
    icon: "/title.svg",
    color: "bg-sky-400",
    section: "Input",
  },
  {
    name: "number",
    label: "Number",
    description: "Numeric Input",
    icon: "/number.svg",
    color: "bg-fuchsia-400",
    section: "Input",
  },
  {
    name: "date",
    label: "Date",
    description: "Date picker",
    icon: "/calendar.svg",
    color: "bg-purple-400",
    section: "Date & Time",
  },
  {
    name: "time",
    label: "Time",
    description: "Time picker",
    icon: "/clock.svg",
    color: "bg-orange-300",
    section: "Date & Time",
  },
  {
    name: "checkbox",
    label: "Checkbox",
    description: "Yes/No toggle",
    icon: "/statusApproved.svg",
    color: "bg-cyan-300",
    section: "Input",
  },
  {
    name: "dropdown",
    label: "Dropdown",
    description: "Multiple options",
    icon: "/layout.svg",
    color: "bg-red-400",
    section: "Input",
  },
  {
    name: "textarea",
    label: "Text Area",
    description: "Multi-line Input",
    icon: "/formList.svg",
    color: "bg-indigo-400",
    section: "Input",
  },
  {
    name: "rating",
    label: "Rating",
    description: "Star Rating",
    icon: "/star.svg",
    color: "bg-yellow-200",
    section: "Input",
  },
  {
    name: "radio",
    label: "Radio",
    description: "Single choice selection",
    icon: "/radio.svg",
    color: "bg-teal-400",
    section: "Input",
  },
  {
    name: "header",
    label: "Header",
    description: "Large text header",
    icon: "/header.svg",
    color: "bg-blue-500",
    section: "Formatting",
  },
  {
    name: "paragraph",
    label: "Paragraph",
    description: "Text block",
    icon: "/drag.svg",
    color: "bg-green-500",
    section: "Formatting",
  },
  {
    name: "multiselect",
    label: "Multiselect",
    description: "Select multiple options",
    icon: "/moreOptionsCircle.svg",
    color: "bg-yellow-500",
    section: "Input",
  },
  {
    name: "Worker",
    label: "Worker",
    description: "Search and select a worker",
    icon: "/team.svg",
    color: "bg-pink-400",
    section: "Search",
  },

  {
    name: "Asset",
    label: "Asset",
    description: "Search and select an asset",
    icon: "/equipment.svg",
    color: "bg-orange-400",
    section: "Search",
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

  const [popoverOpenFieldId, setPopoverOpenFieldId] = useState<string | null>(
    null
  );
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [formSections, setFormSections] = useState<FormSection[]>([]);
  const [selectedField, setSelectedField] = useState<FormField | null>(null);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [advancedOptionsOpen, setAdvancedOptionsOpen] = useState<
    Record<string, boolean>
  >({});

  // Add field to form
  const addField = (fieldType: string) => {
    if (fieldType === "section") {
      // Create a new section
      const newSection: FormSection = {
        id: `section_${Date.now()}`,
        title: "New Section",
        order: formSections.length,
      };
      setFormSections([...formSections, newSection]);
    } else {
      // Create a regular field
      const typeKey = fieldType;
      const typeDef = fieldTypes.find((t) => t.name === typeKey);
      const newField: FormField = {
        id: `field_${Date.now()}`,
        name: `${typeKey}_${formFields.length + 1}`,
        label: `${typeDef?.label || typeKey} Field`,
        type: typeKey,
        required: false,
        placeholder: "",
        helperText: "",
        options:
          typeKey === "dropdown"
            ? ["Option 1"]
            : typeKey === "radio"
            ? ["Option 1", "Option 2"]
            : undefined,
        maxLength: typeKey === "text" ? 100 : undefined,
        order: formFields.length,
        groupId: undefined, // Can be assigned to a section later
      };
      setFormFields([...formFields, newField]);
    }
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

  // Remove section
  const removeSection = (sectionId: string) => {
    setFormSections(formSections.filter((section) => section.id !== sectionId));
    // Remove groupId from fields that belonged to this section
    setFormFields(
      formFields.map((field) =>
        field.groupId === sectionId ? { ...field, groupId: undefined } : field
      )
    );
  };

  // Update section
  const updateSection = (sectionId: string, updates: Partial<FormSection>) => {
    setFormSections(
      formSections.map((section) =>
        section.id === sectionId ? { ...section, ...updates } : section
      )
    );
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
      case "radio":
        return (
          <div className="flex flex-col space-y-2">
            {(field.options || ["Option 1", "Option 2"]).map(
              (option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    disabled
                    className="rounded-full"
                    name={`radio-${field.id}`}
                  />
                  <span className="text-xs">{option}</span>
                </div>
              )
            )}
          </div>
        );
      case "search_person":
        return (
          <div className="flex items-center bg-white rounded-lg border px-2 py-1">
            <img
              src="/searchLeft.svg"
              alt="search"
              className="w-4 h-4 mr-2 opacity-60"
            />
            <Input
              type="text"
              className="w-full bg-transparent text-xs outline-none"
              placeholder="Search for a person..."
              disabled
            />
          </div>
        );
      case "search_asset":
        return (
          <div className="flex items-center bg-white rounded-lg border px-2 py-1">
            <img
              src="/searchLeft.svg"
              alt="search"
              className="w-4 h-4 mr-2 opacity-60"
            />
            <Input
              type="text"
              className="w-full bg-transparent text-xs outline-none"
              placeholder="Search for an asset..."
              disabled
            />
          </div>
        );
      case "header":
        return (
          <h2 className="text-lg font-bold text-gray-800">
            {field.label || "Header"}
          </h2>
        );
      case "paragraph":
        return (
          <p className="text-sm text-gray-700">
            {field.label || "Paragraph text"}
          </p>
        );
      case "multiselect":
        return (
          <>
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="rounded"
                  name={`checkbox-${field.id}`}
                  value={option}
                  checked={false}
                  disabled
                />
                <span className="text-xs">{option}</span>
              </div>
            ))}
          </>
        );
      case "file":
        return (
          <div className="flex items-center">
            <input
              type="file"
              disabled
              className="text-xs file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border file:border-gray-300 file:bg-gray-50"
            />
            <span className="text-xs">No file chosen</span>
          </div>
        );
      default:
        return <Input {...baseProps} />;
    }
  };

  return (
    <>
      {/* Action Buttons */}
      <div className="h-full flex flex-row items-center w-full gap-4 px-2 mb-4">
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
      <div className="w-full h-full grid grid-cols-[275px_1fr_250px] px-2 overflow-y-auto">
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

        <ScrollArea className="w-full h-full bg-white bg-opacity-10 relative ">
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
                onClick={() => addField("text")}
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
            <div className="w-full px-4 py-2">
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
                    {/* Top portion of field */}
                    <div className="w-full flex flex-row items-center gap-2 mb-2">
                      {/* Drag handle icon */}
                      <div className="w-fit h-full bg-transparent flex items-center justify-center">
                        <img
                          src="/dragFormBuilder.svg"
                          alt="Drag Handle"
                          className="w-6 h-6 object-contain cursor-move "
                        />
                      </div>
                      {/* Field type icon */}
                      <div className="w-fit h-full">
                        <Popover
                          open={popoverOpenFieldId === field.id}
                          onOpenChange={(open) =>
                            setPopoverOpenFieldId(open ? field.id : null)
                          }
                        >
                          <PopoverTrigger asChild>
                            <Button
                              onClick={() => setPopoverOpenFieldId(field.id)}
                              variant="default"
                              className={`w-fit h-full justify-center items-center rounded-md gap-0 ${(() => {
                                const typeDef = fieldTypes.find(
                                  (t) => t.name === field.type
                                );
                                return typeDef
                                  ? `${typeDef.color} hover:${typeDef.color
                                      .replace("bg-", "bg-")
                                      .replace("400", "300")
                                      .replace("500", "400")
                                      .replace("200", "100")}`
                                  : "bg-gray-400 hover:bg-gray-300";
                              })()} `}
                            >
                              <img
                                src={
                                  fieldTypes.find((t) => t.name === field.type)
                                    ?.icon
                                }
                                alt={field.type}
                                className="w-4 h-4 "
                              />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            side="right"
                            align="start"
                            sideOffset={0}
                            className="w-80 h-[60vh] overflow-y-auto p-4 gap-2 bg-white rounded-lg shadow-lg"
                          >
                            <div className="flex flex-col gap-1">
                              <p className="text-sm font-semibold">
                                Select Field Type
                              </p>
                              {[...fieldTypes]
                                .sort((a, b) => a.label.localeCompare(b.label))
                                .map((fieldType) => (
                                  <button
                                    key={fieldType.name}
                                    type="button"
                                    className={`flex items-center w-full px-2 py-2 rounded hover:bg-gray-100 gap-2 ${
                                      fieldType.name === field.type
                                        ? "ring-2 ring-sky-400"
                                        : ""
                                    }`}
                                    onClick={() => {
                                      updateField(field.id, {
                                        type: fieldType.name,
                                        options:
                                          fieldType.name === "dropdown"
                                            ? field.options || ["Option 1"]
                                            : fieldType.name === "radio"
                                            ? field.options || [
                                                "Option 1",
                                                "Option 2",
                                              ]
                                            : undefined,
                                        maxLength:
                                          fieldType.name === "text"
                                            ? field.maxLength || 100
                                            : undefined,
                                      });
                                      setPopoverOpenFieldId(null);
                                    }}
                                  >
                                    <div
                                      className={`w-6 h-6 flex justify-center items-center rounded-sm ${fieldType.color}`}
                                    >
                                      <img
                                        src={fieldType.icon}
                                        alt={fieldType.label}
                                        className="w-4 h-4 object-contain"
                                      />
                                    </div>
                                    <div className="flex flex-col text-left">
                                      <span className="text-sm font-medium">
                                        {fieldType.label}
                                      </span>
                                      <span className="text-xs text-gray-400 ">
                                        {fieldType.description}
                                      </span>
                                    </div>
                                  </button>
                                ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                      {/* Field label */}
                      <div className="flex-1 h-full">
                        <Input
                          type="text"
                          value={field.label}
                          onChange={(e) => {
                            updateField(field.id, { label: e.target.value });
                          }}
                          className="bg-white rounded-lg text-xs border-none "
                          placeholder="Enter field label here"
                        />
                      </div>

                      <Toggle
                        className=""
                        pressed={advancedOptionsOpen[field.id] || false}
                        onPressedChange={() => toggleAdvancedOptions(field.id)}
                      >
                        <div className="text-black bg-gray-300 hover:bg-gray-200 rounded-lg py-2 px-3">
                          <p className="text-xs">Advance Options</p>
                        </div>
                      </Toggle>

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
                    {field.type !== "date" &&
                      field.type !== "time" &&
                      field.type !== "header" &&
                      field.type !== "paragraph" &&
                      field.type !== "radio" &&
                      field.type !== "rating" &&
                      field.type !== "checkbox" &&
                      field.type !== "multiselect" &&
                      field.type !== "dropdown" && (
                        <div className="w-full  flex flex-row items-center gap-x-4 mb-3 ">
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
                      )}

                    {advancedOptionsOpen[field.id] && (
                      <>
                        <Separator />
                        <p className="text-sm font-semibold mt-2">
                          Advanced Options
                        </p>
                      </>
                    )}
                    {/* Advanced Options Section - Collapsible */}
                    {advancedOptionsOpen[field.id] && (
                      <div className="mt-1  p-3 bg-gray-50 rounded-lg border-t ">
                        <div className="space-y-2">
                          {/* Helper Text */}
                          <div>
                            <Label className="text-xs">
                              Helper Text (Below Input Field)
                            </Label>
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

                          {/* Type-specific advanced options */}
                          {field.type === "text" && (
                            <>
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
                            </>
                          )}

                          {field.type === "multiselect" && (
                            <div className="pt-2">
                              <div className="flex justify-between items-center">
                                <Label className="text-xs">
                                  Multiselect Options
                                </Label>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    const newOptions = [
                                      ...(field.options || []),
                                      "",
                                    ];
                                    updateField(field.id, {
                                      options: newOptions,
                                    });
                                  }}
                                  className="w-fit bg-green-300"
                                >
                                  <img
                                    src="/plus.svg"
                                    alt="Add"
                                    className="w-3 h-3 mr-2"
                                  />
                                  Add Option
                                </Button>
                              </div>
                              <div className="space-y-2 mt-2">
                                {field.options?.map((option, optionIndex) => (
                                  <div key={optionIndex} className="flex gap-2">
                                    <div className="flex items-center">
                                      <p>{optionIndex + 1}. </p>
                                    </div>
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
                                        src="/trash-red.svg"
                                        alt="Remove"
                                        className="w-4 h-4 object-contain mx-auto "
                                      />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {field.type === "dropdown" && (
                            <div className="pt-2">
                              <div className="flex justify-between items-center">
                                <Label className="text-xs">
                                  Dropdown Options
                                </Label>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    const newOptions = [
                                      ...(field.options || []),
                                      "",
                                    ];
                                    updateField(field.id, {
                                      options: newOptions,
                                    });
                                  }}
                                  className="w-fit bg-green-300"
                                >
                                  <img
                                    src="/plus.svg"
                                    alt="Add"
                                    className="w-3 h-3 mr-2"
                                  />
                                  Add Option
                                </Button>
                              </div>
                              <div className="space-y-2 mt-2">
                                {field.options?.map((option, optionIndex) => (
                                  <div key={optionIndex} className="flex gap-2">
                                    <div className="flex items-center">
                                      <p>{optionIndex + 1}. </p>
                                    </div>
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
                                        src="/trash-red.svg"
                                        alt="Remove"
                                        className="w-4 h-4 object-contain mx-auto "
                                      />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {field.type === "radio" && (
                            <div className="pt-2">
                              <div className="flex justify-between items-center">
                                <Label className="text-xs">
                                  Radio Button Options
                                </Label>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    const newOptions = [
                                      ...(field.options || []),
                                      "",
                                    ];
                                    updateField(field.id, {
                                      options: newOptions,
                                    });
                                  }}
                                  className="w-fit bg-green-300"
                                >
                                  <img
                                    src="/plus.svg"
                                    alt="Add"
                                    className="w-3 h-3 mr-2"
                                  />
                                  Add Option
                                </Button>
                              </div>
                              <div className="space-y-2 mt-2">
                                {field.options?.map((option, optionIndex) => (
                                  <div key={optionIndex} className="flex gap-2">
                                    <div className="flex items-center">
                                      <p>{optionIndex + 1}. </p>
                                    </div>
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
                                        src="/trash-red.svg"
                                        alt="Remove"
                                        className="w-4 h-4 object-contain mx-auto "
                                      />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {formSettings.requireSignature && (
                <div className="mt-2  py-3 flex flex-row bg-white bg-opacity-40 rounded-lg  items-center">
                  <div className="bg-lime-300 h-10 w-10 flex items-center justify-center rounded-md mx-4">
                    <img
                      src="/formEdit.svg"
                      alt="Signature Icon"
                      className="w-4 h-4 object-contain"
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold">Digital Signature</p>
                    <p className="text-xs">Automatically added at form end</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        <ScrollArea className="w-full h-full bg-white bg-opacity-40 rounded-tr-lg rounded-br-lg ">
          {/* Field Types */}
          <div className="flex flex-row gap-x-4 h-10 w-full items-center my-3 p-4">
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
          </div>
          <Accordion type="multiple" className="p-4 bg-white">
            {Array.from(
              fieldTypes.reduce((acc, fieldType) => {
                const section = fieldType.section || "Other";
                if (!acc.has(section)) acc.set(section, []);
                acc.get(section).push(fieldType);
                return acc;
              }, new Map())
            ).map(([section, types]) => (
              <AccordionItem key={section} value={section}>
                <AccordionTrigger className="text-xs font-semibold">
                  {section}
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-1">
                  {[...types]
                    .sort((a, b) => a.label.localeCompare(b.label))
                    .map((fieldType) => (
                      <button
                        key={fieldType.name}
                        onClick={() => addField(fieldType.name)}
                        className="flex flex-row items-center p-2 rounded-md hover:shadow-md transition-shadow duration-200 hover:bg-gray-50"
                      >
                        <div
                          className={`w-8 h-8 mr-3 rounded-sm ${fieldType.color} flex items-center justify-center`}
                        >
                          <img
                            src={fieldType.icon}
                            alt={fieldType.label}
                            className="w-4 h-4"
                          />
                        </div>
                        <div className="flex flex-col text-left">
                          <p className="text-sm font-semibold">
                            {fieldType.label}
                          </p>
                          <p className="text-xs text-gray-400">
                            {fieldType.description}
                          </p>
                        </div>
                      </button>
                    ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollArea>
      </div>
    </>
  );
}
