import { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useWizardStore } from "@/stores/useWizardStore";
import { mockStudents } from "@/mocks/students.mock";
import { subjectsArray, subjectsByCodeMap, subjectsMap } from "@/data/subjects";
import {
  getApprovedIds,
  hasPrerequisites,
  calculateTotalCredits,
} from "@/lib/utils";
import { getNextAttemptLevel } from "@/lib/utils/subject-level.utils";
import { DraggableSubject } from "./DraggableSubject";
import { WizardNavigation } from "./WizardNavigation";
import { ToastContainer } from "@/components/ui/ToastContainer";
import { useToast } from "../hooks/useToast";
import type { Subject } from "@/types/subject.types";

const palette = [
  { border: "border-red-400", bg: "bg-red-50", text: "text-red-800" },
  { border: "border-blue-400", bg: "bg-blue-50", text: "text-blue-800" },
  { border: "border-green-400", bg: "bg-green-50", text: "text-green-800" },
  { border: "border-yellow-400", bg: "bg-yellow-50", text: "text-yellow-800" },
  { border: "border-purple-400", bg: "bg-purple-50", text: "text-purple-800" },
  { border: "border-pink-400", bg: "bg-pink-50", text: "text-pink-800" },
  { border: "border-indigo-400", bg: "bg-indigo-50", text: "text-indigo-800" },
  { border: "border-teal-400", bg: "bg-teal-50", text: "text-teal-800" },
];

