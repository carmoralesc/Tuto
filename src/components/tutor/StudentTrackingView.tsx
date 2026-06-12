import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, PrinterIcon } from '@heroicons/react/24/outline';
import { useStudentTrackingStore } from '@/stores/useStudentTrackingStore';
import { generateSingleSabanasHTML } from '@/lib/generateSabanasHTML';
import { NECESIDADES_LABELS } from '@/constants/tracking-activities';
import type { StudentTrackingData } from '@/types/student-tracking.types';

const TEST1_LABELS: Record<string, string> = {
    A: 'Auditivo', V: 'Visual', K: 'Kinestésico',
};
const TEST2_LABELS: Record<string, string> = {
    A: 'Activo', R: 'Reflexivo', T: 'Teórico', P: 'Pragmático',
};
const TEST3_LABELS: Record<string, string> = {
    N1: 'Autoestima alta', N2: 'Autoestima media-alta',
    N3: 'Autoestima media-baja', N4: 'Autoestima baja',
};
const TEST4_LABELS: Record<string, string> = {
    A: 'Asertivo', NA: 'No asertivo',
};

function totalMR(d: StudentTrackingData): number {
    return d.semestres.reduce((sum, sm) => sum + sm.materiasReprobadas, 0);
}

export function StudentTrackingView() {
    const { studentId } = useParams<{ studentId: string }>();
    const navigate = useNavigate();
    const { trackingData, loadTrackingByStudentId } = useStudentTrackingStore();

    useEffect(() => {
        if (studentId) {
            loadTrackingByStudentId(studentId);
        }
    }, [studentId, loadTrackingByStudentId]);

    const handlePrint = () => {
        if (!trackingData) return;
        const html = generateSingleSabanasHTML(
            trackingData,
            'Mtra. Laura Sánchez',
            'Ingeniería en Sistemas Computacionales',
            '2025A',
        );
        const w = window.open('', '_blank', 'width=900,height=700');
        if (!w) return;
        w.document.write(html);
        w.document.close();
        w.focus();
        // Imprimir directamente; cerrar al terminar
        w.onafterprint = () => w.close();
        setTimeout(() => w.print(), 400);
    };

    if (!trackingData) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                <p className="text-gray-500">Estudiante no encontrado.</p>
                <button
                    onClick={() => navigate('/tutor/seguimiento')}
                    className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                    Volver a la lista
                </button>
            </div>
        );
    }

    const necesidadesActivas = Object.entries(trackingData.necesidades)
        .filter(([, val]) => val)
        .map(([key]) => NECESIDADES_LABELS[key] ?? key);

    return (
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <button
                        onClick={() => navigate('/tutor/seguimiento')}
                        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-2"
                    >
                        <ArrowLeftIcon className="h-4 w-4" />
                        Volver al seguimiento
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Seguimiento Tutorial de {trackingData.fullName}
                    </h1>
                    <p className="text-sm text-gray-600">{trackingData.studentId}</p>
                </div>
                <button
                    onClick={handlePrint}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all duration-300"
                >
                    <PrinterIcon className="h-5 w-5" />
                    Imprimir Sábana
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white/95 shadow-2xl ring-1 ring-black/5 backdrop-blur p-4">
                    <span className="text-sm text-gray-500">Promedio Bachillerato (P.B.)</span>
                    <p className="text-2xl font-bold text-gray-900">{trackingData.promedioBachillerato}</p>
                </div>
                <div className="rounded-2xl bg-white/95 shadow-2xl ring-1 ring-black/5 backdrop-blur p-4">
                    <span className="text-sm text-gray-500">Promedio Examen Admisión (P.E.A.)</span>
                    <p className="text-2xl font-bold text-gray-900">{trackingData.promedioExamenAdmision}</p>
                </div>
            </div>

            <section className="rounded-2xl bg-white/95 shadow-2xl ring-1 ring-black/5 backdrop-blur p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Detección de necesidades</h2>
                {necesidadesActivas.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {necesidadesActivas.map((n) => (
                            <span key={n} className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
                                {n}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">No se detectaron necesidades.</p>
                )}
            </section>

            <section className="rounded-2xl bg-white/95 shadow-2xl ring-1 ring-black/5 backdrop-blur p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Resultados de tests</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <TestCard label="Test 1 – Representación" value={TEST1_LABELS[trackingData.test1] ?? trackingData.test1} />
                    <TestCard label="Test 2 – Estilo aprendizaje" value={TEST2_LABELS[trackingData.test2] ?? trackingData.test2} />
                    <TestCard label="Test 3 – Autoestima" value={TEST3_LABELS[trackingData.test3] ?? trackingData.test3} />
                    <TestCard label="Test 4 – Asertividad" value={TEST4_LABELS[trackingData.test4] ?? trackingData.test4} />
                </div>

                <div className="mt-4 rounded-lg bg-blue-50 border border-blue-200 p-4">
                    <p className="text-sm font-semibold text-blue-900 mb-2">Test 5 – Habilidades de estudio</p>
                    <div className="grid grid-cols-4 gap-4 text-center">
                        <div>
                            <span className="text-xs text-blue-700">Organización</span>
                            <p className="text-lg font-bold text-blue-900">{trackingData.test5.organizacion}/10</p>
                        </div>
                        <div>
                            <span className="text-xs text-blue-700">Técnicas</span>
                            <p className="text-lg font-bold text-blue-900">{trackingData.test5.tecnicasEstudio}/10</p>
                        </div>
                        <div>
                            <span className="text-xs text-blue-700">Motivación</span>
                            <p className="text-lg font-bold text-blue-900">{trackingData.test5.motivacion}/10</p>
                        </div>
                        <div>
                            <span className="text-xs text-blue-700">Total</span>
                            <p className="text-lg font-bold text-blue-900">{trackingData.test5.total}/30</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="rounded-2xl bg-white/95 shadow-2xl ring-1 ring-black/5 backdrop-blur p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Total de materias reprobadas</h2>
                <p className={`text-3xl font-bold ${totalMR(trackingData) > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                    {totalMR(trackingData)}
                </p>
            </section>
        </div>
    );
}

function TestCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl bg-gray-50 p-4 ring-1 ring-gray-200">
            <span className="text-xs text-gray-500">{label}</span>
            <p className="text-lg font-bold text-gray-900 mt-1">{value}</p>
        </div>
    );
}
