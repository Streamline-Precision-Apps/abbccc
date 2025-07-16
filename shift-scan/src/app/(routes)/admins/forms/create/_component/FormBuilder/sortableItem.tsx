"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
export default function SortableItem({
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