export function SubjectSelectionStep() {
  const { personalData, selectedSubjects, setSelectedSubjects, setCurrentStep, markStepCompleted } =
    useWizardStore();
  const navigate = useNavigate();
  const student = useMemo(
    () =>
      mockStudents.find(
        (s) => s.id === personalData.studentId || s.studentId === personalData.studentId,
      ) ?? mockStudents[0],
    [personalData.studentId],
  );
  const allSubjects = subjectsArray;
  const { toasts, addToast, removeToast } = useToast();

  const [selected, setSelected] = useState<Subject[]>(() =>
    allSubjects.filter((s) => selectedSubjects.includes(s.code)),
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const [creditsPulse, setCreditsPulse] = useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  // Colores heredados por prerrequisitos
  const colorMap = useMemo(() => {
    const map = new Map<string, (typeof palette)[0]>();
    let idx = 0;
    allSubjects.forEach((subject) => {
      if (map.has(subject.id)) return;
      if (subject.prerequisites.length > 0) {
        const firstPrereq = subject.prerequisites[0];
        if (map.has(firstPrereq)) {
          map.set(subject.id, map.get(firstPrereq)!);
          return;
        }
      }
      map.set(subject.id, palette[idx % palette.length]);
      idx++;
    });
    return map;
  }, [allSubjects]);

  const approvedSet = useMemo(() => getApprovedIds(student), [student]);
  const selectedIds = useMemo(
    () => new Set(selected.map((s) => s.id)),
    [selected],
  );
  const availableSubjects = useMemo(
    () => allSubjects.filter((s) => !selectedIds.has(s.id)),
    [selectedIds, allSubjects],
  );

  const especialCount = useMemo(() => {
    return selected.filter((s) => {
      const attempts = student.academicHistory.filter(
        (a) => a.subjectCode === s.code,
      );
      const nextLevel = getNextAttemptLevel(attempts);
      return nextLevel === 5 || nextLevel === 6;
    }).length;
  }, [selected, student]);

  const getBlockReason = useCallback(
    (subject: Subject): string | null => {
      if (approvedSet.has(subject.code)) return `Ya aprobaste ${subject.name}.`;
      if (selectedIds.has(subject.id)) return "Ya está en tu selección.";
      if (!hasPrerequisites(subject, approvedSet)) {
        const missing = subject.prerequisites.filter(
          (p) => !approvedSet.has(p),
        );
        const names = missing
          .map((code) => subjectsByCodeMap.get(code)?.name || code)
          .join(", ");
        return `Requiere aprobar: ${names}.`;
      }
      return null;
    },
    [approvedSet, selectedIds],
  );

  const canAddSubject = useCallback(
    (subject: Subject) => {
      const blockReason = getBlockReason(subject);
      const attempts = student.academicHistory.filter(
        (a) => a.subjectCode === subject.code,
      );
      const nextLevel = getNextAttemptLevel(attempts);
      const isCursoEspecial = nextLevel === 5 || nextLevel === 6;
      const hasNormalSubjects = selected.some((s) => {
        const selectedAttempts = student.academicHistory.filter(
          (a) => a.subjectCode === s.code,
        );
        const selectedNextLevel = getNextAttemptLevel(selectedAttempts);
        return selectedNextLevel !== 5 && selectedNextLevel !== 6;
      });

      const potentialCredits = calculateTotalCredits([...selected, subject]);
      if (blockReason) return false;
      if (especialCount >= 2) return false;

      if (especialCount === 1) {
        if (isCursoEspecial && hasNormalSubjects) return false;
        return potentialCredits <= 20;
      }

      const canAdd = potentialCredits <= 36;
      console.log('[SubjectSelectionStep] canAddSubject', {
        especialCount,
        isCursoEspecial,
        hasNormalSubjects,
        potentialCredits,
        canAdd,
      });

      return canAdd;
    },
    [getBlockReason, student, especialCount, selected],
  );

  const totalCredits = useMemo(
    () => calculateTotalCredits(selected),
    [selected],
  );

  const creditRange = useMemo(() => {
    if (especialCount > 0) {
      return { minCredits: 0, maxCredits: 20 };
    }
    return { minCredits: 20, maxCredits: 36 };
  }, [especialCount]);

  const isCreditsOutOfRange =
    totalCredits < creditRange.minCredits || totalCredits > creditRange.maxCredits;

  useEffect(() => {
    setCreditsPulse(true);
    const pulseTimer = setTimeout(() => setCreditsPulse(false), 180);
    return () => clearTimeout(pulseTimer);
  }, [totalCredits]);

  // Mover materia entre listas (compartido por click y drag)
  const moveSubject = useCallback(
    (subjectId: string, toSelected: boolean) => {
      const subject = subjectsMap.get(subjectId);
      if (!subject) return;

      if (toSelected) {
        const reason = getBlockReason(subject);
        if (reason) {
          addToast(reason, "error", 5000);
          return;
        }
        if (canAddSubject(subject)) {
          setSelected((prev) => [...prev, subject]);
        }
      } else {
        setSelected((prev) => prev.filter((s) => s.id !== subjectId));
      }
    },
    [getBlockReason, canAddSubject, addToast],
  );

  // Click en una materia → alternar entre listas
  const handleSubjectClick = useCallback(
    (subject: Subject) => {
      if (selectedIds.has(subject.id)) {
        moveSubject(subject.id, false);
      } else {
        moveSubject(subject.id, true);
      }
    },
    [selectedIds, moveSubject],
  );

  // Drag & Drop handlers
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const subjectId = active.id as string;
    const overId = over.id as string;

    // Si se soltó en la zona "selected-zone" o "available-zone"
    if (overId === "selected-zone" || overId === "available-zone") {
      const toSelected = overId === "selected-zone";
      // Solo mover si la materia está en la zona contraria (evitar doble añadido)
      if (toSelected && availableSubjects.some((s) => s.id === subjectId)) {
        moveSubject(subjectId, true);
      } else if (!toSelected && selected.some((s) => s.id === subjectId)) {
        moveSubject(subjectId, false);
      }
    }
    // Si se soltó sobre otra materia (reordenamiento) → no hacemos nada especial
    // (la reordenación dentro de cada lista la maneja SortableContext)
  };

  const canSubmit = useMemo(() => {
    const total = totalCredits;
    if (especialCount === 2) {
      return selected.length === 2;
    }
    if (especialCount === 1) {
      return total <= 20;
    }
    return total >= 20 && total <= 36;
  }, [especialCount, totalCredits, selected.length]);

  const handleNext = () => {
    setShowConfirmModal(true);
  };

  const confirmNext = () => {
    setShowConfirmModal(false);
    setSelectedSubjects(selected.map((s) => s.code));
    markStepCompleted(5);
    setCurrentStep(6);
    navigate("/wizard/paso-6");
  };

  const activeSubject = activeId ? subjectsMap.get(activeId) : null;

  return (
    <div className="h-[calc(100vh-7em)] flex flex-col pb-4">
      {/* Cabecera con título y toast de créditos */}
      <div className="flex-shrink-0 relative z-10 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Selecciona tus materias
          </h2>
          <p className="max-w-2xl text-sm text-gray-600">
            Arrastra o haz clic para mover materias entre las listas.
          </p>
        </div>

        {/* Toast de créditos (absoluto sobre el contenido, no desplaza nada) */}
        <div className="absolute -top-2 right-0 z-20">
          <div
            className={`rounded-2xl border backdrop-blur shadow-lg px-4 py-3 transition-all duration-300 ease-out overflow-hidden ${isCreditsOutOfRange
              ? "border-red-200 bg-red-50/95"
              : "border-blue-200 bg-blue-50/95"
              } w-[22rem]`}
          >
            <div className="flex items-start justify-between gap-4">
              <div
                className="min-w-0"
              >
                <p
                  className={`text-xs font-semibold uppercase tracking-[0.24em] ${isCreditsOutOfRange ? "text-red-700" : "text-blue-700"
                    }`}
                >
                  Resumen de créditos
                </p>
                <div
                  className={`mt-1 flex flex-wrap items-center gap-2 text-sm ${isCreditsOutOfRange ? "text-red-900" : "text-blue-900"
                    }`}
                >
                  {creditRange.minCredits > 0 && <span>Mín {creditRange.minCredits}</span>}
                  {creditRange.minCredits > 0 && (
                    <span className={isCreditsOutOfRange ? "text-red-300" : "text-blue-300"}>
                      •
                    </span>
                  )}
                  <span>{especialCount > 0 ? "Máx 20" : "Máx 36"}</span>
                  {especialCount > 0 && (
                    <>
                      <span className={isCreditsOutOfRange ? "text-red-300" : "text-blue-300"}>
                        •
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToast(
                            `Cursos especiales en selección: ${especialCount}/2`,
                            "info",
                            10000,
                          );
                        }}
                        className="font-medium underline decoration-current underline-offset-2 hover:text-current"
                      >
                        Esp: {especialCount}/2
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div
                className={`shrink-0 min-w-[6rem] text-right transition-colors duration-300 ease-out ${isCreditsOutOfRange ? "text-red-700" : "text-gray-900"
                  }`}
              >
                <span
                  key={totalCredits}
                  className={`block text-3xl font-bold leading-none tabular-nums transition-all duration-200 ease-out ${creditsPulse ? "scale-105 opacity-90" : "scale-100 opacity-100"
                    }`}
                >
                  {totalCredits}
                </span>
                <span
                  className={`block text-[0.5rem] font-semibold uppercase tracking-[0.24em] ${isCreditsOutOfRange ? "text-red-700" : "text-blue-700"
                    }`}
                >
                  créditos
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Zona de arrastre con listas */}
      <div className="flex-1 min-h-0">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid gap-6 h-full xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.85fr)]">
            {/* Zona disponible */}
            <section className="flex flex-col min-h-0 rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 flex-shrink-0">
                <h3 className="font-medium text-gray-900">Disponibles</h3>
                <span className="text-sm text-gray-500">
                  {availableSubjects.length}
                </span>
              </div>
              <SortableContext
                items={availableSubjects.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                <div id="available-zone" className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-2">
                    {availableSubjects.map((subject) => (
                      <DraggableSubject
                        key={subject.id}
                        subject={subject}
                        isDisabled={!canAddSubject(subject)}
                        onClick={() => handleSubjectClick(subject)}
                        colorStyle={colorMap.get(subject.id)!}
                      />
                    ))}
                    {availableSubjects.length === 0 && (
                      <p className="text-gray-500 text-center py-8">
                        No hay más materias
                      </p>
                    )}
                  </div>
                </div>
              </SortableContext>
            </section>

            {/* Zona seleccionada */}
            <section className="flex flex-col min-h-0 rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 flex-shrink-0">
                <h3 className="font-medium text-gray-900">Seleccionadas</h3>
                <span className="text-sm text-gray-500">{selected.length}</span>
              </div>
              <SortableContext
                items={selected.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                <div id="selected-zone" className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-2">
                    {selected.map((subject) => (
                      <DraggableSubject
                        key={subject.id}
                        subject={subject}
                        isSelected
                        onClick={() => handleSubjectClick(subject)}
                        colorStyle={colorMap.get(subject.id)!}
                      />
                    ))}
                    {selected.length === 0 && (
                      <p className="text-gray-500 text-center py-8">
                        Haz clic o arrastra materias aquí
                      </p>
                    )}
                  </div>
                </div>
              </SortableContext>
            </section>
          </div>

          <DragOverlay>
            {activeSubject && (
              <DraggableSubject
                subject={activeSubject}
                isOverlay
                colorStyle={colorMap.get(activeSubject.id)!}
              />
            )}
          </DragOverlay>
        </DndContext>
      </div>

      <WizardNavigation
        onPrevious={() => navigate("/wizard/paso-4")}
        onNext={handleNext}
        isNextDisabled={!canSubmit}
        leftText="Los cambios se guardan al avanzar."
      />


      <ToastContainer toasts={toasts} onRemove={removeToast} />
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900">Confirmar materias</h3>
            <p className="mt-1 text-sm text-gray-600">
              Estas son las materias que incluirás en tu carga académica.
            </p>

            <div className="mt-4 max-h-64 overflow-y-auto space-y-2">
              {selected.map((subject) => (
                <div
                  key={subject.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{subject.name}</p>
                    <p className="text-xs text-gray-500">{subject.code}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    {subject.credits} créd.
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3">
              <span className="text-sm text-gray-600">Total de créditos</span>
              <span className="text-xl font-bold text-gray-900">{totalCredits}</span>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmNext}
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
              >
                Confirmar y continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
