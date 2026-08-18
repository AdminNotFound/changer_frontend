'use client';

import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

type SortableItemProps = {
  id: string;
  children: React.ReactNode;
  className?: string;
};

export function SortableItem({ id, children, className }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cn(
        'relative rounded-xl border border-gray-100 bg-gray-50/50',
        isDragging && 'z-10 opacity-90 shadow-md',
        className
      )}
    >
      <button
        type="button"
        className="absolute left-2 top-3 rounded-md p-1 text-gray-400 hover:bg-white hover:text-gray-600 cursor-grab active:cursor-grabbing"
        aria-label="Drag to reorder"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <div className="pl-10 pr-3 py-3">{children}</div>
    </div>
  );
}

type SortableListProps = {
  ids: string[];
  onReorder: (from: number, to: number) => void;
  children: React.ReactNode;
  className?: string;
};

export function SortableList({ ids, onReorder, children, className }: SortableListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    if (oldIndex === -1 || newIndex === -1) return;
    onReorder(oldIndex, newIndex);
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div className={cn('space-y-3', className)}>{children}</div>
      </SortableContext>
    </DndContext>
  );
}
