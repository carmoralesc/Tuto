import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Subject } from '@/types/subject.types';
import { mockStudents } from '@/mocks/students.mock';
import { subjectsMap } from '@/data/subjects';
import { getNextAttemptLevel, getCategoryFromLevel } from '@/lib/utils/subject-level.utils';

interface ColorStyle {
  border: string;
  bg: string;
  text: string;
}

interface DraggableSubjectProps {
  subject: Subject;
  isDisabled?: boolean;
  isOverlay?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  colorStyle: ColorStyle;
}

export function DraggableSubject({
  subject,
  isDisabled,
  isOverlay,
  isSelected,
  onClick,
  colorStyle,
}: DraggableSubjectProps) {
  const student = mockStudents[0];
  const attempts = student.academicHistory.filter(a => a.subjectCode === subject.id);
  const nextLevel = getNextAttemptLevel(attempts);
  const category = nextLevel ? getCategoryFromLevel(nextLevel) : null;
  const isRepite = category === 'repite';
  const isEspecial = category === 'especial';

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: subject.id,
    disabled: isDisabled,
    data: { subject },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : isDisabled ? 0.5 : 1,
    filter: isDisabled ? 'grayscale(60%)' : undefined,
    cursor: isDisabled ? 'not-allowed' : isOverlay ? 'grabbing' : 'grab',
    boxShadow: isOverlay ? '0 4px 12px rgba(0,0,0,0.15)' : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        if (!isDragging && onClick) {
          e.stopPropagation();
          onClick();
        }
      }}
      className={`p-3 rounded-lg border-2 ${colorStyle.border} ${
        isDisabled ? 'bg-gray-100' : isSelected ? `${colorStyle.bg} ring-2 ring-inset ring-blue-300` : colorStyle.bg
      } ${
        !isDisabled && !isOverlay ? 'hover:shadow-md transition-shadow' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`font-mono text-sm font-medium px-2 py-0.5 rounded ${
            colorStyle.text
          } bg-white/60`}
        >
          {subject.code}
        </span>
        <div className="flex items-center gap-2">
          {isRepite && (
            <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
              Repite
            </span>
          )}
          {isEspecial && (
            <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800">
              Especial
            </span>
          )}
          <span className="text-xs font-medium text-gray-600">
            {subject.credits} créd.
          </span>
        </div>
      </div>
      <p
        className={`mt-1 text-sm ${
          isDisabled ? 'text-gray-400' : colorStyle.text
        } truncate`}
      >
        {subject.name}
      </p>
      {subject.prerequisites.length > 0 && (
        <p className="mt-1 text-xs text-gray-500">
          Requiere: {subject.prerequisites
            .map(id => subjectsMap.get(id)?.name || id)
            .join(', ')}
        </p>
      )}
    </div>
  );
}