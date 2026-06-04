import { useCallback, useMemo, useState } from 'react';
import { PencilIcon } from '@heroicons/react/24/outline';
import { SEMESTER_ACTIVITIES, TOTAL_SEMESTERS } from '@/constants/tracking-activities';
import type { SemesterTracking } from '@/types/student-tracking.types';

interface StudentTrackingTableProps {
    semestres: SemesterTracking[];
    studentId: string;
    onUpdateSemester: (
        studentId: string,
        semesterIndex: number,
        data: Partial<SemesterTracking>,
    ) => void;
    editable?: boolean;
}

// Agrupa semestres en bloques de 4
const SEMESTER_GROUPS = [
    { label: '1° – 4° Semestre', range: [1, 2, 3, 4] },
    { label: '5° – 8° Semestre', range: [5, 6, 7, 8] },
    { label: '9° – 12° Semestre', range: [9, 10, 11, 12] },
];

function getDisplayActivities(semesterNumber: number, actividades: string[]): string[] {
    const predefined = SEMESTER_ACTIVITIES[semesterNumber] ?? [];
    if (actividades.length > 0) return actividades;
    return predefined.map((a) => {
        const code = a.split(':')[0].trim();
        return code;
    });
}

export function StudentTrackingTable({
    semestres,
    studentId,
    onUpdateSemester,
    editable = true,
}: StudentTrackingTableProps) {
    const [editingSemester, setEditingSemester] = useState<number | null>(null);
    const [editMR, setEditMR] = useState<number>(0);
    const [editAct, setEditAct] = useState<string>('');

    const normalizedSemestres = useMemo(() => {
        const result = [...semestres];
        while (result.length < TOTAL_SEMESTERS) {
            result.push({
                semester: result.length + 1,
                materiasReprobadas: 0,
                actividades: [],
            });
        }
        return result;
    }, [semestres]);

    const totalMR = useMemo(
        () => normalizedSemestres.reduce((sum, s) => sum + s.materiasReprobadas, 0),
        [normalizedSemestres],
    );

    const startEdit = useCallback(
        (semesterIndex: number, current: SemesterTracking) => {
            setEditingSemester(semesterIndex);
            setEditMR(current.materiasReprobadas);
            setEditAct(current.actividades.join(', '));
        },
        [],
    );

    const saveEdit = useCallback(() => {
        if (editingSemester === null) return;
        const parsedActs = editAct
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
        onUpdateSemester(studentId, editingSemester, {
            materiasReprobadas: editMR,
            actividades: parsedActs,
        });
        setEditingSemester(null);
    }, [editingSemester, editMR, editAct, studentId, onUpdateSemester]);

    const cancelEdit = useCallback(() => {
        setEditingSemester(null);
    }, []);

    return (
        <div className="space-y-6">
            {SEMESTER_GROUPS.map((group) => (
                <div key={group.label} className="overflow-x-auto">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">{group.label}</h4>
                    <table className="w-full min-w-[600px] border-collapse text-sm">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700">
                                    Semestre
                                </th>
                                <th className="border border-gray-200 px-3 py-2 text-center font-semibold text-gray-700 w-20">
                                    MR
                                </th>
                                <th className="border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700">
                                    Actividades realizadas
                                </th>
                                {editable ? (
                                    <th className="border border-gray-200 px-3 py-2 text-center font-semibold text-gray-700 w-16">
                                        Editar
                                    </th>
                                ) : null}
                            </tr>
                        </thead>
                        <tbody>
                            {group.range.map((semNum) => {
                                const idx = semNum - 1;
                                const sem = normalizedSemestres[idx];
                                if (!sem) return null;
                                const isEditing = editingSemester === idx;

                                return (
                                    <tr key={semNum} className={isEditing ? 'bg-blue-50' : 'hover:bg-gray-50'}>
                                        <td className="border border-gray-200 px-3 py-2 font-medium text-gray-900">
                                            {semNum}°
                                        </td>
                                        <td className="border border-gray-200 px-3 py-2 text-center">
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    min={0}
                                                    max={20}
                                                    value={editMR}
                                                    onChange={(e) => setEditMR(Number(e.target.value))}
                                                    className="w-16 rounded border border-gray-300 px-2 py-1 text-center text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none"
                                                />
                                            ) : (
                                                <span className="font-semibold text-gray-900">
                                                    {sem.materiasReprobadas}
                                                </span>
                                            )}
                                        </td>
                                        <td className="border border-gray-200 px-3 py-2">
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editAct}
                                                    onChange={(e) => setEditAct(e.target.value)}
                                                    placeholder="A1, A2, A3..."
                                                    className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none"
                                                />
                                            ) : (
                                                <div className="flex flex-wrap gap-1">
                                                    {getDisplayActivities(semNum, sem.actividades).map(
                                                        (act, i) => (
                                                            <span
                                                                key={i}
                                                                className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800"
                                                            >
                                                                {act}
                                                            </span>
                                                        ),
                                                    )}
                                                    {sem.actividades.length === 0 && (
                                                        <span className="text-xs text-gray-400">Sin actividades</span>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                        {editable ? (
                                            <td className="border border-gray-200 px-3 py-2 text-center">
                                                {isEditing ? (
                                                    <div className="flex gap-1 justify-center">
                                                        <button
                                                            type="button"
                                                            onClick={saveEdit}
                                                            className="rounded bg-green-600 px-2 py-1 text-xs font-medium text-white hover:bg-green-700"
                                                        >
                                                            ✓
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={cancelEdit}
                                                            className="rounded bg-gray-300 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-400"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => startEdit(idx, sem)}
                                                        className="rounded p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
                                                    >
                                                        <PencilIcon className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </td>
                                        ) : null}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ))}

            {/* Total MR */}
            <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 text-right">
                <span className="text-sm font-semibold text-gray-700">
                    Total de materias reprobadas:{' '}
                </span>
                <span className="text-lg font-bold text-red-600">{totalMR}</span>
            </div>
        </div>
    );
}

// Print-only version (non-editable)
export function StudentTrackingTablePrint({
    semestres,
}: {
    semestres: SemesterTracking[];
}) {
    const normalizedSemestres = useMemo(() => {
        const result = [...semestres];
        while (result.length < TOTAL_SEMESTERS) {
            result.push({
                semester: result.length + 1,
                materiasReprobadas: 0,
                actividades: [],
            });
        }
        return result;
    }, [semestres]);

    const totalMR = useMemo(
        () => normalizedSemestres.reduce((sum, s) => sum + s.materiasReprobadas, 0),
        [normalizedSemestres],
    );

    return (
        <div className="tracking-print-table space-y-6">
            {SEMESTER_GROUPS.map((group) => (
                <div key={group.label}>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">{group.label}</h4>
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 px-2 py-1 text-left">Semestre</th>
                                <th className="border border-gray-300 px-2 py-1 text-center w-16">MR</th>
                                <th className="border border-gray-300 px-2 py-1 text-left">Actividades</th>
                            </tr>
                        </thead>
                        <tbody>
                            {group.range.map((semNum) => {
                                const idx = semNum - 1;
                                const sem = normalizedSemestres[idx];
                                if (!sem) return null;
                                return (
                                    <tr key={semNum}>
                                        <td className="border border-gray-300 px-2 py-1">{semNum}°</td>
                                        <td className="border border-gray-300 px-2 py-1 text-center">{sem.materiasReprobadas}</td>
                                        <td className="border border-gray-300 px-2 py-1">
                                            {getDisplayActivities(semNum, sem.actividades).join(', ') || '—'}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ))}
            <div className="text-right font-bold">
                Total MR: <span className="text-red-600">{totalMR}</span>
            </div>
        </div>
    );
}
