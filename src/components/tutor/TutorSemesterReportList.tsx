import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, PrinterIcon } from '@heroicons/react/24/outline';
import { useSemesterReportStore } from '@/stores/useSemesterReportStore';
import { CANALIZACION_CODES } from '@/constants/semester-report.constants';
import { generateSemesterReportHTML } from '@/lib/generateSabanasHTML';
import { generateActionReportHTML, getMockActionReportData } from '@/lib/generateActionReportHTML';
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
    const [showActionReport, setShowActionReport] = useState(false);

    const actionReportData = useMemo(() => getMockActionReportData(), []);

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

    const handlePrint = () => {
        if (showActionReport) {
            const html = generateActionReportHTML(actionReportData);
            const w = window.open('', '_blank', 'width=900,height=700');
            if (!w) return;
            w.document.write(html);
            w.document.close();
            w.focus();
            w.onafterprint = () => w.close();
            setTimeout(() => w.print(), 400);
        } else {
            const html = generateSemesterReportHTML(report);
            const w = window.open('', '_blank', 'width=1200,height=800');
            if (!w) return;
            w.document.write(html);
            w.document.close();
            w.focus();
            w.onafterprint = () => w.close();
            setTimeout(() => w.print(), 400);
        }
    };

    return (
        <div className="w-full px-4 py-6">
            {/* Encabezado del reporte */}
            <div className="rounded-2xl bg-white/95 shadow-2xl ring-1 ring-black/5 backdrop-blur p-6 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {showActionReport ? 'Reporte de Acción Tutorial' : 'Reporte Semestral de Actividades del Tutor'}
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">Documento {showActionReport ? '7' : '5'} — Formato oficial</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setShowActionReport((v) => !v)}
                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all duration-300"
                        >
                            <EyeIcon className="h-5 w-5" />
                            {showActionReport ? 'Ver Reporte Semestral' : 'Reporte Acción Tutorial'}
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

                <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-blue-50/60 via-white to-indigo-50/40 border border-blue-100/60">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-sm">
                        <div className="space-y-0.5">
                            <span className="block text-xs text-gray-400 uppercase tracking-wide">Carrera</span>
                            <span className="font-semibold text-gray-800">{report.carrera}</span>
                        </div>
                        <div className="space-y-0.5">
                            <span className="block text-xs text-gray-400 uppercase tracking-wide">Periodo</span>
                            <span className="font-semibold text-gray-800">{report.periodo}</span>
                        </div>
                        <div className="space-y-0.5">
                            <span className="block text-xs text-gray-400 uppercase tracking-wide">Semestre</span>
                            <span className="inline-flex items-center rounded-md bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700">{report.semestre}</span>
                        </div>
                        <div className="space-y-0.5">
                            <span className="block text-xs text-gray-400 uppercase tracking-wide">Entrega</span>
                            <span className="font-semibold text-gray-800">{report.fechaEntrega}</span>
                        </div>
                        <div className="space-y-0.5">
                            <span className="block text-xs text-gray-400 uppercase tracking-wide">Tutor</span>
                            <span className="font-semibold text-gray-800">{report.tutorName}</span>
                        </div>
                        <div className="space-y-0.5">
                            <span className="block text-xs text-gray-400 uppercase tracking-wide">Tutorados (histórico)</span>
                            <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700">{report.totalTutoradosDesdePrimerSemestre}</span>
                        </div>
                        <div className="space-y-0.5 sm:col-span-2 lg:col-span-2">
                            <span className="block text-xs text-gray-400 uppercase tracking-wide">Tutorados (este semestre)</span>
                            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">{report.totalTutoradosEsteSemestre}</span>
                        </div>
                    </div>
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

            {showActionReport ? (
                /* --- Reporte de Acción Tutorial (solo vista) --- */
                <>
                    <div className="rounded-2xl bg-white/95 shadow-2xl ring-1 ring-black/5 backdrop-blur p-6 mb-6">
                        <div className="text-center mb-4">
                            <h2 className="text-lg font-bold text-gray-900">Instituto Tecnológico de Orizaba</h2>
                            <h3 className="text-md text-gray-600">Departamento de Sistemas y Computación</h3>
                            <h4 className="text-md font-bold text-gray-800 mt-2">REPORTE SEMESTRAL DE LA ACCIÓN TUTORIAL</h4>
                            <p className="text-xs text-gray-500 mt-1">Propósito: Generar los indicadores de desempeño en la acción tutorial.</p>
                        </div>
                        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50/60 via-white to-indigo-50/40 border border-blue-100/60 mb-5">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                                <div className="space-y-0.5">
                                    <span className="block text-xs text-gray-400 uppercase tracking-wide">Carrera</span>
                                    <span className="font-semibold text-gray-800">{actionReportData.carrera}</span>
                                </div>
                                <div className="space-y-0.5">
                                    <span className="block text-xs text-gray-400 uppercase tracking-wide">Tutor</span>
                                    <span className="font-semibold text-gray-800">{actionReportData.tutorName}</span>
                                </div>
                                <div className="space-y-0.5">
                                    <span className="block text-xs text-gray-400 uppercase tracking-wide">Periodo</span>
                                    <span className="font-semibold text-gray-800">{actionReportData.periodo}</span>
                                </div>
                                <div className="space-y-0.5">
                                    <span className="block text-xs text-gray-400 uppercase tracking-wide">Semestre</span>
                                    <span className="inline-flex items-center rounded-md bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700">{actionReportData.semestre}</span>
                                </div>
                            </div>
                        </div>

                        {/* Sección 1 */}
                        <h3 className="text-sm font-bold text-gray-800 border-b pb-1 mb-3 uppercase tracking-wide">1. Alumnos atendidos en el Programa Institucional de Tutoría</h3>
                        <div className="overflow-x-auto mb-4">
                            <table className="table-tutortec w-full">
                                <thead>
                                    <tr>
                                        <th colSpan={2}>No. de tutorados designados debido a:</th>
                                        <th colSpan={2}>No. de estudiantes que dejó de tutorar debido a:</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="text-left">a) Cambio de Tutor</td>
                                        <td className="text-center font-semibold">{actionReportData.designadosCambioTutor}</td>
                                        <td className="text-left">a) Cambio de Tutor</td>
                                        <td className="text-center font-semibold">{actionReportData.dejaronCambioTutor}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-left">b) Cambio de carrera</td>
                                        <td className="text-center font-semibold">{actionReportData.designadosCambioCarrera}</td>
                                        <td className="text-left">b) Cambio de carrera</td>
                                        <td className="text-center font-semibold">{actionReportData.dejaronCambioCarrera}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-left">c) Cambio de instituto</td>
                                        <td className="text-center font-semibold">{actionReportData.designadosCambioInstituto}</td>
                                        <td className="text-left">c) Cambio de instituto</td>
                                        <td className="text-center font-semibold">{actionReportData.dejaronCambioInstituto}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-left">Número de tutorados asignados desde primer semestre</td>
                                        <td className="text-center font-semibold">{actionReportData.asignadosDesdePrimerSemestre}</td>
                                        <td className="text-left">No. de estudiantes desertores</td>
                                        <td className="text-center font-semibold">{actionReportData.desertores}</td>
                                    </tr>
                                    <tr>
                                        <td></td><td></td>
                                        <td className="text-left">Alumnos de 1er. Semestre dados de baja definitiva al no acreditar al menos 3 materias</td>
                                        <td className="text-center font-semibold">{actionReportData.bajaDefinitivaPrimerSemestre}</td>
                                    </tr>
                                    <tr className="bg-amber-50 font-bold">
                                        <td className="text-left">TOTAL</td>
                                        <td className="text-center">{actionReportData.designadosCambioTutor + actionReportData.designadosCambioCarrera + actionReportData.designadosCambioInstituto + actionReportData.asignadosDesdePrimerSemestre}</td>
                                        <td className="text-left">TOTAL</td>
                                        <td className="text-center">{actionReportData.dejaronCambioTutor + actionReportData.dejaronCambioCarrera + actionReportData.dejaronCambioInstituto + actionReportData.desertores + actionReportData.bajaDefinitivaPrimerSemestre}</td>
                                    </tr>
                                    <tr className="bg-yellow-100">
                                        <td colSpan={4} className="text-center font-bold">
                                            No. Total de Estudiantes Tutorados Durante Este Semestre: <strong>{actionReportData.totalTutoradosEsteSemestre}</strong>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <p className="text-xs text-gray-400 italic mt-1">Nota: Para obtener el No. Total de estudiantes tutorados durante el semestre; al total de la primera columna, restarle el resultado de la segunda columna.</p>
                        </div>

                        {/* Sección 2 */}
                        <h3 className="text-sm font-bold text-gray-800 border-b pb-1 mb-3 uppercase tracking-wide">2. Otros datos de interés</h3>
                        <div className="overflow-x-auto">
                            <table className="table-tutortec w-full">
                                <tbody>
                                    <tr><td className="text-left">Boletas entregadas o asignación de carga</td><td className="text-center font-semibold">{actionReportData.boletasEntregadas}</td></tr>
                                    <tr><td className="text-left">Número de alumnos con 1 curso especial</td><td className="text-center font-semibold">{actionReportData.alumnosCon1CursoEspecial}</td></tr>
                                    <tr><td className="text-left">Número de sesiones grupales</td><td className="text-center font-semibold">{actionReportData.sesionesGrupales}</td></tr>
                                    <tr><td className="text-left">Número de alumnos con 2 cursos especiales</td><td className="text-center font-semibold">{actionReportData.alumnosCon2CursosEspeciales}</td></tr>
                                    <tr><td className="text-left">Número de sesiones individuales</td><td className="text-center font-semibold">{actionReportData.sesionesIndividuales}</td></tr>
                                    <tr><td className="text-left">Número de alumnos atendidos con 1 materia reprobada</td><td className="text-center font-semibold">{actionReportData.alumnosCon1Reprobada}</td></tr>
                                    <tr><td className="text-left">No. de Estudiantes canalizados</td><td className="text-center font-semibold">{actionReportData.estudiantesCanalizados}</td></tr>
                                    <tr><td className="text-left">Número de alumnos atendidos con 2 o más materias reprobadas</td><td className="text-center font-semibold">{actionReportData.alumnosCon2OMasReprobadas}</td></tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Firmas */}
                        <div className="grid grid-cols-2 gap-12 mt-8 text-center text-xs text-gray-500">
                            <div>
                                <div className="border-t border-gray-300 mb-1"></div>
                                <p>Nombre y firma del Tutor</p>
                                <p className="font-medium text-gray-700">{actionReportData.tutorName}</p>
                            </div>
                            <div>
                                <div className="border-t border-gray-300 mb-1"></div>
                                <p>Nombre y firma del Coordinador</p>
                                <p className="font-medium text-gray-700">del Programa Académico de Tutoría</p>
                            </div>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-3 text-center">
                        Reporte de Acción Tutorial — Vista previa. Usa el botón <strong>Imprimir</strong> para exportar.
                    </p>
                </>
            ) : (
                /* --- Reporte Semestral (tabla) --- */
                <>
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
                                    <th rowSpan={2} className="w-44">Observaciones</th>
                                    <th rowSpan={2} className="w-16">Cambio Tutor</th>
                                    <th rowSpan={2} className="w-16">Cambio Carrera</th>
                                    <th rowSpan={2} className="w-16">Cambio Inst.</th>
                                    <th rowSpan={2} className="w-36">Curso Especial</th>
                                    <th rowSpan={2} className="w-36">Repite Curso</th>
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
                                        <td className="text-xs max-w-44 truncate" title={e.observaciones}>{e.observaciones || '—'}</td>
                                        <td className="text-center">{siNo(e.cambioTutor)}</td>
                                        <td className="text-center">{siNo(e.cambioCarrera)}</td>
                                        <td className="text-center">{siNo(e.cambioInstituto)}</td>
                                        <td className="text-xs max-w-36 truncate" title={e.cursosEspeciales.join(', ')}>{e.cursosEspeciales.join(', ') || '—'}</td>
                                        <td className="text-xs max-w-36 truncate" title={e.repiteCursos.join(', ')}>{e.repiteCursos.join(', ') || '—'}</td>
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
                </>
            )}
        </div>
    );
}
