import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
    SemesterReport,
    StudentSemesterReport,
    Canalizacion,
} from '@/types/semester-report.types';

function emptyCanalizacion(): Canalizacion {
    return {
        primerSeguimiento: [],
        segundoSeguimiento: [],
        tercerSeguimiento: [],
        asistioPrimerSeguimiento: true,
        asistioSegundoSeguimiento: true,
        asistioTercerSeguimiento: true,
    };
}

function makeStudentReport(
    studentId: string,
    studentName: string,
    overrides: Partial<StudentSemesterReport> = {},
): StudentSemesterReport {
    return {
        studentId,
        studentName,
        sesionesGrupal: 0,
        sesionesIndividual: 0,
        canalizaciones: emptyCanalizacion(),
        observaciones: '',
        cambioTutor: false,
        cambioCarrera: false,
        cambioInstituto: false,
        cursosEspeciales: [],
        repiteCursos: [],
        totalMateriasReprobadas: 0,
        promedioSemestral: 0,
        boletaEntregada: false,
        ...overrides,
    };
}

const mockReport: SemesterReport = {
    id: 'rep-2026A-001',
    periodo: 'Ene-Jun 2026',
    semestre: '2026-A',
    carrera: 'Ingeniería en Sistemas Computacionales',
    tutorName: 'Mtra. Laura Sánchez',
    fechaEntrega: '2026-06-10',
    totalTutoradosDesdePrimerSemestre: 7,
    totalTutoradosEsteSemestre: 7,
    estudiantes: [
        makeStudentReport('A00123456', 'María González López', {
            sesionesGrupal: 3, sesionesIndividual: 2,
            canalizaciones: {
                primerSeguimiento: [1], segundoSeguimiento: [3], tercerSeguimiento: [],
                asistioPrimerSeguimiento: true, asistioSegundoSeguimiento: false, asistioTercerSeguimiento: true,
            },
            observaciones: 'Buena disposición. Mejoró en cálculo.',
            totalMateriasReprobadas: 1, promedioSemestral: 82, boletaEntregada: true,
        }),
        makeStudentReport('A00123457', 'Luis Ángel Hernández García', {
            sesionesGrupal: 2, sesionesIndividual: 0,
            canalizaciones: {
                primerSeguimiento: [1, 3], segundoSeguimiento: [2], tercerSeguimiento: [],
                asistioPrimerSeguimiento: true, asistioSegundoSeguimiento: true, asistioTercerSeguimiento: true,
            },
            observaciones: 'Requiere seguimiento cercano en programación.',
            totalMateriasReprobadas: 3, promedioSemestral: 68, boletaEntregada: true,
            cursosEspeciales: ['Fundamentos de Programación'],
            repiteCursos: ['Cálculo Diferencial'],
        }),
        makeStudentReport('A00123458', 'Ana Cristina López Martínez', {
            sesionesGrupal: 4, sesionesIndividual: 0,
            canalizaciones: emptyCanalizacion(),
            observaciones: 'Excelente desempeño académico.',
            totalMateriasReprobadas: 0, promedioSemestral: 95, boletaEntregada: true,
        }),
        makeStudentReport('A00123459', 'Carlos Eduardo Ramírez Hernández', {
            sesionesGrupal: 1, sesionesIndividual: 3,
            canalizaciones: {
                primerSeguimiento: [1, 2, 3], segundoSeguimiento: [1, 3, 4], tercerSeguimiento: [1],
                asistioPrimerSeguimiento: true, asistioSegundoSeguimiento: false, asistioTercerSeguimiento: true,
            },
            observaciones: 'Alto riesgo. Múltiples canalizaciones activas.',
            cambioTutor: true,
            totalMateriasReprobadas: 4, promedioSemestral: 55, boletaEntregada: false,
            cursosEspeciales: ['Cálculo Integral', 'Matemáticas Discretas'],
            repiteCursos: ['Fundamentos de Programación'],
        }),
        makeStudentReport('A00123460', 'Sofía Alejandra Martínez Torres', {
            sesionesGrupal: 2, sesionesIndividual: 1,
            canalizaciones: {
                primerSeguimiento: [1], segundoSeguimiento: [], tercerSeguimiento: [],
                asistioPrimerSeguimiento: true, asistioSegundoSeguimiento: true, asistioTercerSeguimiento: true,
            },
            observaciones: 'Avance lento pero constante.',
            totalMateriasReprobadas: 2, promedioSemestral: 70, boletaEntregada: true,
        }),
        makeStudentReport('A00123461', 'Jorge Alberto Díaz Ramírez', {
            sesionesGrupal: 3, sesionesIndividual: 0,
            canalizaciones: emptyCanalizacion(),
            observaciones: 'Primer semestre. Adaptándose al ritmo.',
            totalMateriasReprobadas: 0, promedioSemestral: 78, boletaEntregada: true,
        }),
        makeStudentReport('A00123462', 'Fernanda Ortega Paredes', {
            sesionesGrupal: 3, sesionesIndividual: 2,
            canalizaciones: {
                primerSeguimiento: [3], segundoSeguimiento: [3, 5], tercerSeguimiento: [3],
                asistioPrimerSeguimiento: true, asistioSegundoSeguimiento: true, asistioTercerSeguimiento: true,
            },
            observaciones: 'En seguimiento psicopedagógico. Muy participativa.',
            cambioCarrera: true,
            totalMateriasReprobadas: 1, promedioSemestral: 80, boletaEntregada: true,
        }),
    ],
};

interface SemesterReportState {
    report: SemesterReport;
    updateStudentReport: (studentId: string, data: Partial<StudentSemesterReport>) => void;
    updateReportHeader: (data: Partial<Pick<SemesterReport, 'periodo' | 'semestre' | 'carrera' | 'fechaEntrega'>>) => void;
    getStudentReport: (studentId: string) => StudentSemesterReport | undefined;
}

export const useSemesterReportStore = create<SemesterReportState>()(
    persist(
        (set, get) => ({
            report: mockReport,

            updateStudentReport: (studentId, data) => {
                set((state) => ({
                    report: {
                        ...state.report,
                        estudiantes: state.report.estudiantes.map((e) =>
                            e.studentId === studentId ? { ...e, ...data } : e,
                        ),
                    },
                }));
            },

            updateReportHeader: (data) => {
                set((state) => ({
                    report: { ...state.report, ...data },
                }));
            },

            getStudentReport: (studentId) => {
                return get().report.estudiantes.find((e) => e.studentId === studentId);
            },
        }),
        { name: 'semester-report-storage' },
    ),
);
