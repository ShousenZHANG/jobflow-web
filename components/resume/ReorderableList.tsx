"use client";

import type { ReactNode, HTMLAttributes } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";
import { toSortableId, toSortableIndex } from "./utils";
import type { ReorderSection } from "./types";

interface ReorderableListProps<T> {
  items: T[];
  section: ReorderSection;
  onMove: (from: number, to: number) => void;
  renderItem: (
    item: T,
    index: number,
    dragHandleProps: HTMLAttributes<HTMLButtonElement>,
    isDragging: boolean,
  ) => ReactNode;
}

export function ReorderableList<T>({
  items,
  section,
  onMove,
  renderItem,
}: ReorderableListProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = toSortableIndex(active.id, section);
    const to = toSortableIndex(over.id, section);
    if (from === null || to === null) return;
    onMove(from, to);
  };

  const sortableIds = items.map((_, i) => toSortableId(section, i));

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {items.map((item, index) => (
            <SortableItem key={toSortableId(section, index)} id={toSortableId(section, index)}>
              {({ dragHandleProps, isDragging }) =>
                renderItem(item, index, dragHandleProps, isDragging)
              }
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
