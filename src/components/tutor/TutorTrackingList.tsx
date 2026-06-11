import { useNavigate } from 'react-router-dom';
import { PrinterIcon } from '@heroicons/react/24/outline';
import { useStudentTrackingStore } from '@/stores/useStudentTrackingStore';
import { generateSabanasHTML } from '@/lib/generateSabanasHTML';
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

    const handlePrintAll = () => {
        const html = generateSabanasHTML(
            allTrackingData,
            'Mtra. Laura Sánchez',
            'Ingeniería en Sistemas Computacionales',
            '2025A',
        );
        const w = window.open('', '_blank', 'width=1200,height=800');
        if (!w) return;
        w.document.write(html);
        w.document.close();
        w.focus();
        setTimeout(() => w.print(), 500);
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
                    <h1 className="text-2xl font-bold text-gray-900">Seguimiento Tutorial (Sábana)</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        {allTrackingData.length} estudiante{allTrackingData.length !== 1 ? 's' : ''} registrado{allTrackingData.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={handlePrintAll}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all duration-300"
                >
                    <PrinterIcon className="h-5 w-5" />
                    Imprimir Sábana Completa
                </button>
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
        </div>
    );
}

