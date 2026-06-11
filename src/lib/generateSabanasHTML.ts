import type { StudentTrackingData } from '@/types/student-tracking.types';
import type { SemesterReport } from '@/types/semester-report.types';

const NEC_KEYS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'] as const;

export function generateSabanasHTML(
  students: StudentTrackingData[],
  tutorName: string,
  carrera: string,
  semestreIngreso: string,
): string {
  const rows = students
    .map(
      (s, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td>${s.studentId}</td>
      <td>${s.fullName}</td>
      <td>${s.promedioBachillerato}</td>
      <td>${s.promedioExamenAdmision}</td>
      ${NEC_KEYS.map((k) => `<td>${s.necesidades[k] ? '✓' : '–'}</td>`).join('')}
      <td>${s.test1}</td>
      <td>${s.test2}</td>
      <td>${s.test3}</td>
      <td>${s.test4}</td>
      <td>${s.test5.organizacion}</td>
      <td>${s.test5.tecnicasEstudio}</td>
      <td>${s.test5.motivacion}</td>
      <td>${s.test5.total}</td>
      <td>${s.semestres.reduce((sum, sm) => sum + sm.materiasReprobadas, 0)}</td>
    </tr>`,
    )
    .join('');

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>SEGUIMIENTO TUTORIAL (Sábana)</title>
  <style>
    @page { size: letter landscape; margin: 1.2cm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
      font-size: 9px; color: #1e293b; padding: 24px;
      background: linear-gradient(135deg, #eff6ff 0%, #eef2ff 100%);
    }
    .card {
      background: rgba(255,255,255,0.95);
      border-radius: 16px;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05);
      padding: 20px;
    }
    .header { text-align: center; margin-bottom: 14px; }
    .header h2 { font-size: 15px; margin: 0; font-weight: 700; color: #1e3a5f; letter-spacing: -0.3px; }
    .header h3 { font-size: 11px; margin: 2px 0 0; color: #475569; font-weight: 500; }
    .header p { font-size: 9px; margin: 4px 0; color: #64748b; }
    .info { margin-bottom: 10px; font-size: 8px; color: #475569; }
    .info span { margin-right: 18px; }
    .info strong { color: #1e293b; }
    table { width: 100%; border-collapse: separate; border-spacing: 0; }
    th, td { border: 1px solid #cbd5e1; padding: 2px 3px; text-align: center; }
    thead tr:first-child th {
      background: linear-gradient(180deg, #f0f4ff 0%, #e2e8f0 100%);
      font-weight: 700; font-size: 7px; color: #1e3a5f;
    }
    thead tr:nth-child(2) th {
      background: #f8fafc; font-weight: 600; font-size: 6.5px; color: #334155;
    }
    tbody tr:nth-child(even) { background: #f8fafc; }
    .bg-blue { background: #dbeafe; }
    .bg-green { background: #dcfce7; }
    .bg-red { background: #fee2e2; }
    .text-green { color: #166534; font-weight: bold; }
    .text-gray { color: #94a3b8; }
    .text-red { color: #dc2626; font-weight: bold; }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white !important; }
      .card { box-shadow: none; border: 1px solid #e2e8f0; }
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h2>Instituto Tecnológico de Orizaba</h2>
      <h3>Departamento de Sistemas y Computación</h3>
      <p>SEGUIMIENTO TUTORIAL (Sábana) — Documento 4</p>
    </div>
    <div class="info">
      <span><strong>Tutor:</strong> ${tutorName}</span>
      <span><strong>Carrera:</strong> ${carrera}</span>
      <span><strong>Semestre de ingreso:</strong> ${semestreIngreso}</span>
      <span><strong>Total alumnos:</strong> ${students.length}</span>
    </div>
    <table>
      <thead>
        <tr>
          <th rowspan="2">No.</th>
          <th rowspan="2">Núm. Control</th>
          <th rowspan="2">Nombre</th>
          <th rowspan="2">P.B.</th>
          <th rowspan="2">P.E.A.</th>
          <th colspan="10" class="bg-blue">Detección de necesidades de tutoría básica</th>
          <th rowspan="2">T1</th>
          <th rowspan="2">T2</th>
          <th rowspan="2">T3</th>
          <th rowspan="2">T4</th>
          <th colspan="4" class="bg-green">TEST 5</th>
          <th rowspan="2" class="bg-red">MR Total</th>
        </tr>
        <tr>
          ${NEC_KEYS.map((k) => `<th class="bg-blue">${k}</th>`).join('')}
          <th class="bg-green">ORG</th>
          <th class="bg-green">TE</th>
          <th class="bg-green">M</th>
          <th class="bg-green">Total</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  </div>
  <p style="margin-top:16px;font-size:8px;color:#94a3b8;text-align:center;">Generado desde TutorTec — ${new Date().toLocaleDateString('es-MX')}</p>
</body>
</html>`;
}

const TEST1_LABELS: Record<string, string> = { A: 'Auditivo', V: 'Visual', K: 'Kinestésico' };
const TEST2_LABELS: Record<string, string> = { A: 'Activo', R: 'Reflexivo', T: 'Teórico', P: 'Pragmático' };
const TEST3_LABELS: Record<string, string> = { N1: 'Autoestima alta', N2: 'Autoestima media-alta', N3: 'Autoestima media-baja', N4: 'Autoestima baja' };
const TEST4_LABELS: Record<string, string> = { A: 'Asertivo', NA: 'No asertivo' };
const NEC_LABELS: Record<string, string> = {
  A: 'Problemas de salud física', B: 'Problemas de salud mental/emocional', C: 'Problemas económicos',
  D: 'Problemas familiares', E: 'Problemas de vivienda/traslado', F: 'Dificultades de aprendizaje',
  G: 'Falta de hábitos de estudio', H: 'Problemas de adaptación', I: 'Baja autoestima/inseguridad', J: 'Otra situación personal',
};

export function generateSingleSabanasHTML(
  data: StudentTrackingData,
  tutorName: string,
  carrera: string,
  semestreIngreso: string,
): string {
  const necesidadesActivas = Object.entries(data.necesidades)
    .filter(([, v]) => v).map(([k]) => k);

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Seguimiento Tutorial – ${data.fullName}</title>
  <style>
    @page { size: letter; margin: 1.5cm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: #1e293b; padding: 30px; }
    .header { text-align: center; border-bottom: 2px solid #1e3a5f; padding-bottom: 12px; margin-bottom: 20px; }
    .header h2 { font-size: 16px; color: #1e3a5f; margin: 0; font-weight: 700; }
    .header h3 { font-size: 13px; color: #475569; margin: 4px 0 0; font-weight: 500; }
    .header p { font-size: 11px; color: #64748b; margin: 6px 0 0; font-weight: 500; }
    .student-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .student-header h1 { font-size: 15px; color: #1e293b; }
    .student-header span { font-size: 12px; color: #64748b; }
    .section { margin-bottom: 14px; }
    .section-title { font-size: 12px; font-weight: 700; color: #1e3a5f; border-bottom: 1px solid #cbd5e1; padding-bottom: 3px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
    .grid-5 { display: grid; grid-template-columns: repeat(5, 1fr); gap: 4px; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; text-align: center; }
    .card .label { font-size: 9px; color: #64748b; text-transform: uppercase; }
    .card .value { font-size: 16px; font-weight: 700; color: #1e293b; margin-top: 2px; }
    .badge { display: inline-block; background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 999px; font-size: 10px; margin: 2px; }
    .badge-green { background: #dcfce7; color: #166534; }
    .needs-table { width: 100%; border-collapse: collapse; font-size: 9px; margin-top: 4px; }
    .needs-table th { background: #e2e8f0; border: 1px solid #cbd5e1; padding: 3px; text-align: center; font-weight: 700; }
    .needs-table td { border: 1px solid #cbd5e1; padding: 4px; text-align: center; }
    .check { color: #16a34a; font-weight: 700; font-size: 14px; }
    .dash { color: #cbd5e1; }
    .test-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; }
    .test-card .tlabel { font-size: 9px; color: #64748b; }
    .test-card .tvalue { font-size: 13px; font-weight: 700; color: #1e293b; }
    .t5-box { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 10px; }
    .t5-title { font-size: 11px; font-weight: 700; color: #1e40af; margin-bottom: 6px; }
    .signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-top: 30px; }
    .sig-box { text-align: center; }
    .sig-line { border-bottom: 1px solid #1e293b; margin-top: 40px; }
    .sig-label { font-size: 10px; color: #64748b; margin-top: 4px; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  </style>
</head>
<body>
  <div class="header">
    <h2>Instituto Tecnológico de Orizaba</h2>
    <h3>Departamento de Sistemas y Computación</h3>
    <p>SEGUIMIENTO TUTORIAL (Sábana) — Documento 4</p>
  </div>

  <div class="student-header">
    <div>
      <h1>${data.fullName}</h1>
      <span>${data.studentId} — ${carrera} — Ingreso: ${semestreIngreso}</span>
    </div>
    <span style="font-size:10px;color:#64748b;">Tutor: ${tutorName}</span>
  </div>

  <div class="section">
    <div class="section-title">Datos generales</div>
    <div class="grid-2">
      <div class="card"><div class="label">Promedio Bachillerato</div><div class="value">${data.promedioBachillerato}</div></div>
      <div class="card"><div class="label">Promedio Examen Admisión</div><div class="value">${data.promedioExamenAdmision}</div></div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Detección de necesidades de tutoría básica</div>
    <table class="needs-table">
      <tr>${NEC_KEYS.map((k) => `<th>${k}</th>`).join('')}</tr>
      <tr>${NEC_KEYS.map((k) => `<td>${data.necesidades[k] ? '<span class="check">✓</span>' : '<span class="dash">–</span>'}</td>`).join('')}</tr>
    </table>
    ${necesidadesActivas.length > 0 ? `<div style="margin-top:6px;font-size:9px;color:#64748b;"><strong>Detectadas:</strong> ${necesidadesActivas.map((k) => NEC_LABELS[k] ?? k).join('; ')}</div>` : ''}
  </div>

  <div class="section">
    <div class="section-title">Resultados de tests</div>
    <div class="grid-4">
      <div class="test-card"><div class="tlabel">Test 1 – Representación</div><div class="tvalue">${TEST1_LABELS[data.test1] ?? data.test1}</div></div>
      <div class="test-card"><div class="tlabel">Test 2 – Estilo aprendizaje</div><div class="tvalue">${TEST2_LABELS[data.test2] ?? data.test2}</div></div>
      <div class="test-card"><div class="tlabel">Test 3 – Autoestima</div><div class="tvalue">${TEST3_LABELS[data.test3] ?? data.test3}</div></div>
      <div class="test-card"><div class="tlabel">Test 4 – Asertividad</div><div class="tvalue">${TEST4_LABELS[data.test4] ?? data.test4}</div></div>
    </div>
    <div class="t5-box" style="margin-top:8px;">
      <div class="t5-title">Test 5 – Habilidades de estudio</div>
      <div class="grid-4">
        <div style="text-align:center;"><div style="font-size:9px;color:#1e40af;">Organización</div><div style="font-size:16px;font-weight:700;color:#1e40af;">${data.test5.organizacion}/10</div></div>
        <div style="text-align:center;"><div style="font-size:9px;color:#1e40af;">Técnicas estudio</div><div style="font-size:16px;font-weight:700;color:#1e40af;">${data.test5.tecnicasEstudio}/10</div></div>
        <div style="text-align:center;"><div style="font-size:9px;color:#1e40af;">Motivación</div><div style="font-size:16px;font-weight:700;color:#1e40af;">${data.test5.motivacion}/10</div></div>
        <div style="text-align:center;"><div style="font-size:9px;color:#1e40af;">Total</div><div style="font-size:16px;font-weight:700;color:#1e40af;">${data.test5.total}/30</div></div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Resumen académico</div>
    <div class="grid-2">
      <div class="card"><div class="label">Total materias reprobadas</div><div class="value" style="color:${data.semestres.reduce((s, sm) => s + sm.materiasReprobadas, 0) > 0 ? '#dc2626' : '#94a3b8'}">${data.semestres.reduce((s, sm) => s + sm.materiasReprobadas, 0)}</div></div>
      <div class="card"><div class="label">Semestres evaluados</div><div class="value">${data.semestres.length}</div></div>
    </div>
  </div>

  <div class="signatures">
    <div class="sig-box">
      <div class="sig-line"></div>
      <div class="sig-label">Firma del Estudiante</div>
    </div>
    <div class="sig-box">
      <div class="sig-line"></div>
      <div class="sig-label">Firma del Tutor<br>${tutorName}</div>
    </div>
  </div>

  <p style="margin-top:20px;font-size:8px;color:#94a3b8;text-align:center;">Generado desde TutorTec — ${new Date().toLocaleDateString('es-MX')}</p>
</body>
</html>`;
}

export function generateSemesterReportHTML(report: SemesterReport): string {
  const t = report.estudiantes.reduce((s, e) => s + e.sesionesGrupal, 0);
  const i = report.estudiantes.reduce((s, e) => s + e.sesionesIndividual, 0);
  const mr = report.estudiantes.reduce((s, e) => s + e.totalMateriasReprobadas, 0);
  const boletas = report.estudiantes.filter((e) => e.boletaEntregada).length;
  const prom = report.estudiantes.length > 0
    ? (report.estudiantes.reduce((s, e) => s + e.promedioSemestral, 0) / report.estudiantes.length).toFixed(1)
    : '0';

  const rows = report.estudiantes.map((e, idx) => `
    <tr>
      <td>${idx + 1}</td><td>${e.studentId}</td><td>${e.studentName}</td>
      <td>${e.sesionesGrupal}</td><td>${e.sesionesIndividual}</td><td>${e.sesionesGrupal + e.sesionesIndividual}</td>
      <td>${e.canalizaciones.primerSeguimiento.join(',') || '—'}</td>
      <td>${e.canalizaciones.segundoSeguimiento.join(',') || '—'}</td>
      <td>${e.canalizaciones.tercerSeguimiento.join(',') || '—'}</td>
      <td>${e.observaciones || '—'}</td>
      <td>${e.cambioTutor ? 'Sí' : 'No'}</td><td>${e.cambioCarrera ? 'Sí' : 'No'}</td><td>${e.cambioInstituto ? 'Sí' : 'No'}</td>
      <td>${e.cursosEspeciales.join(', ') || '—'}</td><td>${e.repiteCursos.join(', ') || '—'}</td>
      <td>${e.totalMateriasReprobadas}</td><td>${e.promedioSemestral.toFixed(1)}</td><td>${e.boletaEntregada ? 'Sí' : 'No'}</td>
    </tr>`).join('');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>REPORTE SEMESTRAL – ${report.periodo}</title>
  <style>
    @page { size: letter landscape; margin: 1.2cm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
      font-size: 8px; color: #1e293b; padding: 24px;
      background: linear-gradient(135deg, #eff6ff 0%, #eef2ff 100%);
    }
    .card {
      background: rgba(255,255,255,0.95);
      border-radius: 16px;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05);
      padding: 20px;
    }
    .header { text-align: center; margin-bottom: 14px; }
    .header h2 { font-size: 15px; margin: 0; font-weight: 700; color: #1e3a5f; letter-spacing: -0.3px; }
    .header h3 { font-size: 11px; margin: 2px 0 0; color: #475569; font-weight: 500; }
    .header p { font-size: 9px; margin: 4px 0; color: #64748b; }
    .info { display: flex; flex-wrap: wrap; gap: 4px 20px; margin-bottom: 12px; font-size: 8px; color: #475569; }
    .info strong { color: #1e293b; }
    table { width: 100%; border-collapse: separate; border-spacing: 0; }
    th, td { border: 1px solid #cbd5e1; padding: 3px 4px; text-align: center; }
    thead tr:first-child th {
      background: linear-gradient(180deg, #f0f4ff 0%, #e2e8f0 100%);
      font-weight: 700; font-size: 7px; color: #1e3a5f;
    }
    thead tr:nth-child(2) th {
      background: #f8fafc; font-weight: 600; font-size: 6.5px; color: #334155;
    }
    tbody tr:nth-child(even) { background: #f8fafc; }
    .bg-blue { background: #dbeafe; }
    .bg-amber { background: #fef3c7; }
    .bg-red { background: #fee2e2; }
    .text-red { color: #dc2626; font-weight: 700; }
    tfoot td { font-weight: 700; background: linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 100%); }
    .signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 44px; margin-top: 28px; }
    .sig-box { text-align: center; }
    .sig-line { border-top: 1px solid #94a3b8; margin-top: 34px; margin-bottom: 4px; }
    .sig-label { font-size: 8px; color: #64748b; font-weight: 500; }
    .legend { margin-top: 12px; font-size: 7px; color: #64748b; }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white !important; }
      .card { box-shadow: none; border: 1px solid #e2e8f0; }
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h2>Instituto Tecnológico de Orizaba</h2>
      <h3>Departamento de Sistemas y Computación</h3>
      <p>REPORTE SEMESTRAL DE ACTIVIDADES DEL TUTOR — Documento 5</p>
    </div>
    <div class="info">
      <span><strong>Tutor:</strong> ${report.tutorName}</span>
      <span><strong>Carrera:</strong> ${report.carrera}</span>
    <span><strong>Periodo:</strong> ${report.periodo} (${report.semestre})</span>
      <span><strong>Entrega:</strong> ${report.fechaEntrega}</span>
      <span><strong>Tutorados históricos:</strong> ${report.totalTutoradosDesdePrimerSemestre}</span>
      <span><strong>Tutorados este semestre:</strong> ${report.totalTutoradosEsteSemestre}</span>
    </div>
    <table>
      <thead>
        <tr>
          <th rowspan="2">No.</th><th rowspan="2">Control</th><th rowspan="2">Nombre</th>
          <th colspan="3" class="bg-blue">Sesiones</th>
        <th colspan="3" class="bg-amber">Canalizaciones</th>
        <th rowspan="2">Observaciones</th>
        <th rowspan="2">Cambio<br>Tutor</th><th rowspan="2">Cambio<br>Carrera</th><th rowspan="2">Cambio<br>Inst.</th>
        <th rowspan="2">Curso<br>Especial</th><th rowspan="2">Repite<br>Curso</th>
        <th rowspan="2" class="bg-red">MR</th><th rowspan="2">Prom.</th><th rowspan="2">Boleta</th>
      </tr>
      <tr>
        <th class="bg-blue">G</th><th class="bg-blue">I</th><th class="bg-blue">T</th>
        <th class="bg-amber">1°</th><th class="bg-amber">2°</th><th class="bg-amber">3°</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
    <tfoot>
      <tr>
        <td colspan="3">Totales</td>
        <td>${t}</td><td>${i}</td><td>${t + i}</td>
        <td colspan="3">—</td>
        <td colspan="5">—</td>
        <td class="text-red">${mr}</td><td>${prom}</td><td>${boletas}/${report.estudiantes.length}</td>
      </tr>
    </tfoot>
  </table>
  <div class="legend">
    <strong>Canalizaciones:</strong> 1=Asesoría académica, 2=Servicio Médico, 3=Servicio Psicopedagógico, 4=Beca, 5=Otros. &nbsp; S=Seguimiento.
  </div>
  <div class="signatures">
    <div class="sig-box"><div class="sig-line"></div><div class="sig-label">Firma del Tutor<br>${report.tutorName}</div></div>
    <div class="sig-box"><div class="sig-line"></div><div class="sig-label">Vo.Bo. Coordinador de Tutoría</div></div>
  </div>
  <p style="margin-top:16px;font-size:7px;color:#94a3b8;text-align:center;">Generado desde TutorTec — ${new Date().toLocaleDateString('es-MX')}</p>
  </div>
</body>
</html>`;
}
