import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { ArrowLeftIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { useSemesterReportStore } from '@/stores/useSemesterReportStore';
import { useStudentTrackingStore } from '@/stores/useStudentTrackingStore';
import { CANALIZACION_CODES } from '@/constants/semester-report.constants';
import type { StudentSemesterReport } from '@/types/semester-report.types';

const CANAL_CODES = [1, 2, 3, 4, 5] as const;

export function StudentSemesterReportView() {
    const { studentId } = useParams<{ studentId: string }>();
    const navigate = useNavigate();
    const { report, updateStudentReport } = useSemesterReportStore();
    const { allTrackingData } = useStudentTrackingStore();

    const student = report.estudiantes.find((e) => e.studentId === studentId);
    const [form, setForm] = useState<StudentSemesterReport | null>(student ?? null);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [saved, setSaved] = useState(false);

    const trackingEntry = useMemo(
        () => allTrackingData.find((t) => t.studentId === studentId),
        [allTrackingData, studentId],
    );

    const changes = useMemo(() => {
        if (!student || !form) return [] as string[];
        const diff: string[] = [];
        if (form.sesionesGrupal !== student.sesionesGrupal || form.sesionesIndividual !== student.sesionesIndividual)
            diff.push(`Sesiones: G=${student.sesionesGrupal}→${form.sesionesGrupal}, I=${student.sesionesIndividual}→${form.sesionesIndividual}`);
        if (form.observaciones !== student.observaciones)
            diff.push(`Observaciones: "${student.observaciones || '(vacío)'}" → "${form.observaciones || '(vacío)'}"`);
        if (form.totalMateriasReprobadas !== student.totalMateriasReprobadas) diff.push(`MR: ${student.totalMateriasReprobadas}→${form.totalMateriasReprobadas}`);
        if (form.promedioSemestral !== student.promedioSemestral) diff.push(`Promedio: ${student.promedioSemestral}→${form.promedioSemestral}`);
        if (form.boletaEntregada !== student.boletaEntregada) diff.push(`Boleta: ${student.boletaEntregada ? 'Sí' : 'No'}→${form.boletaEntregada ? 'Sí' : 'No'}`);
        if (form.cambioTutor !== student.cambioTutor) diff.push(`Cambio Tutor: ${student.cambioTutor ? 'Sí' : 'No'}→${form.cambioTutor ? 'Sí' : 'No'}`);
        if (form.cambioCarrera !== student.cambioCarrera) diff.push(`Cambio Carrera: ${student.cambioCarrera ? 'Sí' : 'No'}→${form.cambioCarrera ? 'Sí' : 'No'}`);
        if (form.cambioInstituto !== student.cambioInstituto) diff.push(`Cambio Instituto: ${student.cambioInstituto ? 'Sí' : 'No'}→${form.cambioInstituto ? 'Sí' : 'No'}`);
        if (JSON.stringify(form.cursosEspeciales) !== JSON.stringify(student.cursosEspeciales)) diff.push('Cursos Especiales modificados');
        if (JSON.stringify(form.repiteCursos) !== JSON.stringify(student.repiteCursos)) diff.push('Repite Cursos modificados');
        if (JSON.stringify(form.canalizaciones) !== JSON.stringify(student.canalizaciones)) diff.push('Canalizaciones modificadas');
        return diff;
    }, [student, form]);

    if (!student || !form) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                <p className="text-gray-500">Estudiante no encontrado en este reporte.</p>
                <button onClick={() => navigate('/tutor/reporte-semestral')} className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all duration-300">
                    Volver al reporte
                </button>
            </div>
        );
    }

    const update = (patch: Partial<StudentSemesterReport>) => {
        setForm((prev) => (prev ? { ...prev, ...patch } : prev));
        setSaved(false);
    };

    const toggleCanal = (
        seg: 'primerSeguimiento' | 'segundoSeguimiento' | 'tercerSeguimiento',
        code: number,
    ) => {
        const current = form.canalizaciones[seg];
        const next = current.includes(code) ? current.filter((c) => c !== code) : [...current, code].sort();
        update({ canalizaciones: { ...form.canalizaciones, [seg]: next } });
    };

    const toggleAsistio = (key: 'asistioPrimerSeguimiento' | 'asistioSegundoSeguimiento' | 'asistioTercerSeguimiento') => {
        update({ canalizaciones: { ...form.canalizaciones, [key]: !form.canalizaciones[key] } });
    };

    const handleAutoFill = () => {
        if (!trackingEntry) return;
        const totalMR = trackingEntry.semestres.reduce((s, sm) => s + sm.materiasReprobadas, 0);
        update({ totalMateriasReprobadas: totalMR, promedioSemestral: trackingEntry.promedioExamenAdmision });
    };

    const handleSave = () => {
        updateStudentReport(student.studentId, form);
        setSaved(true);
        setShowSaveModal(true);
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-6 pb-24">
            <button
                onClick={() => navigate('/tutor/reporte-semestral')}
                className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
            >
                <ArrowLeftIcon className="h-4 w-4" /> Volver al reporte
            </button>

            <h1 className="text-2xl font-bold text-gray-900">{form.studentName}</h1>
            <p className="text-sm text-gray-600 -mt-4">{form.studentId}</p>

            {/* Sesiones */}
            <section className="rounded-2xl bg-white/95 shadow-2xl ring-1 ring-black/5 backdrop-blur p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Sesiones asistidas</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Grupal</label>
                        <input type="number" min={0} value={form.sesionesGrupal}
                            onChange={(e) => update({ sesionesGrupal: Number(e.target.value) })}
                            className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Individual</label>
                        <input type="number" min={0} value={form.sesionesIndividual}
                            onChange={(e) => update({ sesionesIndividual: Number(e.target.value) })}
                            className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                    </div>
                </div>
                <p className="mt-2 text-sm font-medium text-gray-700">Total: {form.sesionesGrupal + form.sesionesIndividual}</p>
            </section>

            {/* Canalizaciones */}
            <section className="rounded-2xl bg-white/95 shadow-2xl ring-1 ring-black/5 backdrop-blur p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Canalizaciones</h2>
                <p className="text-xs text-gray-400 mb-4">
                    Selecciona los tipos de canalización realizados en cada seguimiento.
                </p>
                {(['primerSeguimiento', 'segundoSeguimiento', 'tercerSeguimiento'] as const).map((seg, i) => {
                    const asistioKey = ['asistioPrimerSeguimiento', 'asistioSegundoSeguimiento', 'asistioTercerSeguimiento'] as const;
                    return (
                        <div key={seg} className="mb-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-semibold text-gray-700">
                                    {['1er Seguimiento', '2do Seguimiento', '3er Seguimiento'][i]}
                                </span>
                                <label className="flex items-center gap-2 text-xs cursor-pointer">
                                    <input type="checkbox" checked={form.canalizaciones[asistioKey[i]]}
                                        onChange={() => toggleAsistio(asistioKey[i])}
                                        className="h-3.5 w-3.5 rounded border-gray-300 text-blue-600" />
                                    {form.canalizaciones[asistioKey[i]] ? '✓ Asistió' : '✗ No asistió'}
                                </label>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {CANAL_CODES.map((code) => {
                                    const active = form.canalizaciones[seg].includes(code);
                                    return (
                                        <button
                                            key={code}
                                            type="button"
                                            onClick={() => toggleCanal(seg, code)}
                                            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${active
                                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 scale-105'
                                                    : 'bg-white text-gray-500 border border-gray-200 hover:border-blue-300 hover:text-blue-600'
                                                }`}
                                        >
                                            {CANALIZACION_CODES[code]}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </section>

            {/* Observaciones */}
            <section className="rounded-2xl bg-white/95 shadow-2xl ring-1 ring-black/5 backdrop-blur p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Observaciones del Tutor</h2>
                <textarea value={form.observaciones}
                    onChange={(e) => update({ observaciones: e.target.value })}
                    rows={3}
                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-y" />
            </section>

            {/* Cambios */}
            <section className="rounded-2xl bg-white/95 shadow-2xl ring-1 ring-black/5 backdrop-blur p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Cambios</h2>
                <div className="grid grid-cols-3 gap-4">
                    {(['cambioTutor', 'cambioCarrera', 'cambioInstituto'] as const).map((field) => (
                        <label key={field} className="flex items-center gap-2 text-sm cursor-pointer">
                            <input type="checkbox" checked={form[field]}
                                onChange={() => update({ [field]: !form[field] })}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600" />
                            {field === 'cambioTutor' ? 'Cambio de Tutor' : field === 'cambioCarrera' ? 'Cambio de Carrera' : 'Cambio de Instituto'}
                        </label>
                    ))}
                </div>
            </section>

            {/* Datos académicos */}
            <section className="rounded-2xl bg-white/95 shadow-2xl ring-1 ring-black/5 backdrop-blur p-6">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold text-gray-900">Datos académicos</h2>
                    {trackingEntry && (
                        <button
                            type="button"
                            onClick={handleAutoFill}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-100 transition"
                        >
                            <ArrowDownTrayIcon className="h-3.5 w-3.5" />
                            Cargar desde expediente
                        </button>
                    )}
                </div>
                {trackingEntry && (
                    <p className="text-xs text-gray-400 -mt-1 mb-4">
                        Expediente: {trackingEntry.fullName} — {trackingEntry.semestres.reduce((s, sm) => s + sm.materiasReprobadas, 0)} MR — P.E.A. {trackingEntry.promedioExamenAdmision}
                    </p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Cursos Especiales (separados por coma)</label>
                        <input type="text" value={form.cursosEspeciales.join(', ')}
                            onChange={(e) => update({ cursosEspeciales: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
                            className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Repite Cursos (separados por coma)</label>
                        <input type="text" value={form.repiteCursos.join(', ')}
                            onChange={(e) => update({ repiteCursos: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
                            className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Total Materias Reprobadas</label>
                        <input type="number" min={0} value={form.totalMateriasReprobadas}
                            onChange={(e) => update({ totalMateriasReprobadas: Number(e.target.value) })}
                            className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Promedio Semestral (0-100)</label>
                        <input type="number" step="0.1" min={0} max={100} value={form.promedioSemestral}
                            onChange={(e) => update({ promedioSemestral: Number(e.target.value) })}
                            className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                    </div>
                </div>
                <div className="mt-4">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input type="checkbox" checked={form.boletaEntregada}
                            onChange={() => update({ boletaEntregada: !form.boletaEntregada })}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600" />
                        ¿Boleta entregada?
                    </label>
                </div>
            </section>

            {/* Barra flotante inferior */}
            <div className="fixed inset-x-0 bottom-4 z-30 px-4 sm:px-6 pointer-events-none">
                <div className="mx-auto max-w-3xl rounded-2xl bg-white/95 backdrop-blur border border-gray-200 shadow-lg p-3 pointer-events-auto">
                    <div className="flex items-center justify-between gap-3">
                        <button
                            onClick={() => navigate('/tutor/reporte-semestral')}
                            className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition"
                        >
                            ← Volver al reporte
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={changes.length === 0 && saved}
                            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 disabled:opacity-50 transition-all duration-300"
                        >
                            {saved ? '✓ Guardado' : 'Guardar cambios'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal de confirmación */}
            {showSaveModal &&
                createPortal(
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
                        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-black/5">
                            <h3 className="text-lg font-bold text-gray-900">✓ Cambios guardados</h3>
                            <p className="mt-2 text-sm text-gray-600">
                                Reporte de <strong>{form.studentName}</strong> actualizado.
                            </p>
                            {changes.length > 0 ? (
                                <div className="mt-4 rounded-xl bg-blue-50 p-4 text-xs text-blue-800 space-y-1 max-h-32 overflow-y-auto">
                                    <p className="font-semibold mb-1">Modificaciones realizadas:</p>
                                    {changes.map((c, i) => (<p key={i}>• {c}</p>))}
                                </div>
                            ) : (
                                <p className="mt-2 text-xs text-gray-400">No se detectaron cambios.</p>
                            )}
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => setShowSaveModal(false)}
                                    className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition"
                                >
                                    Entendido
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body,
                )}
        </div>
    );
}
