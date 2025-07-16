"use client";
import React, { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Toggle } from "@/components/ui/toggle";
import FormBuilderPlaceholder from "../../../create/_component/FormBuilder/FormBuilderPlaceholder";
import { FormBuilderPanelRight } from "../../../create/_component/FormBuilder/FormBuilderPanelRight";
import { toast } from "sonner";
import { updateFormTemplate } from "@/actions/records-forms";
import { FormEditorPanelLeft } from "./FormEditorPanelLeft";
import Spinner from "@/components/(animations)/spinner";
import { is } from "date-fns/locale";

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
  requireSignature: boolean;
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
  },
  {
    name: "NUMBER",
    label: "Number",
    description: "Numeric Input",
    icon: "/number.svg",
    color: "bg-fuchsia-400",
  },
  {
    name: "DATE",
    label: "Date",
    description: "Date picker",
    icon: "/calendar.svg",
    color: "bg-purple-400",
  },
  {
    name: "TIME",
    label: "Time",
    description: "Time picker",
    icon: "/clock.svg",
    color: "bg-orange-300",
  },

  {
    name: "DROPDOWN",
    label: "Dropdown",
    description: "Multiple options",
    icon: "/layout.svg",
    color: "bg-red-400",
  },
  {
    name: "TEXTAREA",
    label: "Text Area",
    description: "Multi-line Input",
    icon: "/formList.svg",
    color: "bg-indigo-400",
  },
  {
    name: "CHECKBOX",
    label: "Checkbox",
    description: "Checkbox",
    icon: "/checkbox.svg",
    color: "bg-green-400",
  },
  {
    name: "RADIO",
    label: "Radio",
    description: "Single choice selection",
    icon: "/radio.svg",
    color: "bg-teal-400",
  },

  {
    name: "MULTISELECT",
    label: "Multiselect",
    description: "Select multiple options",
    icon: "/moreOptionsCircle.svg",
    color: "bg-yellow-500",
  },
  {
    name: "SEARCH_PERSON",
    label: "Worker",
    description: "Search and select a worker",
    icon: "/team.svg",
    color: "bg-pink-400",
  },
  {
    name: "SEARCH_ASSET",
    label: "Asset",
    description: "Search and select an asset",
    icon: "/equipment.svg",
    color: "bg-orange-400",
  },
];

function SortableItem({
  id,
  children,
  editingFieldId,
}: {
  id: string;
  children: React.ReactNode;
  editingFieldId?: string | null;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
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
    border: isDragging ? "2px dashed #00f" : "none", // Show border when dragging
    backgroundColor: isDragging ? "#f0f8ff" : "transparent",
    pointerEvents: isDragging ? ("none" as const) : ("auto" as const), // Correctly typed pointerEvents
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative"
    >
      {children}
    </div>
  );
}

