import { useState, useMemo, useCallback } from 'react';
import {
    DndContext,
    DragOverlay,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core/dist/types';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { subjectsArray, subjectsByCodeMap } from '@/data/subjects';
import { mockStudents } from '@/mocks/students.mock';
import type { AcademicLoadProposal } from '@/types/academic-load.types';
import type { Subject } from '@/types/subject.types';
import {
    calculateRiskScore,
    getRiskCategory,
    calculateTotalCredits,
    getApprovedIds,
    hasPrerequisites,
    detectViolations,
} from '@/lib/utils';
import { getNextAttemptLevel } from '@/lib/utils/subject-level.utils';
import { DraggableSubject } from '@/features/student-wizard/components/DraggableSubject';
import { useToast } from '@/features/student-wizard/hooks/useToast';
import { ToastContainer } from '@/components/ui/ToastContainer';

const palette = [
    { border: 'border-red-400', bg: 'bg-red-50', text: 'text-red-800' },
    { border: 'border-blue-400', bg: 'bg-blue-50', text: 'text-blue-800' },
    { border: 'border-green-400', bg: 'bg-green-50', text: 'text-green-800' },
    { border: 'border-yellow-400', bg: 'bg-yellow-50', text: 'text-yellow-800' },
    { border: 'border-purple-400', bg: 'bg-purple-50', text: 'text-purple-800' },
    { border: 'border-pink-400', bg: 'bg-pink-50', text: 'text-pink-800' },
    { border: 'border-indigo-400', bg: 'bg-indigo-50', text: 'text-indigo-800' },
    { border: 'border-teal-400', bg: 'bg-teal-50', text: 'text-teal-800' },
];

interface TutorSubjectEditorProps {
    proposal: AcademicLoadProposal;
    onSave: (updatedProposal: AcademicLoadProposal) => void;
    onCancel: () => void;
}

export function TutorSubjectEditor({ proposal, onSave, onCancel }: TutorSubjectEditorProps) {
    const student = mockStudents.find(s => s.id === proposal.studentId)!;
    const allSubjects = subjectsArray;
    const { toasts, addToast, removeToast } = useToast();

    const [selected, setSelected] = useState<Subject[]>(() => {
        return proposal.selectedSubjects
            .map(sel => subjectsByCodeMap.get(sel.subjectCode))
            .filter((s): s is Subject => s != null);
    });
    const [activeId, setActiveId] = useState<string | null>(null);
    const [showConfirmSave, setShowConfirmSave] = useState(false);
    const [messageToStudent, setMessageToStudent] = useState('');

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
    );

    // Mapa de colores encadenados por prerrequisitos
    const colorMap = useMemo(() => {
        const map = new Map<string, (typeof palette)[0]>();
        let idx = 0;
        allSubjects.forEach(subject => {
            if (map.has(subject.id)) return;
            if (subject.prerequisites.length > 0) {
                const firstPrereq = subject.prerequisites[0];
                if (map.has(firstPrereq)) {
                    map.set(subject.id, map.get(firstPrereq)!);
                    return;
                }
            }
            const color = palette[idx % palette.length];
            idx++;
            map.set(subject.id, color);
        });
        return map;
    }, [allSubjects]);

    const approvedSet = useMemo(() => getApprovedIds(student), [student]);
    const selectedIds = useMemo(() => new Set(selected.map(s => s.id)), [selected]);

    // Materias disponibles = todas menos las seleccionadas Y además excluye las que ya aprobó el alumno
    const availableSubjects = useMemo(() => {
        return allSubjects.filter(s => !selectedIds.has(s.id) && !approvedSet.has(s.code));
    }, [selectedIds, approvedSet, allSubjects]);

    const especialCount = useMemo(() => {
        return selected.filter(s => {
            const attempts = student.academicHistory.filter(a => a.subjectCode === s.code);
            const nextLevel = getNextAttemptLevel(attempts);
            return nextLevel === 5 || nextLevel === 6;
        }).length;
    }, [selected, student]);

    const totalCredits = useMemo(() => calculateTotalCredits(selected), [selected]);
    const riskScore = useMemo(() => calculateRiskScore(student, selected), [student, selected]);
    const riskCategory = getRiskCategory(riskScore);
    const creditRange = useMemo(() => {
        if (especialCount > 0) {
            return { minCredits: 0, maxCredits: 20 };
        }
        return { minCredits: 20, maxCredits: 36 };
    }, [especialCount]);

    const violations = useMemo(() => {
        if (!student) return [];
        const minCredits = especialCount > 0 ? 0 : 20;
        const maxCredits = especialCount > 0 ? 20 : 36;
        return detectViolations(student, selected, { minCredits, maxCredits });
    }, [student, selected, especialCount]);

    const getBlockReason = useCallback(
        (subject: Subject): string | null => {
            if (approvedSet.has(subject.code)) return `Ya aprobó ${subject.name}.`;
            if (selectedIds.has(subject.id)) return 'Ya está en la selección.';
            if (!hasPrerequisites(subject, approvedSet)) {
                const missing = subject.prerequisites.filter(p => !approvedSet.has(p));
                const names = missing.map(code => subjectsByCodeMap.get(code)?.name || code).join(', ');
                return `Requiere aprobar: ${names}.`;
            }
            return null;
        },
        [approvedSet, selectedIds]
    );

    const canAddSubject = useCallback(
        (subject: Subject) => {
            const blockReason = getBlockReason(subject);
            const attempts = student.academicHistory.filter(a => a.subjectCode === subject.code);
            const nextLevel = getNextAttemptLevel(attempts);
            const isCursoEspecial = nextLevel === 5 || nextLevel === 6;
            const hasNormalSubjects = selected.some((s) => {
                const selectedAttempts = student.academicHistory.filter(a => a.subjectCode === s.code);
                const selectedNextLevel = getNextAttemptLevel(selectedAttempts);
                return selectedNextLevel !== 5 && selectedNextLevel !== 6;
            });

            const potentialCredits = calculateTotalCredits([...selected, subject]);
            if (blockReason) return false;
            if (especialCount >= 2) return false;

            if (especialCount === 1) {
                if (isCursoEspecial && hasNormalSubjects) return false;
                return potentialCredits <= creditRange.maxCredits;
            }

            const canAdd = potentialCredits <= creditRange.maxCredits;
            console.log('[TutorSubjectEditor] canAddSubject', {
                especialCount,
                isCursoEspecial,
                hasNormalSubjects,
                potentialCredits,
                creditRange,
                canAdd,
            });

            return canAdd;
        },
        [getBlockReason, especialCount, selected, student]
    );

    const handleSubjectClick = useCallback(
        (subject: Subject) => {
            if (selectedIds.has(subject.id)) {
                setSelected(prev => prev.filter(s => s.id !== subject.id));
            } else {
                const reason = getBlockReason(subject);
                if (reason) {
                    addToast(reason, 'error', 5000);
                    return;
                }
                if (canAddSubject(subject)) {
                    setSelected(prev => [...prev, subject]);
                }
            }
        },
        [selectedIds, getBlockReason, canAddSubject, addToast]
    );

    const handleDragStart = (event: DragStartEvent) => setActiveId(event.active.id as string);
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);
        if (!over) return;
        const subjectId = active.id as string;
        const overId = over.id as string;
        if (overId === 'selected-zone' || overId === 'available-zone') {
            const toSelected = overId === 'selected-zone';
            if (toSelected && availableSubjects.some(s => s.id === subjectId)) {
                const subject = subjectsByCodeMap.get(subjectId) || allSubjects.find(s => s.id === subjectId);
                if (subject) {
                    const reason = getBlockReason(subject);
                    if (reason) {
                        addToast(reason, 'error', 5000);
                        return;
                    }
                    if (canAddSubject(subject)) setSelected(prev => [...prev, subject]);
                }
            } else if (!toSelected && selected.some(s => s.id === subjectId)) {
                setSelected(prev => prev.filter(s => s.id !== subjectId));
            }
        }
    };

    const handleSave = () => {
        const updatedProposal: AcademicLoadProposal = {
            ...proposal,
            selectedSubjects: selected.map(s => ({ subjectCode: s.code })),
            status: 'reviewed',
            tutorNotes: messageToStudent || proposal.tutorNotes,
            submittedAt: new Date(),
        };
        onSave(updatedProposal);
    };

    const activeSubject = activeId
        ? subjectsByCodeMap.get(activeId) || allSubjects.find(s => s.id === activeId)
        : null;

    return (
        <div className="h-[calc(100vh-7em)] flex flex-col pb-4">
            {/* Panel superior con riesgo y créditos */}
            <div className="flex-shrink-0 relative z-10 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between mb-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Modificar carga</h2>
                    <p className="text-sm text-gray-600">
                        {student.firstName} {student.lastName} – {student.studentId}
                    </p>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Riesgo</p>
                        <p
                            className={`text-xl font-bold ${riskCategory === 'high'
                                ? 'text-red-600'
                                : riskCategory === 'medium'
                                    ? 'text-yellow-600'
                                    : 'text-green-600'
                                }`}
                        >
                            {riskScore}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Créditos</p>
                        <p className="text-xl font-bold text-gray-900">{totalCredits}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Especiales</p>
                        <p className="text-xl font-bold text-purple-600">{especialCount}</p>
                    </div>
                </div>
            </div>

            {/* Listas */}
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
                                <span className="text-sm text-gray-500">{availableSubjects.length}</span>
                            </div>
                            <SortableContext
                                items={availableSubjects.map(s => s.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div id="available-zone" className="flex-1 overflow-y-auto p-4">
                                    <div className="space-y-2">
                                        {availableSubjects.map(subject => (
                                            <DraggableSubject
                                                key={subject.id}
                                                subject={subject}
                                                isDisabled={!canAddSubject(subject)}
                                                onClick={() => handleSubjectClick(subject)}
                                                colorStyle={colorMap.get(subject.id)!}
                                                attempts={student.academicHistory.filter(a => a.subjectCode === subject.code)}
                                            />
                                        ))}
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
                            <SortableContext items={selected.map(s => s.id)} strategy={verticalListSortingStrategy}>
                                <div id="selected-zone" className="flex-1 overflow-y-auto p-4">
                                    <div className="space-y-2">
                                        {selected.map(subject => (
                                            <DraggableSubject
                                                key={subject.id}
                                                subject={subject}
                                                isSelected
                                                onClick={() => handleSubjectClick(subject)}
                                                colorStyle={colorMap.get(subject.id)!}
                                                attempts={student.academicHistory.filter(a => a.subjectCode === subject.code)}
                                            />
                                        ))}
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

            {/* Alertas detectadas */}
            {violations.length > 0 && (
                <div className="mt-4 bg-red-50 rounded-2xl border border-red-200 p-4">
                    <h4 className="text-sm font-semibold text-red-900 mb-2">Alertas detectadas</h4>
                    <ul className="space-y-2 text-sm text-red-800">
                        {violations.map((v, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                                <span className="mt-0.5">⚠️</span>
                                <span>{v.message}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Mensaje al alumno (opcional) */}
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                    Mensaje para el alumno (opcional)
                </label>
                <textarea
                    rows={2}
                    value={messageToStudent}
                    onChange={e => setMessageToStudent(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Escribe un mensaje..."
                />
            </div>

            {/* Botones */}
            <div className="flex-shrink-0 mt-4 flex justify-between">
                <button
                    onClick={onCancel}
                    className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                    Cancelar
                </button>
                <button
                    onClick={() => setShowConfirmSave(true)}
                    className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
                >
                    Guardar cambios
                </button>
            </div>

            {/* Modal de confirmación */}
            {showConfirmSave && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl text-center">
                        <h3 className="text-lg font-bold text-gray-900">¿Guardar cambios?</h3>
                        <p className="mt-2 text-sm text-gray-600">Se actualizará la propuesta del alumno.</p>
                        <div className="mt-6 flex justify-center gap-3">
                            <button
                                onClick={() => setShowConfirmSave(false)}
                                className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-300 hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </div>
    );
}