import React, { useMemo, useCallback } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
  useDroppable,
  useDraggable,
} from '@dnd-kit/core';
import { Subject } from '../../../types/subject';
import { checkPrerequisites } from '../../../utils/subjectValidator';
import { MAX_SPECIAL_SUBJECTS, MAX_CREDITS, MIN_CREDITS } from '../../../utils/riskCalculator';
import Badge from '../../../components/ui/Badge';

interface SubjectCardItemProps {
  subject: Subject;
  isBlocked?: boolean;
  id: string;
}

function DraggableSubjectCard({ subject, isBlocked, id }: SubjectCardItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    disabled: isBlocked,
  });

  return (
    <div
      ref={setNodeRef}
      {...(isBlocked ? {} : { ...listeners, ...attributes })}
      className={`p-3 rounded-lg border text-sm transition-all ${
        isDragging ? 'opacity-50' : ''
      } ${
        isBlocked
          ? 'bg-gray-100 border-gray-200 opacity-60 cursor-not-allowed'
          : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm cursor-grab active:cursor-grabbing'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-medium text-gray-900">{subject.code}</p>
          <p className="text-gray-600 text-xs mt-0.5">{subject.name}</p>
        </div>
        <Badge variant="default">{subject.credits} cr.</Badge>
      </div>
      {isBlocked && (
        <p className="text-xs text-red-500 mt-1">Prerrequisitos no cumplidos</p>
      )}
    </div>
  );
}

interface DroppableAreaProps {
  id: string;
  children: React.ReactNode;
  label: string;
  count?: number;
  credits?: number;
}

function DroppableArea({ id, children, label, count, credits }: DroppableAreaProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-700 text-sm">{label}</h3>
        <div className="flex gap-2">
          {count !== undefined && <Badge variant="default">{count} materias</Badge>}
          {credits !== undefined && <Badge variant={credits > 36 ? 'high' : credits < 20 ? 'medium' : 'low'}>{credits} créditos</Badge>}
        </div>
      </div>
      <div
        ref={setNodeRef}
        className={`flex-1 min-h-48 rounded-lg border-2 border-dashed p-3 space-y-2 transition-colors ${
          isOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-gray-50'
        }`}
      >
        {children}
      </div>
    </div>
  );
}

interface SubjectDndPanelProps {
  allSubjects: Subject[];
  approvedSubjects: string[];
  proposedSubjects: string[];
  specialSubjects: string[];
  onProposedChange: (proposed: string[]) => void;
}

const SubjectDndPanel = React.memo<SubjectDndPanelProps>(({
  allSubjects,
  approvedSubjects,
  proposedSubjects,
  specialSubjects,
  onProposedChange,
}) => {
  const [activeId, setActiveId] = React.useState<string | null>(null);

  const availableSubjects = useMemo(() =>
    allSubjects.filter(s =>
      !proposedSubjects.includes(s.id) &&
      !approvedSubjects.includes(s.id)
    ),
    [allSubjects, approvedSubjects, proposedSubjects]
  );

  const selectedSubjects = useMemo(() =>
    allSubjects.filter(s => proposedSubjects.includes(s.id)),
    [allSubjects, proposedSubjects]
  );

  const totalCredits = useMemo(() =>
    selectedSubjects.reduce((sum, s) => sum + s.credits, 0),
    [selectedSubjects]
  );

  const specialCount = useMemo(() =>
    selectedSubjects.filter(s => specialSubjects.includes(s.id)).length,
    [selectedSubjects, specialSubjects]
  );

  const isSubjectBlocked = useCallback((subjectId: string) => {
    if (specialCount >= MAX_SPECIAL_SUBJECTS && !proposedSubjects.includes(subjectId)) return true;
    return !checkPrerequisites(subjectId, approvedSubjects, allSubjects);
  }, [specialCount, proposedSubjects, approvedSubjects, allSubjects]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const subjectId = (active.id as string).replace('available-', '').replace('selected-', '');
    const isFromAvailable = (active.id as string).startsWith('available-');
    const isToSelected = over.id === 'selected-area' || (over.id as string).startsWith('selected-');
    const isToAvailable = over.id === 'available-area' || (over.id as string).startsWith('available-');

    if (isFromAvailable && isToSelected) {
      if (!isSubjectBlocked(subjectId)) {
        onProposedChange([...proposedSubjects, subjectId]);
      }
    } else if (!isFromAvailable && isToAvailable) {
      onProposedChange(proposedSubjects.filter(id => id !== subjectId));
    }
  }, [proposedSubjects, onProposedChange, isSubjectBlocked]);

  const activeSubject = useMemo(() =>
    activeId ? allSubjects.find(s => s.id === activeId.replace('available-', '').replace('selected-', '')) : null,
    [activeId, allSubjects]
  );

  const warnings = useMemo(() => {
    const warns: string[] = [];
    if (totalCredits > MAX_CREDITS) warns.push(`Excede el máximo de ${MAX_CREDITS} créditos.`);
    if (totalCredits > 0 && totalCredits < MIN_CREDITS) warns.push(`Mínimo de ${MIN_CREDITS} créditos requeridos.`);
    if (specialCount >= MAX_SPECIAL_SUBJECTS) warns.push(`Máximo ${MAX_SPECIAL_SUBJECTS} materias especiales. No se pueden agregar más materias.`);
    return warns;
  }, [totalCredits, specialCount]);

  return (
    <DndContext collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      {warnings.length > 0 && (
        <div className="mb-4 space-y-1">
          {warnings.map((w, i) => (
            <div key={i} className="flex items-center gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {w}
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-4">
        <DroppableArea id="available-area" label="Materias Disponibles" count={availableSubjects.length}>
          {availableSubjects.map(subject => (
            <DraggableSubjectCard
              key={subject.id}
              id={`available-${subject.id}`}
              subject={subject}
              isBlocked={isSubjectBlocked(subject.id)}
            />
          ))}
          {availableSubjects.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">No hay más materias disponibles</p>
          )}
        </DroppableArea>

        <DroppableArea id="selected-area" label="Materias Seleccionadas" count={selectedSubjects.length} credits={totalCredits}>
          {selectedSubjects.map(subject => (
            <DraggableSubjectCard
              key={subject.id}
              id={`selected-${subject.id}`}
              subject={subject}
              isBlocked={false}
            />
          ))}
          {selectedSubjects.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">Arrastra materias aquí</p>
          )}
        </DroppableArea>
      </div>

      <DragOverlay>
        {activeSubject && (
          <div className="p-3 rounded-lg border bg-white border-blue-400 shadow-lg text-sm opacity-90">
            <p className="font-medium">{activeSubject.code}</p>
            <p className="text-gray-600 text-xs">{activeSubject.name}</p>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
});

SubjectDndPanel.displayName = 'SubjectDndPanel';
export default SubjectDndPanel;
