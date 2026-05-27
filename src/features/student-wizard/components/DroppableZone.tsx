import { useDroppable } from "@dnd-kit/core";
import type { ReactNode } from "react";

interface DroppableZoneProps {
  id: string;
  title: string;
  count: number;
  children: ReactNode;
}

export function DroppableZone({
  id,
  title,
  count,
  children,
}: DroppableZoneProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-900">{title}</h3>
        <span className="text-sm text-gray-500">{count} materias</span>
      </div>
      <div
        ref={setNodeRef}
        className={`flex-1 rounded-lg border-2 border-dashed p-3 transition-colors ${
          isOver ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-gray-50"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
