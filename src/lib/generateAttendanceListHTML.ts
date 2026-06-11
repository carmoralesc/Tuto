interface AttendanceStudent {
    name: string;
}

export function generateAttendanceListHTML(
    students: AttendanceStudent[],
    attendances: Record<number, boolean[]>,
    carrera: string,
    tutorName: string,
    semestreCursado: string,
): string {
    const rows = students
        .map(
            (s, idx) => `
    <tr>
      <td class="num">${idx + 1}</td>
      <td class="name">${s.name}</td>
      ${Array.from({ length: 16 }, (_, w) => {
                const present = attendances[idx]?.[w] ?? false;
                return `<td class="week">${present ? 'X' : ''}</td>`;
            }).join('')}
    </tr>`,
        )
        .join('');

    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>LISTA DE ASISTENCIA – ${carrera}</title>
  <style>
    @page { size: letter landscape; margin: 1.2cm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
      font-size: 10px; color: #1e293b; padding: 24px;
      background: linear-gradient(135deg, #eff6ff 0%, #eef2ff 100%);
    }
    .card {
      background: rgba(255,255,255,0.95);
      border-radius: 16px;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05);
      padding: 24px;
    }
    .header { text-align: center; margin-bottom: 16px; }
    .header h2 { font-size: 16px; color: #1e3a5f; margin: 0 0 2px; font-weight: 700; letter-spacing: -0.3px; }
    .header h3 { font-size: 13px; color: #1e3a5f; margin: 0 0 8px; font-weight: 700; }
    .header p { font-size: 9px; color: #475569; margin: 2px 0; }
    table { width: 100%; border-collapse: separate; border-spacing: 0; }
    th, td {
      border: 1px solid #cbd5e1; padding: 4px 5px;
    }
    thead tr:first-child th {
      background: linear-gradient(180deg, #f0f4ff 0%, #e2e8f0 100%);
      font-weight: 700; font-size: 8px; color: #1e3a5f; text-align: center;
    }
    thead tr:nth-child(2) th {
      background: #f8fafc; font-weight: 600; font-size: 7.5px; color: #334155;
    }
    tbody tr:nth-child(even) { background: #f8fafc; }
    .num { width: 30px; text-align: center; }
    .name { text-align: left; min-width: 180px; }
    .week { width: 24px; text-align: center; font-size: 9px; font-weight: 700; color: #2563eb; }
    .signatures { display: flex; justify-content: space-between; margin-top: 28px; font-size: 9px; }
    .sig-box { text-align: center; min-width: 160px; }
    .sig-line { border-top: 1px solid #94a3b8; margin-bottom: 4px; }
    .sig-label { color: #64748b; font-weight: 500; }
    .footer { text-align: center; margin-top: 20px; font-size: 8px; color: #94a3b8; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white !important; } .card { box-shadow: none; border: 1px solid #e2e8f0; } }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h2>Instituto Tecnológico de Orizaba</h2>
      <h3>LISTA DE ASISTENCIA</h3>
      <p><strong>Carrera:</strong> ${carrera}</p>
      <p><strong>Tutor:</strong> ${tutorName}</p>
      <p><strong>Periodo:</strong> Ene-Jun 2026 (2026-A) &nbsp;|&nbsp; <strong>Semestre cursado:</strong> ${semestreCursado}°</p>
    </div>
    <table>
      <thead>
        <tr>
          <th rowspan="2" class="num">No.</th>
          <th rowspan="2" class="name">NOMBRE</th>
          <th colspan="16">SEMANAS</th>
        </tr>
        <tr>
          ${Array.from({ length: 16 }, (_, w) => `<th>${w + 1}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
    <div class="signatures">
      <div class="sig-box">
        <div class="sig-line"></div>
        <div class="sig-label">${tutorName}<br>Tutor</div>
      </div>
      <div class="sig-box">
        <div class="sig-line"></div>
        <div class="sig-label">Coordinador de Tutoría</div>
      </div>
    </div>
    <div class="footer">Generado desde TutorTec — ${new Date().toLocaleDateString('es-MX')}</div>
  </div>
</body>
</html>`;
}

/** Genera asistencias mock con ~70% de probabilidad de true */
export function generateMockAttendances(studentCount: number): Record<number, boolean[]> {
    const result: Record<number, boolean[]> = {};
    for (let i = 0; i < studentCount; i++) {
        result[i] = Array.from({ length: 16 }, () => Math.random() < 0.7);
    }
    return result;
}
