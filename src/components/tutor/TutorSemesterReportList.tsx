import { useNavigate } from 'react-router-dom';
import { PrinterIcon } from '@heroicons/react/24/outline';
import { useSemesterReportStore } from '@/stores/useSemesterReportStore';
import { CANALIZACION_CODES } from '@/constants/semester-report.constants';
import { generateSemesterReportHTML } from '@/lib/generateSabanasHTML';
import type { StudentSemesterReport } from '@/types/semester-report.types';

function siNo(val: boolean): string {
    return val ? 'Sí' : 'No';
}

function totalSesiones(r: StudentSemesterReport): number {
    return r.sesionesGrupal + r.sesionesIndividual;
}

export function TutorSemesterReportList() {
    const navigate = useNavigate();
    const { report } = useSemesterReportStore();

    const totals = {
        sesionesGrupal: report.estudiantes.reduce((s, e) => s + e.sesionesGrupal, 0),
        sesionesIndividual: report.estudiantes.reduce((s, e) => s + e.sesionesIndividual, 0),
        boletas: report.estudiantes.filter((e) => e.boletaEntregada).length,
        materiasReprobadas: report.estudiantes.reduce((s, e) => s + e.totalMateriasReprobadas, 0),
        promedio:
            report.estudiantes.length > 0
                ? report.estudiantes.reduce((s, e) => s + e.promedioSemestral, 0) / report.estudiantes.length
                : 0,
    };
    totals.sesionesIndividual = report.estudiantes.reduce((s, e) => s + e.sesionesIndividual, 0);
    const totalSes = totals.sesionesGrupal + totals.sesionesIndividual;

    const handlePrintReport = () => {
        const html = generateSemesterReportHTML(report);
        const w = window.open('', '_blank', 'width=1200,height=800');
        if (!w) return;
        w.document.write(html);
        w.document.close();
        w.focus();
        w.onafterprint = () => w.close();
        setTimeout(() => w.print(), 400);
    };

    return (
        <div className="w-full px-4 py-6">
            {/* Encabezado del reporte */}
            <div className="rounded-2xl bg-white/95 shadow-2xl ring-1 ring-black/5 backdrop-blur p-6 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Reporte Semestral de Actividades del Tutor
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">Documento 5 — Formato oficial</p>
                    </div>
                    <button
                        type="button"
                        onClick={handlePrintReport}
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all duration-300"
                    >
                        <PrinterIcon className="h-5 w-5" />
                        Imprimir Reporte
                    </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-sm">
                    <div><span className="text-gray-500">Carrera:</span> <span className="font-medium">{report.carrera}</span></div>
                    <div><span className="text-gray-500">Periodo:</span> <span className="font-medium">{report.periodo}</span></div>
                    <div><span className="text-gray-500">Semestre:</span> <span className="font-medium">{report.semestre}</span></div>
                    <div><span className="text-gray-500">Entrega:</span> <span className="font-medium">{report.fechaEntrega}</span></div>
                    <div><span className="text-gray-500">Tutor:</span> <span className="font-medium">{report.tutorName}</span></div>
                    <div><span className="text-gray-500">Tutorados (histórico):</span> <span className="font-medium">{report.totalTutoradosDesdePrimerSemestre}</span></div>
                    <div className="sm:col-span-2"><span className="text-gray-500">Tutorados (este semestre):</span> <span className="font-medium">{report.totalTutoradosEsteSemestre}</span></div>
                </div>

                {/* Leyenda de canalizaciones */}
                <details className="mt-4 text-xs text-gray-500">
                    <summary className="cursor-pointer font-medium text-gray-600">Leyenda de códigos de canalización</summary>
                    <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-1">
                        {Object.entries(CANALIZACION_CODES).map(([k, v]) => (
                            <span key={k}><strong>{k}</strong> = {v}</span>
                        ))}
                    </div>
                    <p className="mt-2 italic">
                        Si el alumno no asistió a la canalización, se marca <strong>(no asistió)</strong> junto al código.
                        S = Seguimiento.
                    </p>
                </details>
            </div>

            {/* Tabla principal */}
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
                            <th colSpan={3} className="bg-blue-50">Sesiones asistidas</th>
                            <th colSpan={3} className="bg-amber-50">Canalizaciones</th>
                            <th rowSpan={2} className="w-32">Observaciones</th>
                            <th rowSpan={2} className="w-16">Cambio Tutor</th>
                            <th rowSpan={2} className="w-16">Cambio Carrera</th>
                            <th rowSpan={2} className="w-16">Cambio Inst.</th>
                            <th rowSpan={2} className="w-28">Curso Especial</th>
                            <th rowSpan={2} className="w-28">Repite Curso</th>
                            <th rowSpan={2} className="w-16 bg-red-50">MR Total</th>
                            <th rowSpan={2} className="w-16">Promedio</th>
                            <th rowSpan={2} className="w-16">Boleta</th>
                        </tr>
                        <tr>
                            <th className="bg-blue-50">Grup.</th>
                            <th className="bg-blue-50">Ind.</th>
                            <th className="bg-blue-50">Total</th>
                            <th className="bg-amber-50">1°</th>
                            <th className="bg-amber-50">2°</th>
                            <th className="bg-amber-50">3°</th>
                        </tr>
                    </thead>
                    <tbody>
                        {report.estudiantes.map((e, idx) => (
                            <tr
                                key={e.studentId}
                                onClick={() => navigate(`/tutor/reporte-semestral/${e.studentId}`)}
                                className="cursor-pointer hover:bg-blue-50/50 transition-colors"
                            >
                                <td className="text-center text-gray-600">{idx + 1}</td>
                                <td className="text-center font-mono">{e.studentId}</td>
                                <td className="whitespace-nowrap">{e.studentName}</td>
                                <td className="text-center">{e.sesionesGrupal}</td>
                                <td className="text-center">{e.sesionesIndividual}</td>
                                <td className="text-center font-medium">{totalSesiones(e)}</td>
                                <td className="text-center text-xs">
                                    {e.canalizaciones.primerSeguimiento.length
                                        ? <span className={e.canalizaciones.asistioPrimerSeguimiento ? '' : 'text-red-600 font-bold'}>{e.canalizaciones.primerSeguimiento.join(',')}{!e.canalizaciones.asistioPrimerSeguimiento ? ' ⃝' : ''}</span>
                                        : '—'}
                                </td>
                                <td className="text-center text-xs">
                                    {e.canalizaciones.segundoSeguimiento.length
                                        ? <span className={e.canalizaciones.asistioSegundoSeguimiento ? '' : 'text-red-600 font-bold'}>{e.canalizaciones.segundoSeguimiento.join(',')}{!e.canalizaciones.asistioSegundoSeguimiento ? ' ⃝' : ''}</span>
                                        : '—'}
                                </td>
                                <td className="text-center text-xs">
                                    {e.canalizaciones.tercerSeguimiento.length
                                        ? <span className={e.canalizaciones.asistioTercerSeguimiento ? '' : 'text-red-600 font-bold'}>{e.canalizaciones.tercerSeguimiento.join(',')}{!e.canalizaciones.asistioTercerSeguimiento ? ' ⃝' : ''}</span>
                                        : '—'}
                                </td>
                                <td className="text-xs max-w-32 truncate" title={e.observaciones}>{e.observaciones || '—'}</td>
                                <td className="text-center">{siNo(e.cambioTutor)}</td>
                                <td className="text-center">{siNo(e.cambioCarrera)}</td>
                                <td className="text-center">{siNo(e.cambioInstituto)}</td>
                                <td className="text-xs max-w-28 truncate" title={e.cursosEspeciales.join(', ')}>{e.cursosEspeciales.join(', ') || '—'}</td>
                                <td className="text-xs max-w-28 truncate" title={e.repiteCursos.join(', ')}>{e.repiteCursos.join(', ') || '—'}</td>
                                <td className="text-center font-bold bg-red-50/30">
                                    <span className={e.totalMateriasReprobadas > 0 ? 'text-red-600' : 'text-gray-400'}>{e.totalMateriasReprobadas}</span>
                                </td>
                                <td className="text-center font-medium">{e.promedioSemestral.toFixed(1)}</td>
                                <td className="text-center">{siNo(e.boletaEntregada)}</td>
                            </tr>
                        ))}
                    </tbody>
                    {/* Fila de totales */}
                    <tfoot>
                        <tr>
                            <td colSpan={3} className="px-3 py-2 text-right">Totales:</td>
                            <td className="text-center">{totals.sesionesGrupal}</td>
                            <td className="text-center">{totals.sesionesIndividual}</td>
                            <td className="text-center">{totalSes}</td>
                            <td colSpan={3} className="text-center text-gray-400">—</td>
                            <td colSpan={5} className="text-center text-gray-400">—</td>
                            <td className="text-center text-red-600">{totals.materiasReprobadas}</td>
                            <td className="text-center">{totals.promedio.toFixed(1)}</td>
                            <td className="text-center">{totals.boletas}/{report.estudiantes.length}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <p className="text-xs text-gray-400 mt-3 text-center">
                Haz clic en cualquier fila para editar el reporte individual del estudiante.
            </p>
        </div>
    );
}
