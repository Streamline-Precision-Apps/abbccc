"use client";
import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { FormBuilderPanelLeft } from "./FormBuilderPanelLeft";
import { FormBuilderPanelRight } from "./FormBuilderPanelRight";
import { Textarea } from "@/components/ui/textarea";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Types for form building
export interface FormField {
  id: string;
  label: string;
  type: string;
  required: boolean;
  order: number;
  placeholder?: string;
  minLength?: number; // Added for number fields
  maxLength?: number;
  content?: string;
  headerSize?: string;
  groupId?: string; // For associating with sections
  options?: string[];
}
export interface FormSection {
  id: string;
  title: string;
  order: number;
}
export interface FormSettings {
  name: string;
  description: string;
  category: string;
  status: string;
  requireSignature: boolean;
}
export const fieldTypes = [
  {
    name: "text",
    label: "Text",
    description: "Single line Input",
    icon: "/title.svg",
    color: "bg-sky-400",
  },
  {
    name: "number",
    label: "Number",
    description: "Numeric Input",
    icon: "/number.svg",
    color: "bg-fuchsia-400",
  },
  {
    name: "date",
    label: "Date",
    description: "Date picker",
    icon: "/calendar.svg",
    color: "bg-purple-400",
  },
  {
    name: "time",
    label: "Time",
    description: "Time picker",
    icon: "/clock.svg",
    color: "bg-orange-300",
  },

  {
    name: "dropdown",
    label: "Dropdown",
    description: "Multiple options",
    icon: "/layout.svg",
    color: "bg-red-400",
  },
  {
    name: "textarea",
    label: "Text Area",
    description: "Multi-line Input",
    icon: "/formList.svg",
    color: "bg-indigo-400",
  },
  {
    name: "rating",
    label: "Rating",
    description: "Star Rating",
    icon: "/star.svg",
    color: "bg-yellow-200",
  },
  {
    name: "radio",
    label: "Radio",
    description: "Single choice selection",
    icon: "/radio.svg",
    color: "bg-teal-400",
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
  },
  {
    name: "Worker",
    label: "Worker",
    description: "Search and select a worker",
    icon: "/team.svg",
    color: "bg-pink-400",
  },

  {
    name: "Asset",
    label: "Asset",
    description: "Search and select an asset",
    icon: "/equipment.svg",
    color: "bg-orange-400",
  },
];

