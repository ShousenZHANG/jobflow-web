"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function SortableItem({
  id,
  children,
}: {
  id: string;
  children: (args: {
    dragHandleProps: HTMLAttributes<HTMLButtonElement>;
    isDragging: boolean;
  }) => ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? "opacity-75" : undefined}
    >
      {children({
        dragHandleProps: { ...attributes, ...listeners } as HTMLAttributes<HTMLButtonElement>,
        isDragging,
      })}
    </div>
  );
}
