"use client";
import React, { useState, useMemo } from "react";
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
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import FormBuilderPlaceholder from "./FormBuilderPlaceholder";
import { toast } from "sonner";
import { saveFormTemplate } from "@/actions/records-forms";
import Spinner from "@/components/(animations)/spinner";
import SortableItem from "./sortableItem";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, X } from "lucide-react";
import { hover } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";

// Types for form building
export interface FormField {
  id: string;
  formGroupingId: string;
  label: string;
  type: string;
  required: boolean;
  order: number;
  placeholder?: string;
  minLength?: number | undefined;
  maxLength?: number | undefined;
  multiple?: boolean;
  content?: string | null;
  filter?: string | null;
  Options?: { id: string; value: string }[];
}

export interface FormGrouping {
  id: string;
  title: string;
  order: number;
  Fields: FormField[];
}

export interface FormSettings {
  id: string;
  companyId: string;
  name: string;
  formType: string;
  description: string;
  status: string;
  requireSignature: boolean;
  isApprovalRequired: boolean;
  createdAt: string;
  updatedAt: string;
  isActive: string;
  isSignatureRequired: boolean;
  FormGrouping: FormGrouping[];
}

export const fieldTypes = [
  {
    name: "TEXT",
    label: "Text",
    description: "Single line Input",
    icon: "/title.svg",
    color: "bg-sky-400",
    hover: "hover:bg-sky-300",
  },
  {
    name: "NUMBER",
    label: "Number",
    description: "Numeric Input",
    icon: "/number.svg",
    color: "bg-fuchsia-400",
    hover: "hover:bg-fuchsia-300",
  },
  {
    name: "DATE",
    label: "Date",
    description: "Date picker",
    icon: "/calendar.svg",
    color: "bg-purple-400",
    hover: "hover:bg-purple-300",
  },
  {
    name: "TIME",
    label: "Time",
    description: "Time picker",
    icon: "/clock.svg",
    color: "bg-orange-300",
    hover: "hover:bg-orange-200",
  },

  {
    name: "DROPDOWN",
    label: "Dropdown",
    description: "Multiple options",
    icon: "/layout.svg",
    color: "bg-red-400",
    hover: "hover:bg-red-300",
  },
  {
    name: "TEXTAREA",
    label: "Text Area",
    description: "Multi-line Input",
    icon: "/formList.svg",
    color: "bg-indigo-400",
    hover: "hover:bg-indigo-300",
  },
  {
    name: "CHECKBOX",
    label: "Checkbox",
    description: "Checkbox",
    icon: "/checkbox.svg",
    color: "bg-green-400",
    hover: "hover:bg-green-300",
  },
  {
    name: "RADIO",
    label: "Radio",
    description: "Single choice selection",
    icon: "/radio.svg",
    color: "bg-teal-400",
    hover: "hover:bg-teal-300",
  },
  {
    name: "MULTISELECT",
    label: "Multiselect",
    description: "Select multiple options",
    icon: "/moreOptionsCircle.svg",
    color: "bg-yellow-500",
    hover: "hover:bg-yellow-400",
  },
  {
    name: "SEARCH_PERSON",
    label: "Worker",
    description: "Search and select a worker",
    icon: "/team.svg",
    color: "bg-pink-400",
    hover: "hover:bg-pink-300",
  },

  {
    name: "SEARCH_ASSET",
    label: "Asset",
    description: "Search and select an asset",
    icon: "/equipment.svg",
    color: "bg-orange-400",
    hover: "hover:bg-orange-300",
  },
];

