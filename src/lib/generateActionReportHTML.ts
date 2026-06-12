export interface ActionReportData {
    carrera: string;
    tutorName: string;
    periodo: string;        // "Ene-Jun 2026"
    semestre: string;       // "2026-A"
    // Columna izquierda — designados
    designadosCambioTutor: number;
    designadosCambioCarrera: number;
    designadosCambioInstituto: number;
    asignadosDesdePrimerSemestre: number;
    // Columna derecha — dejaron
    dejaronCambioTutor: number;
    dejaronCambioCarrera: number;
    dejaronCambioInstituto: number;
    desertores: number;
    bajaDefinitivaPrimerSemestre: number;
    // Otros datos
    boletasEntregadas: number;
    sesionesGrupales: number;
    sesionesIndividuales: number;
    estudiantesCanalizados: number;
    alumnosCon1CursoEspecial: number;
    alumnosCon2CursosEspeciales: number;
    alumnosCon1Reprobada: number;
    alumnosCon2OMasReprobadas: number;
    totalTutoradosEsteSemestre: number;
}

export function getMockActionReportData(): ActionReportData {
    const designados = 3 + 1 + 0;
    const dejaron = 2 + 0 + 1 + 4 + 2;
    return {
        carrera: 'Ingeniería en Sistemas Computacionales',
        tutorName: 'Mtra. Laura Sánchez',
        periodo: 'Ene-Jun 2026',
        semestre: '2026-A',
        designadosCambioTutor: 3,
        designadosCambioCarrera: 1,
        designadosCambioInstituto: 0,
        asignadosDesdePrimerSemestre: 28,
        dejaronCambioTutor: 2,
        dejaronCambioCarrera: 0,
        dejaronCambioInstituto: 1,
        desertores: 4,
        bajaDefinitivaPrimerSemestre: 2,
        boletasEntregadas: 25,
        sesionesGrupales: 8,
        sesionesIndividuales: 15,
        estudiantesCanalizados: 10,
        alumnosCon1CursoEspecial: 3,
        alumnosCon2CursosEspeciales: 1,
        alumnosCon1Reprobada: 5,
        alumnosCon2OMasReprobadas: 2,
        totalTutoradosEsteSemestre: designados + 28 - dejaron,
    };
}

