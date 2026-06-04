import type { StudentTrackingData } from '@/types/student-tracking.types';

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
    @page { size: letter landscape; margin: 1cm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; font-size: 9px; color: #111; padding: 20px; }
    .header { text-align: center; margin-bottom: 12px; }
    .header h2 { font-size: 14px; margin: 0; }
    .header h3 { font-size: 12px; margin: 2px 0 0; }
    .header p { font-size: 9px; margin: 4px 0; }
    .info { margin-bottom: 8px; font-size: 9px; }
    .info span { margin-right: 20px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #444; padding: 3px 4px; text-align: center; }
    th { background: #e5e7eb; font-weight: bold; }
    .bg-blue { background: #dbeafe; }
    .bg-green { background: #dcfce7; }
    .bg-red { background: #fee2e2; }
    .text-green { color: #166534; font-weight: bold; }
    .text-gray { color: #9ca3af; }
    .text-red { color: #dc2626; font-weight: bold; }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h2>Instituto Tecnológico de Orizaba</h2>
    <h3>Departamento de Sistemas y Computación</h3>
    <p>SEGUIMIENTO TUTORIAL (Sábana) &mdash; Documento 4</p>
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
  <p style="margin-top:16px;font-size:8px;color:#6b7280;">Generado desde TutorTec &mdash; ${new Date().toLocaleDateString('es-MX')}</p>
</body>
</html>`;
}