function SortableItem({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id,
    });

  const style = {
    transform: CSS.Transform.toString({
      x: 0, // Restrict drag to Y-axis
      y: transform?.y || 0,
      scaleX: 1,
      scaleY: 1,
    }),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

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
      const newField: FormField = {
        id: `field_${Date.now()}`,
        label: "",
        type: typeKey,
        required: false,
        placeholder: "",
        options:
          typeKey === "dropdown" ? [] : typeKey === "radio" ? [] : undefined,
        minLength: undefined,
        maxLength: undefined,
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

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setFormFields((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <>
      {/* Action Buttons */}

      <div className="h-[3vh] flex flex-row items-center w-full gap-4 px-2 mb-4">
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
      <div className="w-full h-[80vh] grid grid-cols-[275px_1fr_250px] px-2 overflow-y-auto">
        <FormBuilderPanelLeft
          formFields={formFields}
          formSettings={formSettings}
          updateFormSettings={updateFormSettings}
        />
        <ScrollArea className="w-full h-full bg-white bg-opacity-10 relative ">
          {/* Form Builder Placeholder */}
          {formFields.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center absolute inset-0">
              <img
                src="/formDuplicate.svg"
                alt="Form Builder Placeholder"
                className="w-12 h-12 mb-2 select-none"
                draggable="false"
              />
              <h2 className="text-lg font-semibold mb-2 select-none">
                Start Building Your Form
              </h2>
              <p className="text-xs text-gray-500 select-none">
                Add fields using the field type buttons on the right, or click
                below to add a text field.
              </p>
              <Button
                variant={"outline"}
                className="mt-4"
                onClick={() => addField("text")}
              >
                <div className="flex flex-row items-center ">
                  <img
                    src="/plus.svg"
                    alt="Add Field Icon"
                    className="w-4 h-4 mr-2 select-none "
                    draggable="false"
                  />
                  <p className="text-xs select-none">Add Text Field</p>
                </div>
              </Button>
            </div>
          ) : (
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={formFields.map((field) => field.id)}>
                <div className="w-full px-4 py-2">
                  <div className="space-y-4">
                    {formFields.map((field, index) => (
                      <SortableItem key={field.id} id={field.id}>
                        <div
                          className={`bg-white bg-opacity-40 border-none px-4 py-2 rounded-lg transition-all duration-200 ${
                            editingFieldId === field.id
                              ? "border-sky-400 shadow-md"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          key={field.id}
                        >
                          {/* Top portion of field */}
                          <div className="w-full flex flex-row items-center gap-2">
                            {/* Drag handle icon */}

                            <div className="w-fit h-full bg-transparent flex flex-col items-center justify-center">
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
                                    onClick={() =>
                                      setPopoverOpenFieldId(field.id)
                                    }
                                    variant="default"
                                    className={`w-fit h-full justify-center items-center rounded-md gap-0 ${(() => {
                                      const typeDef = fieldTypes.find(
                                        (t) => t.name === field.type
                                      );
                                      return typeDef
                                        ? `${
                                            typeDef.color
                                          } hover:${typeDef.color
                                            .replace("bg-", "bg-")
                                            .replace("400", "300")
                                            .replace("500", "400")
                                            .replace("200", "100")}`
                                        : "bg-gray-400 hover:bg-gray-300";
                                    })()} `}
                                  >
                                    <img
                                      src={
                                        fieldTypes.find(
                                          (t) => t.name === field.type
                                        )?.icon
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
                                      .sort((a, b) =>
                                        a.label.localeCompare(b.label)
                                      )
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
                                                  ? field.options || [
                                                      "Option 1",
                                                    ]
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
                            {field.type === "header" ||
                            field.type === "paragraph" ? (
                              <div className="flex-1 h-full">
                                <Textarea
                                  value={field.content || ""}
                                  onChange={(e) => {
                                    updateField(field.id, {
                                      content: e.target.value,
                                    });
                                  }}
                                  className="bg-white rounded-lg text-xs border-none "
                                  placeholder={
                                    field.type === "header"
                                      ? "Enter Heading"
                                      : "Enter Paragraph"
                                  }
                                />
                              </div>
                            ) : (
                              <div className="flex-1 h-full">
                                <Input
                                  type="text"
                                  value={field.label}
                                  onChange={(e) => {
                                    updateField(field.id, {
                                      label: e.target.value,
                                    });
                                  }}
                                  className="bg-white rounded-lg text-xs border-none "
                                  placeholder="Enter Question Label here"
                                />
                              </div>
                            )}

                            {field.type !== "rating" &&
                              field.type !== "date" &&
                              field.type !== "time" &&
                              field.type !== "Worker" && (
                                <Toggle
                                  className="px-2 bg-gray-200 rounded-lg text-black hover:bg-gray-100"
                                  pressed={
                                    advancedOptionsOpen[field.id] || false
                                  }
                                  onPressedChange={() =>
                                    toggleAdvancedOptions(field.id)
                                  }
                                >
                                  <p className="text-xs ">Options</p>
                                </Toggle>
                              )}
                            {/* Field Optional / Required */}
                            {field.type !== "header" &&
                              field.type !== "paragraph" && (
                                <>
                                  {field.required ? (
                                    <Button
                                      variant="default"
                                      size="sm"
                                      className="text-black bg-red-300 hover:bg-red-200 rounded-lg"
                                      onClick={() =>
                                        updateField(field.id, {
                                          required: false,
                                        })
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
                                        updateField(field.id, {
                                          required: true,
                                        })
                                      }
                                    >
                                      Optional
                                    </Button>
                                  )}
                                </>
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

                          {/* Advanced Options Section - Collapsible */}
                          {advancedOptionsOpen[field.id] &&
                            !["date", "time"].includes(field.type) && (
                              <>
                                {field.type === "Asset" && (
                                  <>
                                    <Separator className="bg-black my-2" />
                                    <p className="text-sm font-semibold">
                                      Select an Asset Type
                                    </p>
                                    <div className="bg-white px-4 py-2 rounded-md flex flex-row gap-4 my-2">
                                      {[
                                        "Equipment",
                                        "Jobsites",
                                        "Cost Codes",
                                        "Clients",
                                      ].map((type) => (
                                        <div
                                          key={type}
                                          className="flex flex-row items-center gap-1 font-normal"
                                        >
                                          <Input
                                            id={`assetType_${field.id}_${type}`}
                                            name={`assetType_${field.id}`}
                                            value={type}
                                            type="radio"
                                            className="w-fit"
                                            checked={
                                              field.options &&
                                              field.options[0] === type
                                            }
                                            onChange={() => {
                                              updateField(field.id, {
                                                options: [type],
                                              });
                                            }}
                                          />
                                          <label
                                            htmlFor={`assetType_${field.id}_${type}`}
                                            className="text-xs font-semibold"
                                          >
                                            {type.charAt(0).toUpperCase() +
                                              type.slice(1)}
                                          </label>
                                        </div>
                                      ))}
                                    </div>
                                  </>
                                )}
                                {field.type === "text" && (
                                  <>
                                    <Separator className="my-2" />
                                    <p className="text-sm font-semibold">
                                      Character Limits (Optional)
                                    </p>
                                    <div className="flex flex-row gap-2 mt-2">
                                      <div>
                                        <Label className="text-xs font-normal">
                                          Min Length
                                        </Label>
                                        <Input
                                          type="number"
                                          value={field.minLength || ""}
                                          onChange={(e) =>
                                            updateField(field.id, {
                                              minLength:
                                                parseInt(e.target.value) ||
                                                undefined,
                                            })
                                          }
                                          className="bg-white rounded-lg text-xs w-fit"
                                          placeholder="Enter min length"
                                        />
                                      </div>
                                      <div>
                                        <Label className="text-xs font-normal">
                                          Max Length
                                        </Label>
                                        <Input
                                          type="number"
                                          value={field.maxLength || ""}
                                          onChange={(e) =>
                                            updateField(field.id, {
                                              maxLength:
                                                parseInt(e.target.value) ||
                                                undefined,
                                            })
                                          }
                                          className="bg-white rounded-lg text-xs w-fit"
                                          placeholder="Enter max length"
                                        />
                                      </div>
                                    </div>
                                  </>
                                )}
                                {field.type === "number" && (
                                  <div>
                                    <Separator className="my-2" />
                                    <p className="text-sm font-semibold mb-2">
                                      Number Range (Optional)
                                    </p>
                                    <div className="flex flex-row gap-2">
                                      <div>
                                        <Label className="text-xs">
                                          Min amount
                                        </Label>
                                        <Input
                                          type="number"
                                          value={field.minLength || ""}
                                          onChange={(e) =>
                                            updateField(field.id, {
                                              minLength:
                                                parseInt(e.target.value) ||
                                                undefined,
                                            })
                                          }
                                          className="mt-1 bg-white rounded-lg text-xs w-fit"
                                          placeholder="Enter min amount"
                                        />
                                      </div>
                                      <div>
                                        <Label className="text-xs">
                                          Max amount
                                        </Label>
                                        <Input
                                          type="number"
                                          value={field.maxLength || ""}
                                          onChange={(e) =>
                                            updateField(field.id, {
                                              maxLength:
                                                parseInt(e.target.value) ||
                                                undefined,
                                            })
                                          }
                                          className="mt-1 bg-white rounded-lg text-xs w-fit"
                                          placeholder="Enter max amount"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                )}
                                {field.type === "dropdown" && (
                                  <div className="mb-2 flex flex-col gap-2">
                                    <Separator className="my-2" />
                                    <div className="flex justify-between items-center">
                                      <p className="text-sm font-semibold ">
                                        Dropdown Options
                                      </p>
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
                                    {field.options &&
                                      field.options.length > 0 && (
                                        <div className="flex flex-col gap-2 mt-2">
                                          {field.options?.map(
                                            (option, optionIndex) => (
                                              <div
                                                key={optionIndex}
                                                className="flex gap-2"
                                              >
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
                                                  placeholder={`Option ${
                                                    optionIndex + 1
                                                  }`}
                                                />
                                                <Button
                                                  size="sm"
                                                  variant="ghost"
                                                  onClick={() => {
                                                    const newOptions =
                                                      field.options?.filter(
                                                        (_, i) =>
                                                          i !== optionIndex
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
                                            )
                                          )}
                                        </div>
                                      )}
                                  </div>
                                )}
                                {field.type === "textarea" && (
                                  <div>
                                    <Separator className="my-2" />
                                    <p className="text-sm font-semibold">
                                      Character Limits (Optional)
                                    </p>
                                    <div className="flex flex-row mt-2 gap-2">
                                      <div className="flex flex-col">
                                        <Label className="text-xs font-normal">
                                          Min Length
                                        </Label>
                                        <Input
                                          type="number"
                                          value={field.minLength || ""}
                                          onChange={(e) =>
                                            updateField(field.id, {
                                              minLength:
                                                parseInt(e.target.value) ||
                                                undefined,
                                            })
                                          }
                                          className="bg-white rounded-lg text-xs w-48"
                                          placeholder="Enter min length"
                                        />
                                      </div>
                                      <div className="flex flex-col">
                                        <Label className="text-xs font-normal">
                                          Max Length
                                        </Label>
                                        <Input
                                          type="number"
                                          value={field.maxLength || ""}
                                          onChange={(e) =>
                                            updateField(field.id, {
                                              maxLength:
                                                parseInt(e.target.value) ||
                                                undefined,
                                            })
                                          }
                                          className="bg-white rounded-lg text-xs w-48"
                                          placeholder="Enter max length"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {field.type === "radio" && (
                                  <div className="mt-2">
                                    <Separator className="my-2" />
                                    <div className="flex justify-between items-center">
                                      <p className="text-sm font-semibold ">
                                        Options
                                      </p>
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
                                      {field.options?.map(
                                        (option, optionIndex) => (
                                          <div
                                            key={optionIndex}
                                            className="flex gap-2"
                                          >
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
                                              placeholder={`Option ${
                                                optionIndex + 1
                                              }`}
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
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}
                                {field.type === "multiselect" && (
                                  <div>
                                    <Separator className="my-2" />
                                    <div className="flex justify-between items-start">
                                      <p className="text-sm font-semibold">
                                        Multiselect Options
                                      </p>
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
                                      {field.options?.map(
                                        (option, optionIndex) => (
                                          <div
                                            key={optionIndex}
                                            className="flex gap-2"
                                          >
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
                                              placeholder={`Option ${
                                                optionIndex + 1
                                              }`}
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
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}
                                {field.type === "header" && (
                                  <div className="flex flex-col gap-2 mt-2">
                                    <Separator className="bg-black" />
                                    <p className="text-sm font-semibold">
                                      Heading Content
                                    </p>
                                    <div className="w-fit flex flex-row gap-4 items-center">
                                      {["H1", "H2", "H3", "H4", "H5", "H6"].map(
                                        (heading) => (
                                          <div
                                            key={heading}
                                            className="flex flex-row gap-2 items-center"
                                          >
                                            <Input
                                              type="radio"
                                              id={heading}
                                              name="headingType"
                                              className="rounded-lg w-fit "
                                              checked={
                                                field.headerSize === heading
                                              }
                                              onChange={() =>
                                                updateField(field.id, {
                                                  headerSize: heading,
                                                })
                                              }
                                            />
                                            <Label
                                              htmlFor={heading}
                                              className="text-xs"
                                            >
                                              {heading}
                                            </Label>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}
                                {field.type === "paragraph" && (
                                  <div className="flex flex-col gap-2 mt-2">
                                    <Separator className="bg-black" />
                                    <p className="text-sm font-semibold">
                                      Paragraph Content
                                    </p>
                                    <div className="w-fit flex flex-row gap-4 items-center">
                                      {["P1", "P2", "P3", "P4", "P5", "P6"].map(
                                        (paragraph) => (
                                          <div
                                            key={paragraph}
                                            className="flex flex-row gap-2 items-center"
                                          >
                                            <Input
                                              type="radio"
                                              id={paragraph}
                                              name="paragraphType"
                                              className="rounded-lg w-fit "
                                              checked={
                                                field.headerSize === paragraph
                                              }
                                              onChange={() =>
                                                updateField(field.id, {
                                                  headerSize: paragraph,
                                                })
                                              }
                                            />
                                            <Label
                                              htmlFor={paragraph}
                                              className="text-xs"
                                            >
                                              {paragraph}
                                            </Label>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}
                              </>
                            )}
                        </div>
                      </SortableItem>
                    ))}
                  </div>
                </div>
              </SortableContext>
            </DndContext>
          )}
        </ScrollArea>

        <FormBuilderPanelRight addField={addField} />
      </div>
    </>
  );
}
