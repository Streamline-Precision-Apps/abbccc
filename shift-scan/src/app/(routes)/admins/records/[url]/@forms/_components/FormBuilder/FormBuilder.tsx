"use client";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const fieldTypes = [
  { name: "Text", description: "Single line Input", icon: "/text.svg" },
  { name: "Number", description: "Numeric Input", icon: "/number.svg" },
  { name: "Date", description: "Date picker", icon: "/date.svg" },
  { name: "Time", description: "Time picker", icon: "/time.svg" },
  { name: "Checkbox", description: "Yes/No toggle", icon: "/checkbox.svg" },
  { name: "Dropdown", description: "multiple options", icon: "/dropdown.svg" },
  { name: "Text Area", description: "Multi-line Input", icon: "/textBox.svg" },
  { name: "Rating", description: "Star Rating", icon: "/rating.svg" },
];

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function FormBuilder() {
  const [fields, setFields] = useState<any[]>([]);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  // Add a new field of the given type
  const handleAddField = (fieldType: typeof fieldTypes[number]) => {
    setFields((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        type: fieldType.name,
        label: fieldType.name + " Field",
        name: fieldType.name.toLowerCase() + "_" + (prev.length + 1),
        required: false,
        order: prev.length,
        defaultValue: "",
        placeholder: "",
        maxLength: undefined,
        helperText: "",
        options: [],
      },
    ]);
  };

  // DnD handlers
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setFields((items) => {
        const oldIndex = items.findIndex((f) => f.id === active.id);
        const newIndex = items.findIndex((f) => f.id === over.id);
        const newArr = arrayMove(items, oldIndex, newIndex).map((f, idx) => ({ ...f, order: idx }));
        return newArr;
      });
    }
  };

  return (
    <div className="w-full h-full grid grid-cols-[275px_1fr_250px]">
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
                rows={5}
                maxLength={200}
                className="bg-white rounded-lg text-xs "
              />
            </div>
            <div className=" w-full mb-4">
              <Label htmlFor="category" className="text-xs">
                Category
              </Label>
              <Select name="category">
                <SelectTrigger className="w-full bg-white rounded-lg text-xs">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="category1">Category 1</SelectItem>
                  <SelectItem value="category2">Category 2</SelectItem>
                  <SelectItem value="category3">Category 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className=" w-full mb-6">
              <Label htmlFor="status" className="text-xs">
                Status
              </Label>
              <Select name="status">
                <SelectTrigger className="w-full bg-white rounded-lg text-xs">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
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
                <p>0</p>
                <p className="text-xs">Fields</p>
              </div>
              <div className="w-full h-full px-2 py-1 bg-white flex flex-col justify-center items-center rounded-lg">
                <p>0</p>
                <p className="text-xs">Required</p>
              </div>
            </div>
            <div className="w-full h-full  justify-center items-center flex flex-col rounded-lg p-4 mt-6">
              <img
                src="/formInspect.svg"
                alt="Form Preview Placeholder"
                className="w-full h-6 mb-2"
              />
              <p className="text-xs text-gray-500">No fields added yet</p>
            </div>
          </TabsContent>
        </Tabs>
      </ScrollArea>

      <ScrollArea className="w-full h-full bg-white bg-opacity-10  p-4 relative">
        <div className="h-full flex flex-col items-center justify-center absolute inset-0">
          {fields.length === 0 ? (
            <>
              <img
                src="/formDuplicate.svg"
                alt="Form Builder Placeholder"
                className="w-12 h-12 mb-2"
              />
              <h2 className="text-lg font-semibold mb-2">
                Start Building Your Form
              </h2>
              <p className="text-xs text-gray-500">
                Add fields using the field type buttons on the right.
              </p>
            </>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                <div className="w-full flex flex-col gap-4">
                  {fields.map((field) => (
                    <SortableField key={field.id} field={field} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>



// SortableField component for drag handle and drag styles
function SortableField({ field }: { field: any }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-full flex flex-row items-center gap-2 bg-white rounded-md p-3 shadow border border-dashed border-emerald-200"
      {...attributes}
      {...listeners}
    >
      <span className="material-symbols-outlined select-none mr-2 text-emerald-400">drag_indicator</span>
      <span className="font-bold text-xs w-24">{field.label}</span>
      {/* Render a preview of the field type */}
      {field.type === "Text" && (
        <Input disabled placeholder="Text input" className="w-40" />
      )}
      {field.type === "Number" && (
        <Input disabled type="number" placeholder="Number input" className="w-40" />
      )}
      {field.type === "Date" && (
        <Input disabled type="date" className="w-40" />
      )}
      {field.type === "Time" && (
        <Input disabled type="time" className="w-40" />
      )}
      {field.type === "Checkbox" && (
        <input type="checkbox" disabled className="w-4 h-4" />
      )}
      {field.type === "Dropdown" && (
        <Select disabled>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Dropdown" />
          </SelectTrigger>
        </Select>
      )}
      {field.type === "Text Area" && (
        <Textarea disabled placeholder="Text area" className="w-40" />
      )}
      {field.type === "Rating" && (
        <div className="flex flex-row gap-1">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-yellow-400">★</span>
          ))}
        </div>
      )}
    </div>
  );
}
          )}
        </div>
      </ScrollArea>
      <div className="w-full h-full bg-white bg-opacity-40 rounded-tr-lg rounded-br-lg p-4">
        <div className="flex flex-row gap-4 h-10 w-full items-center  mb-4">
          <div className="flex flex-col ">
            <p className="text-sm font-bold">Field types</p>
            <p className="text-xs">Click to add field</p>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          {fieldTypes.map((fieldType) => (
            <button
              key={fieldType.name}
              type="button"
              className="flex flex-row items-center p-2 bg-white rounded-md shadow-sm hover:bg-emerald-100 transition"
              onClick={() => handleAddField(fieldType)}
            >
              <img
                src={fieldType.icon}
                alt={fieldType.name}
                className="w-4 h-4 mr-2"
              />
              <div className="flex flex-col text-left">
                <p className="text-sm font-bold">{fieldType.name}</p>
                <p className="text-xs text-gray-500">{fieldType.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
