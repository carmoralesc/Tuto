import type { Student } from '@/types/student.types';
import type { Subject } from '@/types/subject.types';
import { getNextAttemptLevel } from './subject-level.utils';

export interface ValidationViolation {
    type: 'credit-excess' | 'credit-deficit' | 'prerequisite-missing' | 'subject-unavailable' | 'special-requires-authorization';
    message: string;
    subjectCode?: string;
}

/**
 * Obtiene un Set con los códigos de materias aprobadas.
 * Asumimos que el historial guarda `subjectCode` que corresponde al `code` del Subject.
 */
export function getApprovedIds(student: Student): Set<string> {
    return new Set(
        student.academicHistory
            .filter(attempt => attempt.status === 'aprobado')
            .map(attempt => attempt.subjectCode)
    );
}

/**
 * Verifica si un estudiante cumple con los prerrequisitos de una materia usando un Set de aprobadas.
 */
export function hasPrerequisites(subject: Subject, approved: Set<string>): boolean {
    return subject.prerequisites.every(prereq => approved.has(prereq));
}

/**
 * Versión anterior basada en estudiante, mantenida por compatibilidad (llama a la nueva).
 */
export function validatePrerequisites(student: Student, subject: Subject): boolean {
    const approved = getApprovedIds(student);
    return hasPrerequisites(subject, approved);
}

/**
 * Calcula el total de créditos de una lista de materias.
 */
export function calculateTotalCredits(subjects: Subject[]): number {
    return subjects.reduce((sum, s) => sum + s.credits, 0);
}

/**
 * Detecta todas las violaciones en una propuesta de carga académica.
 */
export function detectViolations(
    student: Student,
    selectedSubjects: Subject[],
    options?: { minCredits?: number; maxCredits?: number }
): ValidationViolation[] {
    const violations: ValidationViolation[] = [];
    const min = options?.minCredits ?? 20;
    const max = options?.maxCredits ?? 36;

    // 1. Validación de créditos
    const total = calculateTotalCredits(selectedSubjects);
    if (total < min) {
        violations.push({
            type: 'credit-deficit',
            message: `Créditos insuficientes: ${total} (mínimo ${min})`,
        });
    }
    if (total > max) {
        violations.push({
            type: 'credit-excess',
            message: `Exceso de créditos: ${total} (máximo ${max})`,
        });
    }

    const approved = getApprovedIds(student);

    // 2. Validación por cada materia seleccionada
    selectedSubjects.forEach(subject => {
        // 2.1 Prerrequisitos
        if (!hasPrerequisites(subject, approved)) {
            violations.push({
                type: 'prerequisite-missing',
                message: `Falta aprobar prerrequisitos para ${subject.name} (${subject.code})`,
                subjectCode: subject.id,
            });
        }


        // 2.3 Verificar disponibilidad según nivel (baja definitiva)
        // 2.2 Verificar si ya fue aprobada
        if (approved.has(subject.code)) {
            violations.push({
                type: 'subject-unavailable',
                message: `La materia ${subject.name} ya fue aprobada anteriormente.`,
                subjectCode: subject.code,
            });
        }

        const attemptsForSubject = student.academicHistory.filter(a => a.subjectCode === subject.code);
        const nextLevel = getNextAttemptLevel(attemptsForSubject);
        if (nextLevel === null) {
            const last = attemptsForSubject[attemptsForSubject.length - 1];
            if (last && last.level === 6 && last.status === 'reprobado') {
                violations.push({
                    type: 'subject-unavailable',
                    message: `La materia ${subject.name} no puede cursarse nuevamente (baja definitiva).`,
                    subjectCode: subject.id,
                });
            }
        }
    });

    return violations;
}