export default function FormEditor({
  onCancel,
  formId,
}: {
  onCancel?: () => void;
  formId: string | null;
}) {
  // Form state
  const [formSettings, setFormSettings] = useState<FormSettings>({
    id: "",
    companyId: "",
    name: "",
    formType: "",
    description: "",
    requireSignature: false,
    createdAt: "",
    updatedAt: "",
    isActive: "",
    isSignatureRequired: false,
    FormGrouping: [],
  });
  const [loadingSave, setLoadingSave] = useState(false);
  const [loading, setLoading] = useState(false);
  const [popoverOpenFieldId, setPopoverOpenFieldId] = useState<string | null>(
    null
  );
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [formSections, setFormSections] = useState<FormGrouping[]>([]);
  const [selectedField, setSelectedField] = useState<FormField | null>(null);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [advancedOptionsOpen, setAdvancedOptionsOpen] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    const fetchForm = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/getForms/${formId}`);
        if (!response.ok) throw new Error("Failed to fetch form");
        const data = await response.json();

        // Map the response data to the form state
        const formGrouping = data.FormGrouping.map((group: FormGrouping) => ({
          ...group,
          Fields: group.Fields.map((field: FormField) => ({
            ...field,
            Options: field.Options || [],
          })),
        }));

        setFormFields(
          formGrouping.flatMap((group: FormGrouping) => group.Fields)
        );
        setFormSections(formGrouping);
        setFormSettings({
          id: data.id,
          companyId: data.companyId,
          name: data.name,
          formType: data.formType,
          description: data.description || "",
          requireSignature: data.isSignatureRequired,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          isActive: data.isActive,
          isSignatureRequired: data.isSignatureRequired,
          FormGrouping: formGrouping,
        });
      } catch (error) {
        console.error("Error fetching form:", error);
        toast.error("Failed to fetch form data");
      } finally {
        setLoading(false);
      }
    };

    if (formId) {
      fetchForm();
    }
  }, [formId]);

  // Updated logic to handle the new `Options` property in the API response
  const updateField = (
    fieldId: string,
    updatedProperties: Partial<FormField>
  ) => {
    setFormFields((prevFields) =>
      prevFields.map((field) =>
        field.id === fieldId ? { ...field, ...updatedProperties } : field
      )
    );
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

  // Update form settings
  const updateFormSettings = (
    key: keyof FormSettings,
    value: string | boolean
  ) => {
    setFormSettings({ ...formSettings, [key]: value });
  };

  // Save form to database
  /**
   * Save or update the form template using the server action.
   * Submits all current form field and settings data to the server.
   */
  const editForm = async () => {
    if (!formSettings.name.trim()) {
      toast.error("Please enter a form name");
      return;
    }
    setLoadingSave(true);
    try {
      // Prepare the payload for the updateFormTemplate server action
      const payload = {
        settings: {
          name: formSettings.name,
          description: formSettings.description,
          formType: formSettings.formType, // status isActive is used for status
          isActive: formSettings.isActive,
          requireSignature: formSettings.requireSignature,
        },
        fields: formFields.map((field) => ({
          id: field.id,
          formGroupingId: field.formGroupingId, // Ensure this property is included
          label: field.label,
          type: field.type,
          required: field.required,
          order: field.order,
          placeholder: field.placeholder ?? undefined,
          maxLength: field.maxLength ?? undefined,
          minLength: field.minLength ?? undefined,
          multiple: field.multiple ?? undefined,
          content: field.content ?? undefined,
          filter: field.filter ?? undefined,
          Options: field.Options ?? [],
        })),
        companyId: formSettings.companyId,
        formId: formSettings.id,
      };

      const result = await updateFormTemplate(payload);

      if (result.success) {
        toast.success("Form saved successfully!");
      } else {
        toast.error(`Failed to save form: ${result.error}`);
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Error saving form");
    } finally {
      setLoadingSave(false);
    }
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

  const loadingFormBuilder = formFields.length === 0 && !formSettings.name;

  return (
    <>
      {/* Action Buttons */}

      <div className="h-fit w-full flex flex-row  gap-4 mb-4">
        <Button
          variant={"outline"}
          size={"sm"}
          className="bg-red-300 border-none rounded-lg"
          disabled={loading}
          onClick={onCancel}
        >
          <div className="flex flex-row items-center">
            <img
              src="/statusDenied.svg"
              alt="Cancel Icon"
              className="w-3 h-3 mr-2"
            />
            <p className="text-xs">Close</p>
          </div>
        </Button>
        <Button
          variant={"outline"}
          size={"sm"}
          className="bg-sky-400 border-none rounded-lg"
          onClick={editForm}
          disabled={loading}
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

      <div className="w-full h-[85vh] grid grid-cols-[275px_1fr_250px] overflow-y-auto relative">
        <FormEditorPanelLeft
          formFields={formFields}
          formSettings={formSettings}
          updateFormSettings={updateFormSettings}
        />
        <ScrollArea className="w-full h-full bg-white bg-opacity-10 relative">
          {formSettings && formSettings.name && (
            <div className="w-full h-full flex flex-col px-4 my-2">
              <div className="bg-white bg-opacity-40 rounded-md flex flex-row items-center px-4 py-2">
                <div>
                  <p className="text-xs text-gray-600">Form Name</p>
                  <p className="text-lg font-semibold">{formSettings.name}</p>
                  <p className="text-xs">{formSettings.description}</p>
                </div>
              </div>
            </div>
          )}
          {/* Form Builder Placeholder */}
          {loadingFormBuilder ? (
            <FormBuilderPlaceholder loading={loading} addField={addField} />
          ) : (
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={formFields.map((field) => field.id)}>
                <div className="w-full px-4 py-1">
                  <div className="space-y-4">
                    {formFields.map((field, index) => (
                      <div
                        key={field.id}
                        className={`bg-white bg-opacity-40 border-none px-4 py-2 rounded-lg transition-all duration-200 ${
                          editingFieldId === field.id
                            ? "border-sky-400 shadow-md"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {/* Top portion of field */}
                        <div className="w-full flex flex-row items-center gap-2">
                          {/* Drag handle icon */}
                          <SortableItem
                            key={field.id}
                            id={field.id}
                            editingFieldId={editingFieldId}
                          >
                            <div className="w-fit h-full bg-transparent flex flex-col items-center justify-center">
                              <img
                                src="/dragFormBuilder.svg"
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
                                setPopoverOpenFieldId(open ? field.id : null)
                              }
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  onClick={() =>
                                    setPopoverOpenFieldId(field.id)
                                  }
                                  variant="ghost"
                                  className={`w-fit h-full justify-center items-center rounded-md gap-0  ${
                                    fieldTypes.find(
                                      (fieldType) =>
                                        fieldType.name === field.type
                                    )?.color || "bg-white"
                                  } `}
                                >
                                  <img
                                    src={
                                      fieldTypes.find(
                                        (fieldType) =>
                                          fieldType.name === field.type
                                      )?.icon || "/default-icon.svg"
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
                                updateField(field.id, {
                                  label: e.target.value,
                                });
                              }}
                              className="bg-white rounded-lg text-xs border-none "
                              placeholder="Enter Question Label here"
                            />
                          </div>

                          {/* Field options */}
                          {field.type !== "DATE" &&
                            field.type !== "TIME" &&
                            field.type !== "CHECKBOX" && (
                              <Toggle
                                className="bg-white rounded-lg text-xs"
                                pressed={advancedOptionsOpen[field.id] || false}
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
                              variant={"ghost"}
                              onClick={() => {
                                updateField(field.id, {
                                  required: false,
                                });
                              }}
                              className="bg-red-400 rounded-lg"
                            >
                              <p className="text-xs">required</p>
                            </Button>
                          ) : (
                            <Button
                              variant={"ghost"}
                              onClick={() => {
                                updateField(field.id, {
                                  required: true,
                                });
                              }}
                              className="bg-neutral-200 rounded-lg px-2 "
                            >
                              <p className="text-xs text-black">optional</p>
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

                        {/* Advanced Options Section - Collapsible */}
                        {advancedOptionsOpen[field.id] &&
                          !["DATE", "TIME"].includes(field.type) && (
                            <>
                              {field.type === "SEARCH_ASSET" && (
                                <>
                                  <Separator className=" my-2" />
                                  <p className="text-sm font-semibold">
                                    Asset Options
                                  </p>
                                  <div className="bg-white px-4 py-2 rounded-md flex flex-col my-2">
                                    <div>
                                      <p className="text-xs font-semibold">
                                        Asset Type
                                      </p>
                                      <div className="flex flex-row items-center gap-4 font-normal pb-2">
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
                                              checked={field.filter?.includes(
                                                type
                                              )}
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
                                              {type.charAt(0).toUpperCase() +
                                                type.slice(1)}
                                            </label>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    <div>
                                      <p className="text-xs font-semibold">
                                        Multiple Selections
                                      </p>
                                      <div className="flex flex-row items-center gap-2 font-normal">
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
                              {field.type === "NUMBER" && (
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
                              {field.type === "DROPDOWN" && (
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
                                          ...(field.Options || []).filter(
                                            (
                                              opt
                                            ): opt is {
                                              id: string;
                                              value: string;
                                            } => typeof opt !== "string"
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
                                  {field.Options &&
                                    field.Options.length > 0 && (
                                      <div className="flex flex-col gap-2 mt-2">
                                        {(field.Options || [])
                                          .filter(
                                            (
                                              opt
                                            ): opt is {
                                              id: string;
                                              value: string;
                                            } => typeof opt !== "string"
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
                                                        opt
                                                      ): opt is {
                                                        id: string;
                                                        value: string;
                                                      } =>
                                                        typeof opt !== "string"
                                                    )
                                                    .map((opt, idx) =>
                                                      idx === optionIndex
                                                        ? {
                                                            ...opt,
                                                            value:
                                                              e.target.value,
                                                          }
                                                        : opt
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
                                                        opt
                                                      ): opt is {
                                                        id: string;
                                                        value: string;
                                                      } =>
                                                        typeof opt !== "string"
                                                    )
                                                    .filter(
                                                      (_, i) =>
                                                        i !== optionIndex
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
                                    )}
                                </div>
                              )}
                              {field.type === "TEXTAREA" && (
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
                              {field.type === "RADIO" && (
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
                                          ...(field.Options || []).filter(
                                            (
                                              opt
                                            ): opt is {
                                              id: string;
                                              value: string;
                                            } => typeof opt !== "string"
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
                                          opt
                                        ): opt is {
                                          id: string;
                                          value: string;
                                        } => typeof opt !== "string"
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
                                                    opt
                                                  ): opt is {
                                                    id: string;
                                                    value: string;
                                                  } => typeof opt !== "string"
                                                )
                                                .map((opt, idx) =>
                                                  idx === optionIndex
                                                    ? {
                                                        ...opt,
                                                        value: e.target.value,
                                                      }
                                                    : opt
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
                                                    opt
                                                  ): opt is {
                                                    id: string;
                                                    value: string;
                                                  } => typeof opt !== "string"
                                                )
                                                .filter(
                                                  (_, i) => i !== optionIndex
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
                              {field.type === "MULTISELECT" && (
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
                                          ...(field.Options || []).filter(
                                            (
                                              opt
                                            ): opt is {
                                              id: string;
                                              value: string;
                                            } => typeof opt !== "string"
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
                                          opt
                                        ): opt is {
                                          id: string;
                                          value: string;
                                        } => typeof opt !== "string"
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
                                                    opt
                                                  ): opt is {
                                                    id: string;
                                                    value: string;
                                                  } => typeof opt !== "string"
                                                )
                                                .map((opt, idx) =>
                                                  idx === optionIndex
                                                    ? {
                                                        ...opt,
                                                        value: e.target.value,
                                                      }
                                                    : opt
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
                                                    opt
                                                  ): opt is {
                                                    id: string;
                                                    value: string;
                                                  } => typeof opt !== "string"
                                                )
                                                .filter(
                                                  (_, i) => i !== optionIndex
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
                                  <p className="text-sm font-semibold">
                                    Worker Options
                                  </p>
                                  <div className="bg-white px-4 py-2 rounded-md flex flex-col my-2">
                                    <div>
                                      <p className="text-xs font-semibold">
                                        Multiple Selections
                                      </p>
                                      <div className="flex flex-row items-center gap-2 font-normal">
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
          )}

          {formSettings && formSettings.requireSignature && (
            <div className="w-full flex flex-col  px-4 mt-2">
              <div className="bg-white bg-opacity-40 rounded-md flex flex-row items-center gap-2 px-4 py-2">
                <div className="flex items-center w-8 h-8 rounded-lg bg-lime-300 justify-center">
                  <img
                    src="/formEdit.svg"
                    alt="Signature"
                    className="w-4 h-4"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold">Digital Signature</p>
                  <p className="text-xs">
                    Automatically added at the end of the form
                  </p>
                </div>
              </div>
            </div>
          )}
        </ScrollArea>

        <FormBuilderPanelRight addField={addField} />
        {loadingSave && (
          <div className="absolute inset-0 z-40 w-full h-full bg-white bg-opacity-20 flex items-center justify-center">
            <Spinner size={40} />
          </div>
        )}
      </div>
    </>
  );
}