export function generateActionReportHTML(data: ActionReportData): string {
    const izquierda = data.designadosCambioTutor + data.designadosCambioCarrera + data.designadosCambioInstituto + data.asignadosDesdePrimerSemestre;
    const derecha = data.dejaronCambioTutor + data.dejaronCambioCarrera + data.dejaronCambioInstituto + data.desertores + data.bajaDefinitivaPrimerSemestre;
    const total = izquierda - derecha;

    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>REPORTE SEMESTRAL DE LA ACCIÓN TUTORIAL</title>
  <style>
    @page { size: letter portrait; margin: 1.5cm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
      font-size: 11px; color: #1e293b; padding: 28px;
      background: linear-gradient(135deg, #eff6ff 0%, #eef2ff 100%);
    }
    .card {
      background: rgba(255,255,255,0.95);
      border-radius: 16px;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05);
      padding: 28px;
    }
    .header { text-align: center; margin-bottom: 16px; }
    .header h2 { font-size: 15px; color: #1e3a5f; margin: 0 0 3px; font-weight: 700; }
    .header h3 { font-size: 12px; color: #475569; margin: 0 0 8px; font-weight: 500; }
    .header h4 { font-size: 13px; color: #1e3a5f; margin: 0 0 2px; font-weight: 700; }
    .header p { font-size: 9px; color: #64748b; margin: 3px 0; }
    .info { margin-bottom: 14px; font-size: 10px; color: #475569; }
    .info span { margin-right: 24px; }
    .section { margin-bottom: 18px; }
    .section-title {
      font-size: 11px; font-weight: 700; color: #1e3a5f;
      border-bottom: 1.5px solid #cbd5e1; padding-bottom: 4px; margin-bottom: 10px;
      text-transform: uppercase; letter-spacing: 0.4px;
    }
    table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
    th, td { border: 1px solid #94a3b8; padding: 5px 8px; }
    th { background: #f1f5f9; font-weight: 700; font-size: 9px; color: #1e3a5f; text-align: center; }
    td { font-size: 10px; }
    td.num { text-align: center; width: 60px; font-weight: 600; }
    td.label { text-align: left; }
    .highlight { background: #fef3c7; font-weight: 700; font-size: 11px; }
    .note { font-size: 8px; color: #64748b; font-style: italic; margin-top: 4px; }
    .signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 44px; margin-top: 32px; }
    .sig-box { text-align: center; }
    .sig-line { border-top: 1px solid #94a3b8; margin-top: 40px; margin-bottom: 4px; }
    .sig-label { font-size: 9px; color: #64748b; font-weight: 500; }
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
      <h4>REPORTE SEMESTRAL DE LA ACCIÓN TUTORIAL</h4>
      <p>Propósito: Generar los indicadores de desempeño en la acción tutorial.</p>
    </div>

    <div class="info">
      <span><strong>Carrera:</strong> ${data.carrera}</span>
      <span><strong>Tutor:</strong> ${data.tutorName}</span>
      <span><strong>Periodo:</strong> ${data.periodo}</span>
      <span><strong>Semestre:</strong> ${data.semestre}</span>
    </div>

    <!-- Sección 1 -->
    <div class="section">
      <div class="section-title">1. Alumnos atendidos en el Programa Institucional de Tutoría</div>
      <table>
        <thead>
          <tr>
            <th colspan="2">No. de tutorados designados debido a:</th>
            <th colspan="2">No. de estudiantes que dejó de tutorar debido a:</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="label">a) Cambio de Tutor</td><td class="num">${data.designadosCambioTutor}</td>
            <td class="label">a) Cambio de Tutor</td><td class="num">${data.dejaronCambioTutor}</td>
          </tr>
          <tr>
            <td class="label">b) Cambio de carrera</td><td class="num">${data.designadosCambioCarrera}</td>
            <td class="label">b) Cambio de carrera</td><td class="num">${data.dejaronCambioCarrera}</td>
          </tr>
          <tr>
            <td class="label">c) Cambio de instituto</td><td class="num">${data.designadosCambioInstituto}</td>
            <td class="label">c) Cambio de instituto</td><td class="num">${data.dejaronCambioInstituto}</td>
          </tr>
          <tr>
            <td class="label">Número de tutorados asignados desde primer semestre</td><td class="num">${data.asignadosDesdePrimerSemestre}</td>
            <td class="label">No. de estudiantes desertores</td><td class="num">${data.desertores}</td>
          </tr>
          <tr>
            <td></td><td></td>
            <td class="label">Alumnos de 1er. Semestre dados de baja definitiva al no acreditar al menos 3 materias</td><td class="num">${data.bajaDefinitivaPrimerSemestre}</td>
          </tr>
          <tr>
            <td class="label" style="font-weight:700;">TOTAL</td><td class="num" style="font-size:12px;">${izquierda}</td>
            <td class="label" style="font-weight:700;">TOTAL</td><td class="num" style="font-size:12px;">${derecha}</td>
          </tr>
          <tr>
            <td colspan="4" class="highlight" style="text-align:center;">
              No. Total de Estudiantes Tutorados Durante Este Semestre: <strong>${total}</strong>
              &nbsp;(Total izquierda ${izquierda} − Total derecha ${derecha})
            </td>
          </tr>
        </tbody>
      </table>
      <p class="note">Nota: Para obtener el No. Total de estudiantes tutorados durante el semestre; al total de la primera columna, restarle el resultado de la segunda columna.</p>
    </div>

    <!-- Sección 2 -->
    <div class="section">
      <div class="section-title">2. Otros datos de interés</div>
      <table>
        <tbody>
          <tr><td class="label">Boletas entregadas o asignación de carga</td><td class="num">${data.boletasEntregadas}</td></tr>
          <tr><td class="label">Número de alumnos con 1 curso especial</td><td class="num">${data.alumnosCon1CursoEspecial}</td></tr>
          <tr><td class="label">Número de sesiones grupales</td><td class="num">${data.sesionesGrupales}</td></tr>
          <tr><td class="label">Número de alumnos con 2 cursos especiales</td><td class="num">${data.alumnosCon2CursosEspeciales}</td></tr>
          <tr><td class="label">Número de sesiones individuales</td><td class="num">${data.sesionesIndividuales}</td></tr>
          <tr><td class="label">Número de alumnos atendidos con 1 materia reprobada</td><td class="num">${data.alumnosCon1Reprobada}</td></tr>
          <tr><td class="label">No. de Estudiantes canalizados</td><td class="num">${data.estudiantesCanalizados}</td></tr>
          <tr><td class="label">Número de alumnos atendidos con 2 o más materias reprobadas</td><td class="num">${data.alumnosCon2OMasReprobadas}</td></tr>
        </tbody>
      </table>
    </div>

    <!-- Firmas -->
    <div class="signatures">
      <div class="sig-box">
        <div class="sig-line"></div>
        <div class="sig-label">Nombre y firma del Tutor<br>${data.tutorName}</div>
      </div>
      <div class="sig-box">
        <div class="sig-line"></div>
        <div class="sig-label">Nombre y firma del Coordinador<br>del Programa Académico de Tutoría</div>
      </div>
    </div>
  </div>
</body>
</html>`;
}
