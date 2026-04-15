import type { Student } from '@/types/student.types';
import type { Subject } from '@/types/subject.types';
import { getNextAttemptLevel } from './subject-level.utils';

export interface ValidationViolation {
    type: 'credit-excess' | 'credit-deficit' | 'prerequisite-missing' | 'subject-unavailable' | 'special-requires-authorization';
    message: string;
    subjectCode?: string;
}

/**
 * Verifica si un estudiante cumple con los prerequisitos de una materia.
 * Solo considera materias aprobadas (sin importar el nivel en que se aprobaron).
 */
export function validatePrerequisites(student: Student, subject: Subject): boolean {
    const approvedCodes = student.academicHistory
        .filter(attempt => attempt.status === 'aprobado')
        .map(attempt => attempt.subjectCode);

    return subject.prerequisites.every(prereq => approvedCodes.includes(prereq));
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

    // 2. Validación por cada materia seleccionada
    selectedSubjects.forEach(subject => {
        // 2.1 Prerrequisitos
        if (!validatePrerequisites(student, subject)) {
            violations.push({
                type: 'prerequisite-missing',
                message: `Falta aprobar prerequisitos para ${subject.name} (${subject.code})`,
                subjectCode: subject.code,
            });
        }

        // 2.2 Verificar si la materia ya fue aprobada (no debería seleccionarse de nuevo en flujo normal)
        const approved = student.academicHistory.some(
            a => a.subjectCode === subject.code && a.status === 'aprobado'
        );
        if (approved) {
            violations.push({
                type: 'subject-unavailable',
                message: `La materia ${subject.name} ya fue aprobada anteriormente.`,
                subjectCode: subject.code,
            });
        }

        // 2.3 Verificar disponibilidad según nivel (baja definitiva)
        const attemptsForSubject = student.academicHistory.filter(a => a.subjectCode === subject.code);
        const nextLevel = getNextAttemptLevel(attemptsForSubject);
        if (nextLevel === null) {
            // Puede ser null porque ya está en baja definitiva o porque ya aprobó (ya cubierto arriba)
            const last = attemptsForSubject[attemptsForSubject.length - 1];
            if (last && last.level === 6 && last.status === 'reprobado') {
                violations.push({
                    type: 'subject-unavailable',
                    message: `La materia ${subject.name} no puede cursarse nuevamente (baja definitiva).`,
                    subjectCode: subject.code,
                });
            }
        }

        // 2.4 Materia especial requiere autorización explícita (se marcará en el wizard)
        if (subject.isSpecial) {
            // En esta fase solo advertimos; en el wizard se pedirá confirmación
            violations.push({
                type: 'special-requires-authorization',
                message: `La materia ${subject.name} es especial y requiere autorización del tutor.`,
                subjectCode: subject.code,
            });
        }
    });

    return violations;
}