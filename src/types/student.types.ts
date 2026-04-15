/**
 * Representa los 6 niveles académicos posibles.
 * 1 = Ordinario - Evaluación ordinaria
 * 2 = Ordinario - Segunda oportunidad
 * 3 = Repite - Evaluación ordinaria
 * 4 = Repite - Segunda oportunidad
 * 5 = Especial - Evaluación ordinaria
 * 6 = Especial - Segunda oportunidad
 */
export type AcademicLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface SubjectAttempt {
    subjectCode: string;
    level: AcademicLevel;                // Nivel exacto en que se cursó/está cursando
    status: 'aprobado' | 'reprobado' | 'en-curso';
    grade?: number;                      // Calificación numérica (0-100)
    semester: string;                    // Ej: "2025A"
    source: 'cardex' | 'boleta' | 'manual'; // Fuente de verdad (cardex tiene prioridad)
    failureReason?: {
        category: 'personal' | 'salud' | 'trabajo' | 'academico' | 'otro';
        description?: string;
    };
}

export interface Student {
    id: string;
    firstName: string;
    lastName: string;
    studentId: string;                   // Matrícula
    enrolledProgram: string;
    academicHistory: SubjectAttempt[];   // Historial de intentos (todos los niveles)
}