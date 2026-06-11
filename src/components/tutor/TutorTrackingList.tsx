import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, PrinterIcon } from '@heroicons/react/24/outline';
import { useStudentTrackingStore } from '@/stores/useStudentTrackingStore';
import { generateSabanasHTML } from '@/lib/generateSabanasHTML';
import { generateAttendanceListHTML, generateMockAttendances } from '@/lib/generateAttendanceListHTML';
import type { StudentTrackingData } from '@/types/student-tracking.types';

const NEC_KEYS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'] as const;

function checkOrDash(val: boolean) {
    return val ? '✓' : '–';
}

function totalMR(data: StudentTrackingData): number {
    return data.semestres.reduce((sum, s) => sum + s.materiasReprobadas, 0);
}

export function TutorTrackingList() {
    const navigate = useNavigate();
    const { allTrackingData } = useStudentTrackingStore();
    const [showAttendance, setShowAttendance] = useState(false);

    const attendanceData = useMemo(() => {
        const students = allTrackingData.map((s) => ({ name: s.fullName }));
        const attendances = generateMockAttendances(students.length);
        return { students, attendances };
    }, [allTrackingData]);

    const handlePrint = () => {
        if (showAttendance) {
            const html = generateAttendanceListHTML(
                attendanceData.students,
                attendanceData.attendances,
                'Ingeniería en Sistemas Computacionales',
                'Mtra. Laura Sánchez',
                'Ene-Jun 2026',
                '2026-A',
            );
            const w = window.open('', '_blank', 'width=1200,height=800');
            if (!w) return;
            w.document.write(html);
            w.document.close();
            w.focus();
            w.onafterprint = () => w.close();
            setTimeout(() => w.print(), 400);
        } else {
            const html = generateSabanasHTML(
                allTrackingData,
                'Mtra. Laura Sánchez',
                'Ingeniería en Sistemas Computacionales',
                '2026-A',
            );
            const w = window.open('', '_blank', 'width=1200,height=800');
            if (!w) return;
            w.document.write(html);
            w.document.close();
            w.focus();
            setTimeout(() => w.print(), 500);
        }
    };

    if (allTrackingData.length === 0) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                <h2 className="text-lg font-semibold text-gray-900">Sin registros de seguimiento</h2>
                <p className="mt-2 text-sm text-gray-500">Aún no hay estudiantes con seguimiento tutorial.</p>
            </div>
        );
    }

    return (
        <div className="w-full px-4 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {showAttendance ? 'Lista de Asistencia' : 'Seguimiento Tutorial (Sábana)'}
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        {showAttendance
                            ? `${attendanceData.students.length} estudiante${attendanceData.students.length !== 1 ? 's' : ''} — 16 semanas`
                            : `${allTrackingData.length} estudiante${allTrackingData.length !== 1 ? 's' : ''} registrado${allTrackingData.length !== 1 ? 's' : ''}`
                        }
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setShowAttendance((v) => !v)}
                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all duration-300"
                    >
                        <EyeIcon className="h-5 w-5" />
                        {showAttendance ? 'Ver Sábana Completa' : 'Lista de Asistencia'}
                    </button>
                    <button
                        type="button"
                        onClick={handlePrint}
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all duration-300"
                    >
                        <PrinterIcon className="h-5 w-5" />
                        Imprimir
                    </button>
                </div>
            </div>

            {showAttendance ? (
                /* --- Lista de Asistencia (solo vista, sin link a detalle) --- */
                <>
                    <div className="rounded-2xl bg-white/95 shadow-2xl ring-1 ring-black/5 backdrop-blur p-6 mb-3">
                        <h2 className="text-lg font-bold text-gray-900">Instituto Tecnológico de Orizaba</h2>
                        <h3 className="text-md font-semibold text-gray-700 mt-1">LISTA DE ASISTENCIA</h3>
                        <p className="text-sm text-gray-600 mt-2">
                            <strong>Carrera:</strong> Ingeniería en Sistemas Computacionales &nbsp;|&nbsp;
                            <strong>Tutor:</strong> Mtra. Laura Sánchez &nbsp;|&nbsp;
                            <strong>Periodo:</strong> Ene-Jun 2026 &nbsp;|&nbsp;
                            <strong>Semestre:</strong> 2026-A
                        </p>
                    </div>
                    <div
                        className="rounded-2xl bg-white/95 shadow-2xl ring-1 ring-black/5 backdrop-blur overflow-x-auto scrollbar-hidden scrollbar-on-hover table-tutortec-wrapper"
                        onWheel={(e) => {
                            const el = e.currentTarget;
                            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                                el.scrollLeft += e.deltaY;
                                e.preventDefault();
                            }
                        }}
                    >
                        <table className="table-tutortec">
                            <thead>
                                <tr>
                                    <th rowSpan={2} className="w-10">No.</th>
                                    <th rowSpan={2} className="text-left min-w-[180px]">Nombre</th>
                                    <th colSpan={16}>Semanas</th>
                                </tr>
                                <tr>
                                    {Array.from({ length: 16 }, (_, i) => (
                                        <th key={i} className="w-7">{i + 1}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {attendanceData.students.map((s, idx) => (
                                    <tr key={idx}>
                                        <td className="text-center text-gray-600">{idx + 1}</td>
                                        <td className="whitespace-nowrap">{s.name}</td>
                                        {Array.from({ length: 16 }, (_, w) => (
                                            <td key={w} className="text-center">
                                                {attendanceData.attendances[idx]?.[w] ? (
                                                    <span className="text-blue-600 font-bold">X</span>
                                                ) : ''}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="text-xs text-gray-400 mt-3 text-center">
                        Lista de asistencia — Vista previa. Usa el botón <strong>Imprimir</strong> para exportar.
                    </p>
                </>
            ) : (
                /* --- Sábana Completa --- */
                <>
                    <div
                        className="rounded-2xl bg-white/95 shadow-2xl ring-1 ring-black/5 backdrop-blur overflow-x-auto scrollbar-hidden scrollbar-on-hover table-tutortec-wrapper"
                        onWheel={(e) => {
                            const el = e.currentTarget;
                            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                                el.scrollLeft += e.deltaY;
                                e.preventDefault();
                            }
                        }}
                    >
                        <table className="table-tutortec">
                            <thead>
                                <tr>
                                    <th rowSpan={2} className="w-10">No.</th>
                                    <th rowSpan={2} className="w-28">Núm. Control</th>
                                    <th rowSpan={2} className="text-left">Nombre</th>
                                    <th rowSpan={2} className="w-14">P.B.</th>
                                    <th rowSpan={2} className="w-14">P.E.A.</th>
                                    <th colSpan={10} className="bg-blue-100">
                                        Detección de necesidades de tutoría básica
                                    </th>
                                    <th rowSpan={2} className="w-10">T1</th>
                                    <th rowSpan={2} className="w-10">T2</th>
                                    <th rowSpan={2} className="w-10">T3</th>
                                    <th rowSpan={2} className="w-10">T4</th>
                                    <th colSpan={4} className="bg-green-100">
                                        TEST 5
                                    </th>
                                    <th rowSpan={2} className="w-12 bg-red-50">
                                        MR Total
                                    </th>
                                </tr>
                                <tr>
                                    {NEC_KEYS.map((k) => (
                                        <th key={k} className="w-7 bg-blue-50">{k}</th>
                                    ))}
                                    <th className="w-10 bg-green-50">ORG</th>
                                    <th className="w-10 bg-green-50">TE</th>
                                    <th className="w-10 bg-green-50">M</th>
                                    <th className="w-10 bg-green-50">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allTrackingData.map((student, idx) => (
                                    <tr
                                        key={student.studentId}
                                        onClick={() => navigate(`/tutor/seguimiento/${student.studentId}`)}
                                        className="cursor-pointer hover:bg-blue-50/50 transition-colors"
                                    >
                                        <td className="text-center text-gray-600">{idx + 1}</td>
                                        <td className="text-center font-mono">{student.studentId}</td>
                                        <td className="whitespace-nowrap">{student.fullName}</td>
                                        <td className="text-center font-medium">{student.promedioBachillerato}</td>
                                        <td className="text-center font-medium">{student.promedioExamenAdmision}</td>
                                        {NEC_KEYS.map((k) => (
                                            <td key={k} className="text-center">
                                                <span className={student.necesidades[k] ? 'text-green-600 font-bold' : 'text-gray-300'}>
                                                    {checkOrDash(student.necesidades[k])}
                                                </span>
                                            </td>
                                        ))}
                                        <td className="text-center font-medium">{student.test1}</td>
                                        <td className="text-center font-medium">{student.test2}</td>
                                        <td className="text-center font-medium">{student.test3}</td>
                                        <td className="text-center font-medium">{student.test4}</td>
                                        <td className="text-center bg-green-50/30">{student.test5.organizacion}</td>
                                        <td className="text-center bg-green-50/30">{student.test5.tecnicasEstudio}</td>
                                        <td className="text-center bg-green-50/30">{student.test5.motivacion}</td>
                                        <td className="text-center font-bold bg-green-50/50">{student.test5.total}</td>
                                        <td className="text-center font-bold">
                                            <span className={totalMR(student) > 0 ? 'text-red-600' : 'text-gray-400'}>{totalMR(student)}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <p className="text-xs text-gray-400 mt-3 text-center">
                        Haz clic en cualquier fila para ver el detalle individual del estudiante.
                    </p>
                </>
            )}
        </div>
    );
}