export default function FormBuilder({ onCancel }: { onCancel?: () => void }) {
  // Form state
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [formSettings, setFormSettings] = useState<FormSettings>({
    id: "",
    companyId: "",
    name: "",
    formType: "",
    description: "",
    status: "",
    requireSignature: false,
    createdAt: "",
    updatedAt: "",
    isActive: "",
    isSignatureRequired: false,
    isApprovalRequired: false,
    FormGrouping: [],
  });

  const [popoverOpenFieldId, setPopoverOpenFieldId] = useState<string | null>(
    null,
  );
  const [loadingSave, setLoadingSave] = useState(false);
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [formSections, setFormSections] = useState<FormGrouping[]>([]);
  const [selectedField, setSelectedField] = useState<FormField | null>(null);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [advancedOptionsOpen, setAdvancedOptionsOpen] = useState<
    Record<string, boolean>
  >({});
  const [validationErrors, setValidationErrors] = useState<
    Record<string, { minError?: string; maxError?: string }>
  >({});

  // Validation: require name, category, and status
  const isValid = useMemo(() => {
    return (
      !!formSettings.name.trim() &&
      !!formSettings.formType &&
      !!formSettings.isActive
      // !!formSettings.description.trim()
    );
  }, [formSettings.name, formSettings.formType, formSettings.isActive]);

  // Updated logic to handle the new `Options` property in the API response
  const updateField = (
    fieldId: string,
    updatedProperties: Partial<FormField>,
  ) => {
    setFormFields((prevFields) =>
      prevFields.map((field) =>
        field.id === fieldId ? { ...field, ...updatedProperties } : field,
      ),
    );

    // If we're updating minLength or maxLength, we may need to clear validation errors
    if ("minLength" in updatedProperties || "maxLength" in updatedProperties) {
      setValidationErrors((prev) => {
        const fieldErrors = prev[fieldId] || {};
        const newErrors = { ...fieldErrors };

        if ("minLength" in updatedProperties) {
          delete newErrors.minError;
        }
        if ("maxLength" in updatedProperties) {
          delete newErrors.maxError;
        }

        return {
          ...prev,
          [fieldId]: newErrors,
        };
      });
    }
  };

  // Add field to form
  const addField = (fieldType: string) => {
    if (fieldType === "section") {
      // Create a new section
      const newSection: FormGrouping = {
        id: `section_${Date.now()}`,
        title: "New Section",
        order: formSections.length,
        Fields: [],
      };
      setFormSections([...formSections, newSection]);
    } else {
      // Create a regular field
      const newField: FormField = {
        id: `field_${Date.now()}`,
        formGroupingId: "",
        label: "",
        type: fieldType,
        required: false,
        order: formFields.length,
        placeholder: "",
        minLength: undefined,
        maxLength: undefined,
        multiple: false,
        content: null,
        filter: null,
      };
      setFormFields([...formFields, newField]);
      // Initialize with no validation errors
      setValidationErrors((prev) => ({
        ...prev,
        [newField.id]: {},
      }));
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
    // Clean up validation errors
    setValidationErrors((prev) => {
      const newState = { ...prev };
      delete newState[fieldId];
      return newState;
    });
  };

  // Update form settings
  const updateFormSettings = (
    key: keyof FormSettings,
    value: string | boolean,
  ) => {
    setFormSettings({ ...formSettings, [key]: value });
  };

  // Save form to database
  const saveForm = async () => {
    if (!formSettings.name.trim()) {
      toast.error("Please enter a form name", { duration: 3000 });
      return;
    }

    try {
      setLoadingSave(true);
      const payload = {
        settings: {
          id: formSettings.id,
          companyId: formSettings.companyId,
          name: formSettings.name,
          formType: formSettings.formType,
          description: formSettings.description,
          status: formSettings.status,
          requireSignature: formSettings.requireSignature,
          createdAt: formSettings.createdAt,
          updatedAt: formSettings.updatedAt,
          isActive: formSettings.isActive,
          isSignatureRequired: formSettings.isSignatureRequired,
          isApprovalRequired: formSettings.isApprovalRequired,
        },
        fields: formFields,
        companyId: formSettings.companyId,
      };

      const result = await saveFormTemplate(payload);

      if (result.success) {
        toast.success("Form saved successfully!", { duration: 3000 });
        setFormSettings({
          id: "",
          companyId: "",
          name: "",
          formType: "",
          description: "",
          status: "",
          requireSignature: false,
          createdAt: "",
          updatedAt: "",
          isActive: "",
          isSignatureRequired: false,
          isApprovalRequired: false,
          FormGrouping: [],
        });
        setFormFields([]);
        setSelectedField(null);
      } else {
        toast.error("Error saving form", { duration: 3000 });
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Error saving form", { duration: 3000 });
    } finally {
      setLoadingSave(false);
    }
  };

  const openCancelModal = () => {
    if (formFields.length === 0 && !formSettings.name) {
      // If no changes made, just exit
      onCancel?.();
      return;
    }
    setShowCancelModal(true);
  };
  const handleExitBuild = () => {
    setShowCancelModal(false);
    onCancel?.();
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
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

      <div className="h-fit w-full flex flex-row  gap-4 mb-4">
        <Button
          variant={"outline"}
          size={"sm"}
          className="bg-red-300 border-none rounded-lg"
          onClick={openCancelModal}
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
          className="bg-sky-400 border-none rounded-lg"
          onClick={saveForm}
          disabled={!isValid}
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
      </div>

      {/* Form Builder Content */}
      <div className="w-full bg-white  h-[85vh] flex flex-row rounded-lg">
        <FormBuilderPanelLeft
          formFields={formFields}
          formSettings={formSettings}
          updateFormSettings={updateFormSettings}
        />
        <div className="w-full h-full flex flex-col relative col-span-1">
          <ScrollArea className="w-full h-full bg-slate-100    border-x border-t border-slate-200">
            {/* Form Builder Placeholder */}
            {fieldTypes && formFields.length === 0 ? (
              <FormBuilderPlaceholder loading={false} addField={addField} />
            ) : (
              <div className="w-full h-full pb-[500px]">
                <DndContext
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext items={formFields.map((field) => field.id)}>
                    <div className="w-full px-4 pt-3  rounded-lg">
                      <div className="space-y-4">
                        {formFields.map((field, index) => (
                          <div
                            key={field.id}
                            className={`bg-white border-slate-200 border px-2 py-2 rounded-lg transition-all duration-200 ${
                              editingFieldId === field.id
                                ? "border-sky-400 shadow-md"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            {/* Top portion of field */}
                            <div className="w-full flex flex-row items-start gap-2">
                              {/* Drag handle icon */}
                              <SortableItem
                                key={field.id}
                                id={field.id}
                                editingFieldId={editingFieldId}
                              >
                                <div className="w-fit h-full bg-transparent flex flex-col p-1 items-center justify-center">
                                  <img
                                    src="/dragDots.svg"
                                    alt="Drag Handle"
                                    className="w-6 h-6 object-contain cursor-move "
                                  />
                                </div>
                              </SortableItem>
                              {/* Field type icon */}
                              <div className="w-fit h-full">
                                <Popover
                                  open={popoverOpenFieldId === field.id}
                                  onOpenChange={(open) =>
                                    setPopoverOpenFieldId(
                                      open ? field.id : null,
                                    )
                                  }
                                >
                                  <PopoverTrigger asChild>
                                    <Button
                                      onClick={() =>
                                        setPopoverOpenFieldId(field.id)
                                      }
                                      variant="ghost"
                                      className={`w-fit h-full border border-slate-200 justify-center items-center rounded-md gap-0 ${
                                        fieldTypes.find(
                                          (fieldType) =>
                                            fieldType.name === field.type,
                                        )?.color || "bg-white"
                                      } ${
                                        fieldTypes.find(
                                          (fieldType) =>
                                            fieldType.name === field.type,
                                        )?.hover || "hover:bg-white"
                                      }`}
                                    >
                                      <img
                                        src={
                                          fieldTypes.find(
                                            (fieldType) =>
                                              fieldType.name === field.type,
                                          )?.icon || "/default-icon.svg"
                                        }
                                        alt={field.type}
                                        className="w-4 h-4 "
                                      />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    side="bottom"
                                    align="start"
                                    sideOffset={9}
                                    className="min-w-[1000px] h-[25vh] overflow-y-auto p-4 gap-2 bg-white rounded-lg shadow-lg"
                                  >
                                    <div className="flex flex-col gap-1">
                                      <p className="text-sm font-semibold">
                                        Select Field Type
                                      </p>
                                      <div className="w-full grid grid-cols-4 gap-2">
                                        {[...fieldTypes]
                                          .sort((a, b) =>
                                            a.label.localeCompare(b.label),
                                          )
                                          .map((fieldType) => (
                                            <button
                                              key={fieldType.name}
                                              type="button"
                                              className={`flex items-center w-full px-2 py-2 rounded hover:bg-gray-100 gap-2 ${
                                                fieldType.name === field.type
                                                  ? "ring-2 ring-slate-400"
                                                  : ""
                                              }`}
                                              onClick={() => {
                                                updateField(field.id, {
                                                  type: fieldType.name,
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
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              </div>
                              {/* Field label textarea input */}
                              <div className="flex-1 h-full">
                                <Textarea
                                  value={field.label || ""}
                                  onChange={(e) => {
                                    updateField(field.id, {
                                      label: e.target.value,
                                    });
                                  }}
                                  className="bg-white border border-slate-200 rounded-lg text-xs  "
                                  placeholder="Enter Question Label here"
                                />
                              </div>

                              {/* Field options */}
                              {field.type !== "DATE" &&
                                field.type !== "TIME" &&
                                field.type !== "CHECKBOX" && (
                                  <Toggle
                                    className="bg-white border border-slate-200 rounded-lg text-xs"
                                    pressed={
                                      advancedOptionsOpen[field.id] || false
                                    }
                                    onPressedChange={(value: boolean) => {
                                      setAdvancedOptionsOpen({
                                        ...advancedOptionsOpen,
                                        [field.id]: value,
                                      });
                                    }}
                                  >
                                    <img
                                      src="/arrowRightSymbol.svg"
                                      alt="Options Icon"
                                      className="w-2 h-2 "
                                    />
                                    <p className="text-xs ">Options</p>
                                  </Toggle>
                                )}

                              {/* Field Required */}

                              {field.required === true ? (
                                <Button
                                  variant={"outline"}
                                  onClick={() => {
                                    updateField(field.id, {
                                      required: false,
                                    });
                                  }}
                                  className="bg-red-200  border border-slate-200 hover:bg-red-100 rounded-lg "
                                >
                                  <p className="text-xs text-red-600">
                                    Required
                                  </p>
                                </Button>
                              ) : (
                                <Button
                                  variant={"outline"}
                                  onClick={() => {
                                    updateField(field.id, {
                                      required: true,
                                    });
                                  }}
                                  className="bg-white border border-slate-200 hover:bg-slate-50 rounded-lg  "
                                >
                                  <p className="text-xs text-black">Optional</p>
                                </Button>
                              )}

                              {/* Remove Field Icon */}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => removeField(field.id)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>

                            {/* Advanced Options Section - Collapsible */}
                            {advancedOptionsOpen[field.id] &&
                              !["DATE", "TIME"].includes(field.type) && (
                                <>
                                  {field.type === "SEARCH_ASSET" && (
                                    <>
                                      <Separator className=" my-2" />

                                      <div className="bg-white py-2 rounded-md flex flex-col my-2">
                                        <div>
                                          <div className="flex flex-col gap-2 pb-2">
                                            <p className="text-sm font-semibold ">
                                              Asset Type
                                              <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-lg ml-1 text-xs">
                                                Required
                                              </span>
                                            </p>
                                            <p className="text-xs text-gray-500">
                                              Select the asset type to filter,
                                              the filter will show a list of
                                              assets of the selected type.
                                            </p>
                                          </div>

                                          <div className="flex flex-row items-center gap-4 font-normal pb-2">
                                            {[
                                              "Equipment",
                                              "Jobsites",
                                              "Cost Codes",
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
                                                    field.filter === type
                                                  }
                                                  onChange={() => {
                                                    updateField(field.id, {
                                                      filter: type,
                                                    });
                                                  }}
                                                />
                                                <label
                                                  htmlFor={`assetType_${field.id}_${type}`}
                                                  className="text-xs font-normal"
                                                >
                                                  {type
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    type.slice(1)}
                                                </label>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                        <div>
                                          <div className="flex flex-col gap-2 pb-2">
                                            <p className="text-sm font-semibold ">
                                              Multiple Selections
                                              <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-lg ml-1 text-xs">
                                                Optional
                                              </span>
                                            </p>
                                            <p className="text-xs text-gray-500">
                                              Allow users to select multiple
                                              options from the list if selected.
                                            </p>
                                          </div>

                                          <div className="flex flex-row items-center gap-2 px-2 font-normal">
                                            <Input
                                              id={`multipleSelection_${field.id}`}
                                              name={`multipleSelection_${field.id}`}
                                              type="checkbox"
                                              className="w-fit"
                                              checked={field.multiple}
                                              onChange={() =>
                                                updateField(field.id, {
                                                  multiple: !field.multiple,
                                                })
                                              }
                                            />
                                            <label
                                              htmlFor={`multipleSelection_${field.id}`}
                                              className="text-xs font-normal"
                                            >
                                              Allow Multiple Selections
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    </>
                                  )}
                                  {field.type === "TEXT" && (
                                    <>
                                      <Separator className="my-2" />
                                      <div className="flex flex-col gap-2 pb-2">
                                        <p className="text-sm font-semibold ">
                                          Character Limits
                                          <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-lg ml-1 text-xs">
                                            Optional
                                          </span>
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          Specify the minimum and/or maximum
                                          number of characters for this field.
                                        </p>
                                      </div>

                                      <div className="flex flex-row gap-2 mt-2">
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
                                            min={0}
                                            className="bg-white rounded-lg text-xs w-fit"
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
                                            min={0}
                                            className="bg-white rounded-lg text-xs w-fit"
                                            placeholder="Enter max length"
                                          />
                                        </div>
                                      </div>
                                    </>
                                  )}
                                  {field.type === "NUMBER" && (
                                    <div>
                                      <Separator className="my-2" />
                                      <div className="flex flex-col gap-2 pb-2">
                                        <p className="text-sm font-semibold ">
                                          Number Range
                                          <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-lg ml-1 text-xs">
                                            Optional
                                          </span>
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          Set the minimum and/or maximum number
                                          Ranges for this field.
                                        </p>
                                      </div>

                                      <div className="flex flex-row gap-2 p-2">
                                        <div className="flex flex-col">
                                          <Label className="text-xs">
                                            Min Value
                                          </Label>
                                          <Input
                                            type="number"
                                            value={field.minLength || ""}
                                            onChange={(e) => {
                                              const value = parseInt(
                                                e.target.value,
                                              );
                                              const errors = {
                                                ...(validationErrors[
                                                  field.id
                                                ] || {}),
                                              };

                                              // Clear existing error
                                              delete errors.minError;

                                              if (value < 0) {
                                                errors.minError =
                                                  "Cannot be negative";
                                              } else if (
                                                field.maxLength !== undefined &&
                                                value > field.maxLength
                                              ) {
                                                errors.minError =
                                                  "Cannot be greater than max";
                                              } else {
                                                updateField(field.id, {
                                                  minLength: value || undefined,
                                                });
                                              }

                                              setValidationErrors({
                                                ...validationErrors,
                                                [field.id]: errors,
                                              });
                                            }}
                                            min={0}
                                            className={`mt-1 bg-white rounded-lg text-xs w-fit ${
                                              validationErrors[field.id]
                                                ?.minError
                                                ? "border-red-500"
                                                : ""
                                            }`}
                                            placeholder="Enter min value"
                                          />
                                          {validationErrors[field.id]
                                            ?.minError && (
                                            <p className="text-xs text-red-500 mt-1">
                                              {
                                                validationErrors[field.id]
                                                  ?.minError
                                              }
                                            </p>
                                          )}
                                        </div>
                                        <div className="flex flex-col">
                                          <Label className="text-xs">
                                            Max Value
                                          </Label>
                                          <Input
                                            type="number"
                                            value={field.maxLength || ""}
                                            onChange={(e) => {
                                              const value = parseInt(
                                                e.target.value,
                                              );
                                              const errors = {
                                                ...(validationErrors[
                                                  field.id
                                                ] || {}),
                                              };

                                              // Clear existing error
                                              delete errors.maxError;

                                              if (value < 0) {
                                                errors.maxError =
                                                  "Cannot be negative";
                                              } else if (
                                                field.minLength !== undefined &&
                                                value < field.minLength
                                              ) {
                                                errors.maxError =
                                                  "Cannot be less than min";
                                              } else {
                                                updateField(field.id, {
                                                  maxLength: value || undefined,
                                                });
                                              }

                                              setValidationErrors({
                                                ...validationErrors,
                                                [field.id]: errors,
                                              });
                                            }}
                                            min={0}
                                            className={`mt-1 bg-white rounded-lg text-xs w-fit ${
                                              validationErrors[field.id]
                                                ?.maxError
                                                ? "border-red-500"
                                                : ""
                                            }`}
                                            placeholder="Enter max value"
                                          />

                                          {validationErrors[field.id]
                                            ?.maxError && (
                                            <p className="text-xs text-red-500 mt-1">
                                              {
                                                validationErrors[field.id]
                                                  ?.maxError
                                              }
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  {field.type === "DROPDOWN" && (
                                    <div className="mb-2 flex flex-col gap-2">
                                      <Separator className="my-2" />
                                      <div className="flex justify-between items-center">
                                        <div className="flex flex-col gap-2 pb-2">
                                          <p className="text-sm font-semibold ">
                                            Dropdown Options
                                            <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-lg ml-1 text-xs">
                                              Required
                                            </span>
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            Add options to your dropdown list.
                                            You must include at least two
                                            options.
                                          </p>
                                        </div>

                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => {
                                            const newOptions = [
                                              ...(field.Options || []).filter(
                                                (
                                                  opt,
                                                ): opt is {
                                                  id: string;
                                                  value: string;
                                                } => typeof opt !== "string",
                                              ),
                                              {
                                                id: Date.now().toString(),
                                                value: "",
                                              },
                                            ];
                                            updateField(field.id, {
                                              Options: newOptions,
                                            });
                                          }}
                                          className="w-fit bg-green-200 hover:bg-green-200"
                                        >
                                          <Plus className="w-3 h-3 mr-2" />
                                          Add Option
                                        </Button>
                                      </div>
                                      {field.Options &&
                                        field.Options.length > 0 && (
                                          <div className="flex flex-col gap-2 mt-2">
                                            {(field.Options || [])
                                              .filter(
                                                (
                                                  opt,
                                                ): opt is {
                                                  id: string;
                                                  value: string;
                                                } => typeof opt !== "string",
                                              )
                                              .map((option, optionIndex) => (
                                                <div
                                                  key={option.id || optionIndex}
                                                  className="flex gap-2"
                                                >
                                                  <div className="flex items-center">
                                                    <p>{optionIndex + 1}. </p>
                                                  </div>
                                                  <Input
                                                    value={option.value || ""}
                                                    onChange={(e) => {
                                                      const newOptions = (
                                                        field.Options || []
                                                      )
                                                        .filter(
                                                          (
                                                            opt,
                                                          ): opt is {
                                                            id: string;
                                                            value: string;
                                                          } =>
                                                            typeof opt !==
                                                            "string",
                                                        )
                                                        .map((opt, idx) =>
                                                          idx === optionIndex
                                                            ? {
                                                                ...opt,
                                                                value:
                                                                  e.target
                                                                    .value,
                                                              }
                                                            : opt,
                                                        );
                                                      updateField(field.id, {
                                                        Options: newOptions,
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
                                                      const newOptions = (
                                                        field.Options || []
                                                      )
                                                        .filter(
                                                          (
                                                            opt,
                                                          ): opt is {
                                                            id: string;
                                                            value: string;
                                                          } =>
                                                            typeof opt !==
                                                            "string",
                                                        )
                                                        .filter(
                                                          (_, i) =>
                                                            i !== optionIndex,
                                                        );
                                                      updateField(field.id, {
                                                        Options: newOptions,
                                                      });
                                                    }}
                                                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                                  >
                                                    <X className="w-4 h-4" />
                                                  </Button>
                                                </div>
                                              ))}
                                          </div>
                                        )}
                                    </div>
                                  )}
                                  {field.type === "TEXTAREA" && (
                                    <div>
                                      <Separator className="my-2" />
                                      <div className="flex flex-col gap-2 pb-2">
                                        <p className="text-sm font-semibold ">
                                          Character Limits
                                          <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-lg ml-1 text-xs">
                                            Optional
                                          </span>
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          Specify the minimum and/or maximum
                                          number of characters for this field.
                                        </p>
                                      </div>
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
                                            min={0}
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
                                            min={0}
                                            className="bg-white rounded-lg text-xs w-48"
                                            placeholder="Enter max length"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  {field.type === "RADIO" && (
                                    <div className="mt-2">
                                      <Separator className="my-2" />
                                      <div className="flex justify-between items-center">
                                        <div className="flex flex-col gap-2 pb-2">
                                          <p className="text-sm font-semibold ">
                                            Radio Options
                                            <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-lg ml-1 text-xs">
                                              Required
                                            </span>
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            Add options to your Radio list. You
                                            must include at least two options.
                                          </p>
                                        </div>

                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => {
                                            const newOptions = [
                                              ...(field.Options || []).filter(
                                                (
                                                  opt,
                                                ): opt is {
                                                  id: string;
                                                  value: string;
                                                } => typeof opt !== "string",
                                              ),
                                              {
                                                id: Date.now().toString(),
                                                value: "",
                                              },
                                            ];
                                            updateField(field.id, {
                                              Options: newOptions,
                                            });
                                          }}
                                          className="w-fit bg-green-200 hover:bg-green-200"
                                        >
                                          <Plus className="w-4 h-4 mr-2" />
                                          Add Option
                                        </Button>
                                      </div>
                                      <div className="space-y-2 mt-2">
                                        {(field.Options || [])
                                          .filter(
                                            (
                                              opt,
                                            ): opt is {
                                              id: string;
                                              value: string;
                                            } => typeof opt !== "string",
                                          )
                                          .map((option, optionIndex) => (
                                            <div
                                              key={option.id || optionIndex}
                                              className="flex gap-2"
                                            >
                                              <div className="flex items-center">
                                                <p>{optionIndex + 1}. </p>
                                              </div>
                                              <Input
                                                value={option.value}
                                                onChange={(e) => {
                                                  const newOptions = (
                                                    field.Options || []
                                                  )
                                                    .filter(
                                                      (
                                                        opt,
                                                      ): opt is {
                                                        id: string;
                                                        value: string;
                                                      } =>
                                                        typeof opt !== "string",
                                                    )
                                                    .map((opt, idx) =>
                                                      idx === optionIndex
                                                        ? {
                                                            ...opt,
                                                            value:
                                                              e.target.value,
                                                          }
                                                        : opt,
                                                    );
                                                  updateField(field.id, {
                                                    Options: newOptions,
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
                                                  const newOptions = (
                                                    field.Options || []
                                                  )
                                                    .filter(
                                                      (
                                                        opt,
                                                      ): opt is {
                                                        id: string;
                                                        value: string;
                                                      } =>
                                                        typeof opt !== "string",
                                                    )
                                                    .filter(
                                                      (_, i) =>
                                                        i !== optionIndex,
                                                    );
                                                  updateField(field.id, {
                                                    Options: newOptions,
                                                  });
                                                }}
                                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                              >
                                                <X className="w-4 h-4" />
                                              </Button>
                                            </div>
                                          ))}
                                      </div>
                                    </div>
                                  )}
                                  {field.type === "MULTISELECT" && (
                                    <div>
                                      <Separator className="my-2" />
                                      <div className="flex justify-between items-start">
                                        <div className="flex flex-col gap-2 pb-2">
                                          <p className="text-sm font-semibold ">
                                            Multi-Select Options
                                            <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-lg ml-1 text-xs">
                                              Required
                                            </span>
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            Add options to your multi-select
                                            list. You must include at least two
                                            options.
                                          </p>
                                        </div>

                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => {
                                            const newOptions = [
                                              ...(field.Options || []).filter(
                                                (
                                                  opt,
                                                ): opt is {
                                                  id: string;
                                                  value: string;
                                                } => typeof opt !== "string",
                                              ),
                                              {
                                                id: Date.now().toString(),
                                                value: "",
                                              },
                                            ];
                                            updateField(field.id, {
                                              Options: newOptions,
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
                                        {(field.Options || [])
                                          .filter(
                                            (
                                              opt,
                                            ): opt is {
                                              id: string;
                                              value: string;
                                            } => typeof opt !== "string",
                                          )
                                          .map((option, optionIndex) => (
                                            <div
                                              key={option.id || optionIndex}
                                              className="flex gap-2"
                                            >
                                              <div className="flex items-center">
                                                <p>{optionIndex + 1}. </p>
                                              </div>
                                              <Input
                                                value={option.value}
                                                onChange={(e) => {
                                                  const newOptions = (
                                                    field.Options || []
                                                  )
                                                    .filter(
                                                      (
                                                        opt,
                                                      ): opt is {
                                                        id: string;
                                                        value: string;
                                                      } =>
                                                        typeof opt !== "string",
                                                    )
                                                    .map((opt, idx) =>
                                                      idx === optionIndex
                                                        ? {
                                                            ...opt,
                                                            value:
                                                              e.target.value,
                                                          }
                                                        : opt,
                                                    );
                                                  updateField(field.id, {
                                                    Options: newOptions,
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
                                                  const newOptions = (
                                                    field.Options || []
                                                  )
                                                    .filter(
                                                      (
                                                        opt,
                                                      ): opt is {
                                                        id: string;
                                                        value: string;
                                                      } =>
                                                        typeof opt !== "string",
                                                    )
                                                    .filter(
                                                      (_, i) =>
                                                        i !== optionIndex,
                                                    );
                                                  updateField(field.id, {
                                                    Options: newOptions,
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
                                  {field.type === "SEARCH_PERSON" && (
                                    <>
                                      <Separator className=" my-2" />

                                      <div className="bg-white py-2 rounded-md flex flex-col my-2">
                                        <div>
                                          <div className="flex flex-col gap-2 pb-2">
                                            <p className="text-sm font-semibold ">
                                              Multiple Selections
                                              <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-lg ml-1 text-xs">
                                                Optional
                                              </span>
                                            </p>
                                            <p className="text-xs text-gray-500">
                                              Allow users to select multiple
                                              options from the list if selected.
                                            </p>
                                          </div>
                                          <div className="flex flex-row items-center gap-2 font-normal px-2">
                                            <Input
                                              id={`multipleSelection_${field.id}`}
                                              name={`multipleSelection_${field.id}`}
                                              type="checkbox"
                                              className="w-fit"
                                              checked={field.multiple}
                                              onChange={() =>
                                                updateField(field.id, {
                                                  multiple: !field.multiple,
                                                })
                                              }
                                            />
                                            <label
                                              htmlFor={`multipleSelection_${field.id}`}
                                              className="text-xs font-normal"
                                            >
                                              Allow Multiple Selections
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    </>
                                  )}
                                </>
                              )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </SortableContext>
                </DndContext>
                {formSettings && formSettings.isApprovalRequired && (
                  <div className="w-full flex flex-col  px-4 mt-2">
                    <div className="bg-white border-slate-200 border rounded-md flex flex-row items-center gap-2 px-4 py-2">
                      <div className="flex items-center w-8 h-8 rounded-lg bg-sky-300 justify-center">
                        <img
                          src="/team.svg"
                          alt="Signature"
                          className="w-4 h-4"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">
                          Submission Requires Approval
                        </p>
                        <p className="text-xs">
                          Form must be reviewed and approved before completion.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {formSettings && formSettings.requireSignature && (
                  <div className="w-full flex flex-col  px-4 mt-2">
                    <div className="bg-white border-slate-200 border  rounded-md flex flex-row items-center gap-2 px-4 py-2">
                      <div className="flex items-center w-8 h-8 rounded-lg bg-lime-300 justify-center">
                        <img
                          src="/formEdit.svg"
                          alt="Signature"
                          className="w-4 h-4"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">
                          Requires Digital Signature
                        </p>
                        <p className="text-xs">
                          A digital signature is needed to complete the
                          submission.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </div>

        <FormBuilderPanelRight addField={addField} />

        {loadingSave && (
          <div className="absolute inset-0 z-40 w-full h-full bg-white bg-opacity-20 flex items-center justify-center rounded-lg">
            <Spinner size={40} />
          </div>
        )}
      </div>
      <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exit Form Builder</DialogTitle>
            <DialogDescription>
              Are you sure you want to exit the form builder? All unsaved
              changes will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="flex flex-row gap-2">
              <Button
                variant="outline"
                className="bg-gray-100"
                onClick={() => setShowCancelModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  handleExitBuild();
                }}
              >
                Exit Without Saving
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
